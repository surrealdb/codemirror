import { describe, expect, test } from "bun:test";
import { EditorState } from "@codemirror/state";
import { syntaxTree, indentString } from "@codemirror/language";
import { surrealql, resetSurrealqlCache } from "../src/surrealql";

describe("tier4 editor behaviour", () => {
	test("language loads and provides commentTokens", async () => {
		resetSurrealqlCache();
		const support = await surrealql();
		const state = EditorState.create({
			doc: "SELECT * FROM person;",
			extensions: [support],
		});
		const tokens = state.languageDataAt("commentTokens", 0);
		expect(tokens[0]).toEqual({ line: "--", block: { open: "/*", close: "*/" } });
	});

	test("syntax tree is available after parse", async () => {
		resetSurrealqlCache();
		const support = await surrealql();
		const state = EditorState.create({
			doc: "SELECT * FROM person;",
			extensions: [support],
		});
		const tree = syntaxTree(state);
		expect(tree.length).toBe(state.doc.length);
		expect(tree.type.name).toBe("SurrealQL");
	});

	test("indent inside nested block", async () => {
		resetSurrealqlCache();
		const support = await surrealql();
		const doc = "DEFINE TABLE t {\n    name: string\n};";
		const state = EditorState.create({ doc, extensions: [support] });
		const indent = indentString(state, doc.indexOf("name"));
		expect(indent.length).toBeGreaterThan(0);
	});
});
