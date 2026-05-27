import { describe, expect, test, beforeAll } from "bun:test";
import { classHighlighter } from "@lezer/highlight";
import { dualParse, getBridgeParser } from "./helpers/dual-parse";
import { loadLezerFixtures } from "./helpers/fixture-loader";
import { collectTaggedRanges, tagCategoryAgreement } from "./helpers/normalize-highlight";
import { THRESHOLDS } from "./thresholds";

describe("tier3 highlight comparison", () => {
	let fixtures: Awaited<ReturnType<typeof loadLezerFixtures>>;

	beforeAll(async () => {
		await getBridgeParser();
		fixtures = (await loadLezerFixtures(["statements"])).slice(0, 30);
	});

	test("bridge syntax tree includes keyword node types", async () => {
		const { bridgeTree } = await dualParse("SELECT * FROM person;");
		const kinds = new Set<string>();
		bridgeTree.cursor().iterate((node) => {
			if (node.type.name.toLowerCase().includes("keyword")) kinds.add(node.type.name);
		});
		expect(kinds.size).toBeGreaterThan(0);
	});

	test("loose tag category agreement vs lezer when lezer emits tags", async () => {
		let total = 0;
		let sum = 0;

		for (const { input } of fixtures) {
			if (!input.trim()) continue;
			const { lezerTree, bridgeTree } = await dualParse(input);
			const lr = collectTaggedRanges(lezerTree, classHighlighter);
			const br = collectTaggedRanges(bridgeTree, classHighlighter);
			if (lr.length === 0) continue;
			sum += tagCategoryAgreement(lr, br);
			total++;
		}

		// classHighlighter tags lezer LR trees; bridge uses styleTags on nodeSet (CM applies at render).
		// When lezer produces tags, require minimal overlap or skip if bridge has no classHighlighter tags.
		if (total > 0) {
			const agreement = sum / total;
			expect(agreement).toBeGreaterThanOrEqual(THRESHOLDS.tier3.tagCategoryAgreement);
		}
	});
});
