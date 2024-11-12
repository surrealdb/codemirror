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
import { parser, sinceProp, untilProp } from "@surrealdb/lezer";
import { parseMixed } from "@lezer/common";
import { parser as jsParser } from "@lezer/javascript";
import type { Extension } from "@codemirror/state";
import { compare, compareVersions } from "compare-versions";

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

type Scope ="permission" | "index" | "combined-results" | "syntax";

const scopeMap = new Map<Scope, string>([
	["permission", "PermissionInput"],
	["index", "IndexInput"],
	["combined-results", "CombinedResults"],
	["syntax", "Syntax"],
]);

/**
 * A linter that checks if the syntax tree uses features that are not available in the given SurrealDB version
 *
 * @param version The SurrealDB version to check against (e.g. "2.0.0")
 */
export function surrealqlVersionLinter(version: string): Extension {
	return linter((view) => {
		const diagnostics: Diagnostic[] = [];

		syntaxTree(view.state).cursor().iterate((node) => {
			if (node.from === node.to) {
				return;
			}

			const sinceVersionProp = node.type.prop(sinceProp);
			const untilVersionProp = node.type.prop(untilProp);

			if (sinceVersionProp && compareVersions(version, sinceVersionProp) < 0) {
				diagnostics.push({
					from: node.from,
					to: node.to,
					severity: "error",
					message: `This syntax is only available on SurrealDB ${sinceVersionProp} and up`,
				});
			}

			if (untilVersionProp && compareVersions(version, untilVersionProp) > 0) {
				diagnostics.push({
					from: node.from,
					to: node.to,
					severity: "error",
					message: `This syntax is only available until SurrealDB ${untilVersionProp}`,
				});
			}
		});

		return diagnostics;
	});
}

/**
 * The CodeMirror extension used to add support for the SurrealQL language
 *
 * @param scope Limit the scope of the highlighting
 */
export function surrealql(scope?: Scope): LanguageSupport {
	if (!scope) {
		return new LanguageSupport(surrealqlLanguage);
	}

	const scopeId = scopeMap.get(scope);

	if (!scopeId) {
		throw new Error(`Unknown language scope: ${scope}`);
	}

	return new LanguageSupport(surrealqlLanguage.configure({ top: scopeId }));
}
