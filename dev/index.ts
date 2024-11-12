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
import { Compartment, EditorState } from "@codemirror/state";
import {
	EditorView,
	crosshairCursor,
	drawSelection,
	dropCursor,
	highlightActiveLineGutter,
	highlightSpecialChars,
	keymap,
	rectangularSelection,
} from "@codemirror/view";
import { tags as t } from "@lezer/highlight";
import { surrealql, surrealqlVersionLinter } from "../packages/codemirror-surrealql/src/surrealql";

const parent = document.getElementById("root");

if (!parent) {
	throw new Error("Could not find parent element");
}

const themeComp = new Compartment();

const doc = `
DEFINE SCOPE account
`;

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
		rectangularSelection(),
		crosshairCursor(),
		history(),
		closeBrackets(),
		keymap.of([
			indentWithTab,
			...closeBracketsKeymap,
			...defaultKeymap,
			...foldKeymap,
			...completionKeymap,
		]),
		indentUnit.of("    "),
		EditorState.allowMultipleSelections.of(true),
		EditorView.lineWrapping,
		surrealql(),
		surrealqlVersionLinter("2.0.0"),
		themeComp.of(
			syntaxHighlighting(
				HighlightStyle.define([
					{ tag: t.string, color: "#00a547" },
					{ tag: t.comment, color: "#737e98" },
					{ tag: t.number, color: "#00b3d0" },
					{ tag: t.variableName, color: "#b82e2e" },
					{ tag: t.className, color: "#0084FF" },
					{ tag: [t.keyword, t.operator], color: "#ff009e" },
					{ tag: [t.punctuation, t.name], color: "#000000" },
					{ tag: [t.typeName, t.null, t.bool, t.literal], color: "#9D2FFF" },
					{ tag: t.function(t.name), color: "#e36d00" },
				]),
			),
		),
	],
	parent,
});
