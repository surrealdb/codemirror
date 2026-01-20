#!/usr/bin/env bun

/**
 * Fixes workspace versions in bun.lock to match package.json versions.
 * This is a workaround for https://github.com/oven-sh/bun/issues/18906
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

interface PackageJson {
	name: string;
	version: string;
}

interface BunLock {
	lockfileVersion: number;
	configVersion: number;
	workspaces: Record<string, any>;
	packages: Record<string, any>;
}

function readPackageJson(packagePath: string): PackageJson | null {
	const packageJsonPath = join(packagePath, "package.json");
	if (!existsSync(packageJsonPath)) {
		return null;
	}
	const content = readFileSync(packageJsonPath, "utf-8");
	return JSON.parse(content);
}

function readBunLock(): BunLock {
	const lockPath = join(rootDir, "bun.lock");
	if (!existsSync(lockPath)) {
		throw new Error("bun.lock not found");
	}
	const content = readFileSync(lockPath, "utf-8");
	return JSON.parse(content);
}

function writeBunLock(lock: BunLock): void {
	const lockPath = join(rootDir, "bun.lock");
	// Use JSON.stringify with proper formatting to match bun.lock format
	// bun.lock uses tabs for indentation
	const content = `${JSON.stringify(lock, null, "\t")}\n`;
	writeFileSync(lockPath, content, "utf-8");
}

function main() {
	console.log("🔧 Fixing workspace versions in bun.lock...");

	const bunLock = readBunLock();
	const packagesDir = join(rootDir, "packages");

	// Get all workspace packages
	const workspaceEntries = Object.entries(bunLock.workspaces);
	let updated = 0;

	for (const [workspacePath, workspaceData] of workspaceEntries) {
		// Skip the root workspace (empty string)
		if (!workspacePath || workspacePath === "") {
			continue;
		}

		// Read the package.json for this workspace
		const packagePath = join(rootDir, workspacePath);
		const packageJson = readPackageJson(packagePath);

		if (!packageJson) {
			console.warn(`⚠️  Warning: Could not find package.json for workspace: ${workspacePath}`);
			continue;
		}

		// Check if version needs updating
		const currentVersion = workspaceData.version;
		const expectedVersion = packageJson.version;

		if (currentVersion !== expectedVersion) {
			console.log(
				`  📦 Updating ${packageJson.name} (${workspacePath}): ${currentVersion} → ${expectedVersion}`,
			);
			workspaceData.version = expectedVersion;
			updated++;
		}
	}

	if (updated > 0) {
		writeBunLock(bunLock);
		console.log(`✅ Updated ${updated} workspace version(s) in bun.lock`);
	} else {
		console.log("✅ All workspace versions are already up to date");
	}
}

main();
