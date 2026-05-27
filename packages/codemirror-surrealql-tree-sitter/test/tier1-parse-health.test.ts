import { describe, expect, test, beforeAll } from "bun:test";
import { dualParse } from "./helpers/dual-parse";
import { loadLezerFixtures } from "./helpers/fixture-loader";

describe("tier1 parse health", () => {
	let fixtures: Awaited<ReturnType<typeof loadLezerFixtures>>;

	beforeAll(async () => {
		fixtures = await loadLezerFixtures();
	});

	test("all lezer fixture inputs parse with both parsers", async () => {
		const failures: string[] = [];

		for (const { file, name, input } of fixtures) {
			if (!input.trim()) continue;
			const { lezerError, bridgeError, bridgeHasTsError, lezerTree, bridgeTree } =
				await dualParse(input);

			if (lezerError) failures.push(`${file}#${name}: lezer threw: ${lezerError}`);
			if (bridgeError) failures.push(`${file}#${name}: bridge threw: ${bridgeError}`);
			// ERROR nodes indicate grammar gaps vs lezer, not adapter failures (tracked in tier2)
			if (lezerTree.length !== input.length) {
				failures.push(`${file}#${name}: lezer tree length mismatch`);
			}
			if (bridgeTree.length !== input.length) {
				failures.push(`${file}#${name}: bridge tree length mismatch`);
			}
		}

		if (failures.length > 0) console.error(failures.slice(0, 10).join("\n"));
		expect(failures.length).toBe(0);
	});
});
