import {
	continuedIndent,
	indentNodeProp,
	foldNodeProp,
	foldInside,
	LRLanguage,
	LanguageSupport,
	syntaxTree,
} from "@codemirror/language";
import { linter, type Diagnostic, type LintSource } from "@codemirror/lint";

import { parser } from "@surrealdb/lezer";
import { NodeProp, parseMixed } from "@lezer/common";
import { parser as jsParser } from "@lezer/javascript";
import { surqlVersion } from "../../lezer-surrealql/src/version";

export const surrealqlLanguage = LRLanguage.define({
	name: "surrealql",
	parser: parser.configure({
		props: [
			indentNodeProp.add({
				Object: continuedIndent({ except: /^\s*}/ }),
				Array: continuedIndent({ except: /^\s*]/ }),
			}),
			foldNodeProp.add({
				"Object Array CombinedResult": foldInside,
			}),
		],
		wrap: parseMixed((node) => {
			return node.name === "JavaScriptContent" ? { parser: jsParser } : null;
		}),
	}),
	languageData: {
		closeBrackets: { brackets: ["[", "{", '"', "'", "("] },
		indentOnInput: /^\s*[\]}]$/,
		commentTokens: { line: "--", block: { open: "/*", close: "*/" } },
	},
});

type Scope ="permission" | "index" | "combined-results" | "syntax" | "all";
type Version = "v1.0.0" | "v1.1.0" | "v1.2.0" | "v1.3.0" | "v1.4.0" | "v1.5.0" | "v2.0.0";

const scopeMap = new Map<Scope, string>([
	["permission", "PermissionInput"],
	["index", "IndexInput"],
	["combined-results", "CombinedResults"],
	["syntax", "Syntax"],
]);

const supportedVersionsMap = new Map<Version, Version[]>([
	["v1.0.0", ["v1.0.0"]],
	["v1.1.0", ["v1.0.0", "v1.1.0"]],
	["v1.2.0", ["v1.0.0", "v1.1.0", "v1.2.0"]],
	["v1.3.0", ["v1.0.0", "v1.1.0", "v1.2.0", "v1.3.0"]],
	["v1.4.0", ["v1.0.0", "v1.1.0", "v1.2.0", "v1.3.0", "v1.4.0"]],
	["v1.5.0", ["v1.0.0", "v1.1.0", "v1.2.0", "v1.3.0", "v1.4.0", "v1.5.0"]],
	["v2.0.0", ["v1.0.0", "v1.1.0", "v1.2.0", "v1.3.0", "v1.4.0", "v1.5.0", "v2.0.0"]],
]);

function isValidVersion(version: unknown): version is Version {
	return typeof version === "string" && ["v1.0.0", "v1.1.0", "v1.2.0", "v1.3.0", "v1.4.0", "v1.5.0", "v2.0.0"].includes(version);
}

function surqlVersionLinter(version: Version): LintSource {
	console.log("using surqlVersionLinter");

	const supportedVersions = supportedVersionsMap.get(version);

	if (!supportedVersions) {
		throw new Error(`Unknown version: ${version}`);
	}

	return (view) => {
		const diagnostics: Diagnostic[] = [];

		syntaxTree(view.state).cursor().iterate((node) => {
			// FIXME: This is a hack to get the version prop, as for some reason the id used for finding it is 1 less then what i can read of the prop
			const prop = node.type.prop({ id: surqlVersion.id - 1 } as any);

			if (isValidVersion(prop)) {
				if (!supportedVersions.includes(prop)) {
					diagnostics.push({
						from: node.from,
						to: node.to,
						severity: "error",
						message: `This syntax is not supported untill version ${prop} of SurrealDB`,
					});
				}
			}
		});

		return diagnostics;
	}
}

/**
 * The CodeMirror extension used to add support for the SurrealQL language
 *
 * @param scope Limit the scope of the highlighting
 */
export function surrealql(scope?: Scope, version?: Version): LanguageSupport {
	console.log("using surql");

	if (!scope) {
		return new LanguageSupport(surrealqlLanguage);
	}

	const scopeId = scopeMap.get(scope);

	if (!scopeId && scope !== "all") {
		throw new Error(`Unknown language scope: ${scope}`);
	}

	return new LanguageSupport(surrealqlLanguage.configure({ top: scopeId }), version ? linter(surqlVersionLinter(version)) : undefined);
}
