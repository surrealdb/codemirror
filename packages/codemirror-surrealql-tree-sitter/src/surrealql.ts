import {
	Language,
	LanguageSupport,
	defaultHighlightStyle,
	defineLanguageFacet,
	languageDataProp,
	syntaxHighlighting,
} from "@codemirror/language";
import type { Parser } from "@lezer/common";
import {
	TreeSitterLezerParser,
	createTreeSitterLezerParser,
	defaultWasmPaths,
} from "@surrealdb/tree-sitter-lezer";
import { extendNodeSet } from "./node-props";
import { surqlHighlighting } from "./highlight";

let cached: Promise<LanguageSupport> | null = null;

const surrealqlFacet = defineLanguageFacet({
	commentTokens: { line: "--", block: { open: "/*", close: "*/" } },
	closeBrackets: { brackets: ["[", "{", '"', "'", "("] },
	indentOnInput: /^\s*[\]}]$/,
});

export interface SurrealqlOptions {
	runtimeWasm?: string;
	grammarWasm?: string;
}

/**
 * Load SurrealQL language support backed by tree-sitter WASM.
 * Must be awaited before attaching to an EditorView.
 */
export async function surrealql(options: SurrealqlOptions = {}): Promise<LanguageSupport> {
	if (!cached) {
		cached = (async () => {
			const paths = defaultWasmPaths();
			const bundle = await createTreeSitterLezerParser({
				runtimeWasm: options.runtimeWasm ?? paths.runtimeWasm,
				grammarWasm: options.grammarWasm ?? paths.grammarWasm,
				nodeSet: {
					nameMap: { source_file: "SurrealQL" },
					topType: "source_file",
				},
			});

			const nodeSet = extendNodeSet(bundle.nodeSet).extend(
				languageDataProp.add({ SurrealQL: surrealqlFacet }),
				surqlHighlighting,
			);

			const parser = new TreeSitterLezerParser(
				bundle.tsParser,
				nodeSet,
				bundle.topID,
				bundle.idByName,
			);

			const lang = new Language(surrealqlFacet, parser as unknown as Parser, [], "surrealql");
			return new LanguageSupport(lang, [
				syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
			]);
		})();
	}
	return cached;
}

/** Reset cached language (for tests). */
export function resetSurrealqlCache(): void {
	cached = null;
}
