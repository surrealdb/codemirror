import { classHighlighter, highlightTree, styleTags, tags as t } from "@lezer/highlight";
import type { Tree } from "@lezer/common";
import type { Highlighter } from "@lezer/highlight";
import { surqlHighlighting } from "../../src/highlight";

const lezerTags: Highlighter = styleTags({
	Keyword: t.keyword,
	String: t.string,
	Comment: t.comment,
	Operator: t.operator,
	Ident: t.name,
}) as unknown as Highlighter;

export type TagCategory = "keyword" | "string" | "comment" | "operator" | "name" | "other";

export function categoryFromClasses(classes: string): TagCategory {
	if (classes.includes("keyword") || classes.includes("controlKeyword")) return "keyword";
	if (classes.includes("string") || classes.includes("regexp")) return "string";
	if (classes.includes("comment")) return "comment";
	if (classes.includes("operator")) return "operator";
	if (classes.includes("name") || classes.includes("variableName") || classes.includes("className"))
		return "name";
	return "other";
}

export interface TaggedRange {
	from: number;
	to: number;
	category: TagCategory;
}

export function collectTaggedRanges(tree: Tree, highlighter: Highlighter): TaggedRange[] {
	const ranges: TaggedRange[] = [];
	highlightTree(tree, highlighter, (from, to, classes) => {
		ranges.push({ from, to, category: categoryFromClasses(classes) });
	});
	return ranges;
}

export function tagCategoryAgreement(lezer: TaggedRange[], bridge: TaggedRange[]): number {
	if (lezer.length === 0) return 1;
	let matched = 0;
	for (const lr of lezer) {
		const mid = (lr.from + lr.to) / 2;
		const br = bridge.find((b) => b.from <= mid && b.to >= mid);
		if (br && br.category === lr.category) matched++;
	}
	return matched / lezer.length;
}
