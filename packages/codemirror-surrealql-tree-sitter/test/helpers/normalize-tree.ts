import type { Tree } from "@lezer/common";
import { pascalCase } from "@surrealdb/tree-sitter-lezer";

const DROP_KINDS = new Set([
	"SemiColon",
	"Colon",
	"Comma",
	"Pipe",
	"Dot",
	"Expressions",
	"Expression",
	"SubqueryStatement",
	"BaseValue",
	"Value",
	"Predicate",
	"InclusivePredicate",
]);

const STATEMENT_KINDS = [
	"SelectStatement",
	"CreateStatement",
	"UpdateStatement",
	"DeleteStatement",
	"DefineStatement",
	"InsertStatement",
	"RelateStatement",
	"LetStatement",
	"IfStatement",
	"ForStatement",
	"ReturnStatement",
	"ThrowStatement",
	"UseStatement",
	"InfoStatement",
	"AlterStatement",
	"RemoveStatement",
	"ShowStatement",
	"SleepStatement",
	"LiveStatement",
	"RebuildStatement",
	"UpsertStatement",
	"BeginStatement",
	"CommitStatement",
	"CancelStatement",
];

export interface NormalizedSpan {
	kind: string;
	from: number;
	to: number;
}

export function normalizeKind(name: string): string {
	if (name === "SurrealQL" || name === "SourceFile") return "Document";
	if (name.startsWith("Keyword")) return "Keyword";
	if (DROP_KINDS.has(name)) return "";
	if (name === "Ident" || name === "Identifier") return "Identifier";
	return name;
}

export function collectSpans(tree: Tree): NormalizedSpan[] {
	const spans: NormalizedSpan[] = [];
	tree.cursor().iterate((node) => {
		if (node.from === node.to) return;
		const kind = normalizeKind(node.type.name);
		if (!kind) return;
		spans.push({ kind, from: node.from, to: node.to });
	});
	return spans;
}

export interface ComparisonScore {
	topKindMatch: number;
	statementKindMatch: number;
	spanOverlap: number;
	kindJaccard: number;
	depthDelta: number;
	leafKindOverlap: number;
}

function jaccard(a: Set<string>, b: Set<string>): number {
	if (a.size === 0 && b.size === 0) return 1;
	const inter = [...a].filter((x) => b.has(x)).length;
	const union = new Set([...a, ...b]).size;
	return union === 0 ? 0 : inter / union;
}

function findStatementKind(spans: NormalizedSpan[]): string | null {
	for (const s of spans) {
		if (STATEMENT_KINDS.includes(s.kind) || s.kind.endsWith("Statement")) {
			return s.kind;
		}
	}
	return null;
}

function maxDepth(tree: Tree): number {
	let max = 0;
	tree.cursor().iterate((node) => {
		let d = 0;
		for (let p = node.node.parent; p; p = p.parent) d++;
		if (d > max) max = d;
	});
	return max;
}

export function compareTreesLoose(
	lezerTree: Tree,
	bridgeTree: Tree,
	inputLength: number,
): ComparisonScore {
	const lezerSpans = collectSpans(lezerTree);
	const bridgeSpans = collectSpans(bridgeTree);

	const lezerKinds = new Set(lezerSpans.map((s) => s.kind));
	const bridgeKinds = new Set(bridgeSpans.map((s) => s.kind));

	const lezerTop = lezerSpans.find((s) => s.kind === "Document") ?? lezerSpans[0];
	const bridgeTop = bridgeSpans.find((s) => s.kind === "Document") ?? bridgeSpans[0];
	const topKindMatch = lezerTop && bridgeTop ? 1 : 0;

	const lezerStmt = findStatementKind(lezerSpans);
	const bridgeStmt = findStatementKind(bridgeSpans);
	const statementKindMatch =
		lezerStmt && bridgeStmt ? (lezerStmt === bridgeStmt ? 1 : 0) : lezerStmt || bridgeStmt ? 0 : 1;

	// Span overlap: bytes covered by any named node in both
	const covered = (spans: NormalizedSpan[]) => {
		const mask = new Uint8Array(inputLength);
		for (const s of spans) {
			for (let i = s.from; i < s.to && i < inputLength; i++) mask[i] = 1;
		}
		return mask;
	};
	const a = covered(lezerSpans);
	const b = covered(bridgeSpans);
	let overlap = 0;
	let either = 0;
	for (let i = 0; i < inputLength; i++) {
		if (a[i] || b[i]) either++;
		if (a[i] && b[i]) overlap++;
	}
	const spanOverlap = either === 0 ? 1 : overlap / either;

	const kindJaccard = jaccard(lezerKinds, bridgeKinds);

	const depthDelta = Math.abs(maxDepth(lezerTree) - maxDepth(bridgeTree));

	const leafKinds = (kinds: Set<string>) => {
		const leaf = new Set<string>();
		for (const k of kinds) {
			if (
				k === "Keyword" ||
				k === "Identifier" ||
				k.includes("String") ||
				k.includes("Number") ||
				k === "Comment"
			) {
				leaf.add(k);
			}
		}
		return leaf;
	};
	const leafKindOverlap = jaccard(leafKinds(lezerKinds), leafKinds(bridgeKinds));

	return {
		topKindMatch,
		statementKindMatch,
		spanOverlap,
		kindJaccard,
		depthDelta,
		leafKindOverlap,
	};
}

/** Map tree-sitter S-expression node name to comparable PascalCase */
export function tsNameToLezer(name: string): string {
	return pascalCase(name);
}
