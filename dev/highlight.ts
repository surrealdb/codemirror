import { highlightCode } from "@lezer/highlight";
import { parser } from "../packages/lezer-surrealql";
import { tags as t } from "@lezer/highlight";
import { HighlightStyle } from "@codemirror/language";

const highlighter =  HighlightStyle.define([
	{ tag: t.string, color: "#00a547" },
	{ tag: t.comment, color: "#737e98" },
	{ tag: t.number, color: "#00b3d0" },
	{ tag: t.variableName, color: "#b82e2e" },
	{ tag: t.className, color: "#0084FF" },
	{ tag: [t.keyword, t.operator], color: "#ff009e" },
	{ tag: [t.punctuation, t.name], color: "#000000" },
	{ tag: [t.typeName, t.null, t.bool, t.literal], color: "#9D2FFF" },
	{ tag: t.function(t.name), color: "#e36d00" },
]);

export function renderHighlighting(code: string) {
	const rendered = document.createElement("pre");
	const textColor = "#000000";

	function emit(text: string, classes?: string) {
		const textNode = document.createTextNode(text);
		const span = document.createElement("span");

		if (classes) {
			span.style.color = classes;
		} else {
			span.style.color = textColor;
		}

		span.append(textNode);
		rendered.append(span);
	}

	function emitBreak() {
		emit("\n");
	}

	highlightCode(
		code,
		parser.parse(code),
		highlighter,
		emit,
		emitBreak,
	);

	return rendered.outerHTML;
}
