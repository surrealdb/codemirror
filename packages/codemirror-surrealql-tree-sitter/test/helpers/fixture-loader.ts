import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fileTests } from "@lezer/generator/dist/test";

const testDir = path.dirname(fileURLToPath(import.meta.url));
export const lezerTestRoot = path.resolve(testDir, "../../../lezer-surrealql/test");
export const corpusDir = path.resolve(testDir, "../../../../../surrealql-tree-sitter/test/corpus");

export interface LezerFixtureCase {
	file: string;
	name: string;
	input: string;
	run: (parser: { parse: (input: string) => unknown }) => void;
}

export async function loadLezerFixtures(
	subdirs = ["statements", "values", "misc"],
): Promise<LezerFixtureCase[]> {
	const cases: LezerFixtureCase[] = [];

	for (const subdir of subdirs) {
		const dirPath = path.join(lezerTestRoot, subdir);
		const files = (await readdir(dirPath)).filter((f) => f.endsWith(".txt")).sort();

		for (const file of files) {
			const filePath = path.join(dirPath, file);
			const content = await readFile(filePath, "utf8");
			const tests = fileTests(content, file);

			for (const t of tests) {
				cases.push({
					file: `${subdir}/${file}`,
					name: t.name,
					input: t.text,
					run: t.run,
				});
			}
		}
	}

	return cases;
}

export interface CorpusCase {
	file: string;
	name: string;
	input: string;
	expected: string;
}

export function parseCorpusFile(content: string, fileName: string): CorpusCase[] {
	const cases: CorpusCase[] = [];
	const blocks = content.split(/^={3,}\s*$/m).filter(Boolean);

	for (const block of blocks) {
		const parts = block.split(/^---\s*$/m);
		if (parts.length < 2) continue;

		const header = parts[0].trim();
		const body = parts[1];
		const sections = body.split(/^---\s*$/m);
		if (sections.length < 2) continue;

		cases.push({
			file: fileName,
			name: header.split("\n")[0].trim() || fileName,
			input: sections[0].trim(),
			expected: sections[1].trim(),
		});
	}

	return cases;
}
