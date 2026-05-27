import type { ComparisonScore } from "./normalize-tree";

export interface FixtureScore {
	id: string;
	scores: ComparisonScore;
}

export function printWorstFixtures(results: FixtureScore[], limit = 20): void {
	const sorted = [...results].sort((a, b) => a.scores.kindJaccard - b.scores.kindJaccard);
	console.log("\n--- Worst fixtures by kindJaccard ---");
	for (const r of sorted.slice(0, limit)) {
		const s = r.scores;
		console.log(
			`${r.id}: jaccard=${s.kindJaccard.toFixed(3)} overlap=${s.spanOverlap.toFixed(3)} stmt=${s.statementKindMatch}`,
		);
	}
}

export function meanMetric(results: FixtureScore[], key: keyof ComparisonScore): number {
	if (results.length === 0) return 0;
	return results.reduce((sum, r) => sum + r.scores[key], 0) / results.length;
}
