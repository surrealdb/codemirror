import { describe, expect, test, beforeAll } from "bun:test";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import {
	Parser,
	defaultWasmPaths,
	initTreeSitter,
	loadTreeSitterLanguage,
} from "@surrealdb/tree-sitter-lezer";
import { corpusDir, parseCorpusFile } from "./helpers/fixture-loader";

describe("tier0 corpus", () => {
	let parser: Parser;

	beforeAll(async () => {
		await initTreeSitter({ runtimeWasm: defaultWasmPaths().runtimeWasm });
		const lang = await loadTreeSitterLanguage();
		parser = new Parser();
		parser.setLanguage(lang);
	});

	test("all corpus cases match expected trees", async () => {
		const files = (await readdir(corpusDir)).filter((f) => f.endsWith(".txt")).sort();
		const failures: string[] = [];

		for (const file of files) {
			const content = await readFile(path.join(corpusDir, file), "utf8");
			for (const { name, input, expected } of parseCorpusFile(content, file)) {
				const tree = parser.parse(input);
				const actual = tree?.rootNode.toString() ?? "null";
				if (actual !== expected) {
					failures.push(`${file}: ${name}`);
				}
			}
		}

		expect(failures).toEqual([]);
	});
});
