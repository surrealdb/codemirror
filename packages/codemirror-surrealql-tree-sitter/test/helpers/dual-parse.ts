import type { Tree } from "@lezer/common";
import type { Parser as LezerParser } from "@lezer/common";
import {
	TreeSitterLezerParser,
	createTreeSitterLezerParser,
	defaultWasmPaths,
	hasErrorNode,
} from "@surrealdb/tree-sitter-lezer";
import { parser as lezerParser } from "@surrealdb/lezer";
import { extendNodeSet } from "../../src/node-props";

let bridgeParser: LezerParser | null = null;
let tsParserRaw: import("web-tree-sitter").Parser | null = null;

export async function getBridgeParser(): Promise<LezerParser> {
	if (!bridgeParser) {
		const paths = defaultWasmPaths();
		const bundle = await createTreeSitterLezerParser({
			runtimeWasm: paths.runtimeWasm,
			grammarWasm: paths.grammarWasm,
			nodeSet: { nameMap: { source_file: "SurrealQL" }, topType: "source_file" },
		});
		const nodeSet = extendNodeSet(bundle.nodeSet);
		bridgeParser = new TreeSitterLezerParser(
			bundle.tsParser,
			nodeSet,
			bundle.topID,
			bundle.idByName,
		);
		tsParserRaw = bundle.tsParser;
	}
	return bridgeParser;
}

export function getLezerParser(): LezerParser {
	return lezerParser;
}

export interface DualParseResult {
	lezerTree: Tree;
	bridgeTree: Tree;
	lezerError: string | null;
	bridgeError: string | null;
	bridgeHasTsError: boolean;
}

export async function dualParse(input: string): Promise<DualParseResult> {
	let lezerTree: Tree;
	let lezerError: string | null = null;
	try {
		lezerTree = lezerParser.parse(input) as Tree;
	} catch (e) {
		lezerError = String(e);
		lezerTree = lezerParser.parse("") as Tree;
	}

	const bridge = await getBridgeParser();
	let bridgeTree: Tree;
	let bridgeError: string | null = null;
	let bridgeHasTsError = false;

	try {
		bridgeTree = bridge.parse(input) as Tree;
		if (tsParserRaw) {
			const tsTree = tsParserRaw.parse(input);
			if (tsTree) bridgeHasTsError = hasErrorNode(tsTree.rootNode);
		}
	} catch (e) {
		bridgeError = String(e);
		bridgeTree = bridge.parse("") as Tree;
	}

	return { lezerTree, bridgeTree, lezerError, bridgeError, bridgeHasTsError };
}
