import {
	continuedIndent,
	indentNodeProp,
	foldNodeProp,
	foldInside,
	LRLanguage,
	LanguageSupport,
} from "@codemirror/language";

import { parser } from "@surrealdb/lezer";
import { parseMixed } from "@lezer/common";
import { parser as jsParser } from "@lezer/javascript";

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
 * The CodeMirror extension used to add support for the SurrealQL language
 * 
 * @param scope Limit the scope of the highlighting
 */
export function surrealql(scope?: Scope) {
	if (!scope) {
		return new LanguageSupport(surrealqlLanguage);
	}

	const scopeId = scopeMap.get(scope);

	if (!scopeId) {
		throw new Error(`Unknown language scope: ${scope}`);
	}

	return new LanguageSupport(surrealqlLanguage.configure({ top: scopeId }));
}
