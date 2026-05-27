import { describe, expect, test, beforeAll } from "bun:test";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { dualParse } from "./helpers/dual-parse";
import { loadLezerFixtures } from "./helpers/fixture-loader";
import { compareTreesLoose } from "./helpers/normalize-tree";
import { meanMetric, printWorstFixtures, type FixtureScore } from "./helpers/report";
import { THRESHOLDS } from "./thresholds";

const baselinePath = path.join(import.meta.dir, "baselines/comparison-summary.json");
const updateBaselines = process.env.UPDATE_BASELINES === "1";
const reportOnly = process.argv.includes("--report");

describe("tier2 loose tree comparison", () => {
	let fixtures: Awaited<ReturnType<typeof loadLezerFixtures>>;
	let results: FixtureScore[] = [];

	beforeAll(async () => {
		fixtures = await loadLezerFixtures();
	});

	test("compare trees against lezer baseline", async () => {
		results = [];

		for (const { file, name, input } of fixtures) {
			if (!input.trim()) continue;
			const { lezerTree, bridgeTree } = await dualParse(input);
			const scores = compareTreesLoose(lezerTree, bridgeTree, input.length);
			results.push({ id: `${file}#${name}`, scores });
		}

		const meanJaccard = meanMetric(results, "kindJaccard");
		const meanOverlap = meanMetric(results, "spanOverlap");

		if (reportOnly) {
			printWorstFixtures(results);
			return;
		}

		let baseline: Record<string, { kindJaccard: number; spanOverlap: number }> = {};
		try {
			baseline = JSON.parse(await readFile(baselinePath, "utf8"));
		} catch {
			// no baseline yet
		}

		if (updateBaselines || Object.keys(baseline).length === 0) {
			const next: Record<string, { kindJaccard: number; spanOverlap: number }> = {};
			for (const r of results) {
				next[r.id] = {
					kindJaccard: r.scores.kindJaccard,
					spanOverlap: r.scores.spanOverlap,
				};
			}
			await writeFile(baselinePath, JSON.stringify(next, null, 2));
		} else {
			const regressions: string[] = [];
			for (const r of results) {
				const prev = baseline[r.id];
				if (!prev) continue;
				if (
					r.scores.kindJaccard <
					prev.kindJaccard - THRESHOLDS.tier2.regressionEpsilon
				) {
					regressions.push(
						`${r.id}: jaccard ${prev.kindJaccard.toFixed(3)} -> ${r.scores.kindJaccard.toFixed(3)}`,
					);
				}
			}
			if (regressions.length > 0) {
				console.error(regressions.slice(0, 10).join("\n"));
			}
			expect(regressions.length).toBe(0);
		}

		expect(meanJaccard).toBeGreaterThanOrEqual(THRESHOLDS.tier2.meanKindJaccard);
		expect(meanOverlap).toBeGreaterThanOrEqual(THRESHOLDS.tier2.meanSpanOverlap);
	});
});
