import { parser } from "../dist/index.js";
import { fileTests } from "@lezer/generator/dist/test";

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const subdirs = ["statements", "values", "misc"];

const args = process.argv.slice(2);
const llmMode = args.includes("--llm");
const filter = args.find((a) => a !== "--llm");

const green = (s) => (llmMode ? s : `\x1b[32m${s}\x1b[0m`);
const red = (s) => (llmMode ? s : `\x1b[31m${s}\x1b[0m`);
const bold = (s) => (llmMode ? s : `\x1b[1m${s}\x1b[0m`);
const dim = (s) => (llmMode ? s : `\x1b[2m${s}\x1b[0m`);

let totalPass = 0;
let totalFail = 0;
const failures = [];

for (const subdir of subdirs) {
	const dirPath = path.join(testDir, subdir);
	if (!fs.existsSync(dirPath)) continue;

	if (!llmMode) console.log(`\n${bold(`=== ${subdir.toUpperCase()} ===`)}`);

	for (const file of fs.readdirSync(dirPath).sort()) {
		if (!/\.txt$/.test(file)) continue;

		const filePath = path.join(dirPath, file);
		const label = `${subdir}/${file}`;
		const tests = fileTests(fs.readFileSync(filePath, "utf8"), file);

		let filePass = 0;
		let fileFail = 0;
		const fileFailures = [];

		if (!llmMode) console.log(`\n  ${bold(label)}`);

		for (const { name, run } of tests) {
			if (filter && name.indexOf(filter) === -1) continue;
			try {
				run(parser);
				filePass++;
				totalPass++;
				if (!llmMode) console.log(`    ${green("✔")} ${name}`);
			} catch (e) {
				fileFail++;
				totalFail++;
				const msg = String(e.message || e);
				fileFailures.push({ name, msg });
				if (!llmMode) {
					console.log(`    ${red("✘")} ${name}\n      ${red(msg.replace(/\n/g, "\n      "))}`);
				}
			}
		}

		if (llmMode && fileFail > 0) {
			console.log(`FAIL ${label} (${filePass} passed, ${fileFail} failed)`);
			for (const f of fileFailures) {
				console.log(`  FAIL: ${f.name}`);
				console.log(`    ${f.msg.replace(/\n/g, "\n    ")}`);
			}
		}

		if (fileFail > 0) {
			failures.push({ label, fileFailures });
		}

		if (!llmMode) {
			console.log(dim(`    ${filePass + fileFail} tests: ${filePass} passed${fileFail > 0 ? `, ${fileFail} failed` : ""}`));
		}
	}
}

console.log("");
if (llmMode) {
	console.log("--- SUMMARY ---");
	console.log(`Total: ${totalPass + totalFail} | Passed: ${totalPass} | Failed: ${totalFail}`);
	if (failures.length > 0) {
		console.log("\nFailed tests:");
		for (const { label, fileFailures } of failures) {
			for (const f of fileFailures) {
				console.log(`  [${label}] ${f.name}`);
			}
		}
	}
} else {
	const summary = `${bold("Total")}: ${totalPass + totalFail} | ${green(`Passed: ${totalPass}`)} | ${totalFail > 0 ? red(`Failed: ${totalFail}`) : dim("Failed: 0")}`;
	console.log(summary);
}

if (totalFail > 0) process.exit(1);
