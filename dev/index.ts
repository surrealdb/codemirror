import { crosshairCursor, drawSelection, dropCursor, EditorView, highlightActiveLineGutter, highlightSpecialChars, keymap, rectangularSelection } from "@codemirror/view";
import { surrealql, surrealqlVersionLinter } from "../packages/codemirror-surrealql/src/surrealql";
import { Compartment, EditorState } from "@codemirror/state";
import { bracketMatching, codeFolding, foldGutter, foldKeymap, HighlightStyle, indentOnInput, indentUnit, syntaxHighlighting } from "@codemirror/language";
import { defaultKeymap, history, indentWithTab } from "@codemirror/commands";
import { tags as t } from "@lezer/highlight";
import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete";


const parent = document.getElementById("root")!;

const themeComp = new Compartment();

const doc = `
-- Insert a record and return nothing
INSERT INTO company {
	name: 'SurrealDB',
	founded: "2021-09-10",
	founders: [person:tobie, person:jaime],
	tags: ['big data', 'database']
} RETURN NONE;
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
		surrealqlVersionLinter("1.0.0"),
		themeComp.of(syntaxHighlighting(HighlightStyle.define(
			[
				{ tag: t.string, color: "#00a547" },
				{ tag: t.comment, color: "#737e98" },
				{ tag: t.number, color: "#00b3d0" },
				{ tag: t.variableName, color: "#b82e2e" },
				{ tag: t.className, color: "#0084FF" },
				{ tag: [t.keyword, t.operator], color: "#ff009e" },
				{ tag: [t.punctuation, t.name], color: "#000000" },
				{ tag: [t.typeName, t.null, t.bool, t.literal], color: "#9D2FFF" },
				{ tag: t.function(t.name), color: "#e36d00" },
			]
		))),
	],
	parent,
});
