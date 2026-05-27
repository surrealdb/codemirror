import {
	autocompletion,
	closeBrackets,
	closeBracketsKeymap,
	completionKeymap,
} from "@codemirror/autocomplete";
import { defaultKeymap, history, indentWithTab } from "@codemirror/commands";
import {
	HighlightStyle,
	bracketMatching,
	codeFolding,
	foldGutter,
	foldKeymap,
	indentOnInput,
	indentUnit,
	syntaxHighlighting,
} from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import {
	EditorView,
	drawSelection,
	dropCursor,
	highlightActiveLineGutter,
	highlightSpecialChars,
	keymap,
} from "@codemirror/view";
import { tags as t } from "@lezer/highlight";
import { surrealql } from "../packages/codemirror-surrealql-tree-sitter/src/surrealql";

const parent = document.getElementById("root");

if (!parent) {
	throw new Error("Could not find parent element");
}

const doc = "SELECT * FROM person WHERE age > 18;";

const support = await surrealql();

new EditorView({
	doc,
	extensions: [
		highlightActiveLineGutter(),
		highlightSpecialChars(),
		codeFolding(),
		foldGutter(),
		drawSelection(),
		dropCursor(),
		indentOnInput(),
		bracketMatching(),
		autocompletion(),
		history(),
		closeBrackets(),
		keymap.of([indentWithTab, ...closeBracketsKeymap, ...defaultKeymap, ...foldKeymap, ...completionKeymap]),
		indentUnit.of("    "),
		EditorState.allowMultipleSelections.of(true),
		EditorView.lineWrapping,
		support,
		syntaxHighlighting(
			HighlightStyle.define([
				{ tag: t.string, color: "#00a547" },
				{ tag: t.comment, color: "#737e98" },
				{ tag: t.number, color: "#00b3d0" },
				{ tag: [t.keyword, t.operator], color: "#ff009e" },
				{ tag: t.function(t.name), color: "#e36d00" },
			]),
		),
	],
	parent,
});
