#!/usr/bin/env ts-node
import { execSync } from "node:child_process";
import fs, { cpSync } from "fs";
import path from "path";

// Path to base template folder
const baseDir = path.join(__dirname, "..", "templates", "base");
const distDir = path.join(__dirname, "..", "dist", "base");

/**
 * Run a shell command and return its stdout as string.
 */
function run(cmd: string, live = false): string | void {
  if (live) {
    execSync(cmd, { stdio: "inherit" });
    return;
  }

  return execSync(cmd, { encoding: "utf-8" }).trim();
}

/**
 * Ensure pnpm is installed before continuing.
 */
function checkPnpm() {
  try {
    const version = run("pnpm -v");
    console.log(`✅ pnpm detected (version ${version})`);
  } catch {
    console.error("❌ pnpm is not installed. Please install pnpm first.");
    process.exit(1);
  }
}

/**
 * Get the installed Next.js version in baseDir (if exists).
 */
function getInstalledNextVersion(): string | null {
  const pkgPath = path.join(baseDir, "package.json");
  if (!fs.existsSync(pkgPath)) return null;

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  return pkg.dependencies?.next || pkg.devDependencies?.next || null;
}

/**
 * Delete everything inside a directory, including hidden files.
 */
function cleanDir(dir: string) {
  if (!fs.existsSync(dir)) return;
  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file);
    fs.rmSync(filePath, { recursive: true, force: true });
  }
}

/**
 * Main script logic
 */
async function setupBase() {
  checkPnpm();

  const latestVersion = run("pnpm view next version") as string;
  const installedVersion = getInstalledNextVersion();

  if (installedVersion && installedVersion.includes(latestVersion)) {
    console.log(
      `✅ Next.js ${latestVersion} is already installed in base template.`,
    );
    return;
  }

  // Ensure baseDir exists and clean it
  fs.mkdirSync(baseDir, { recursive: true });
  cleanDir(baseDir);

  console.log(`⚡ Installing Next.js ${latestVersion} into templates/base...`);
  run(
    `pnpm dlx create-next-app@latest ${baseDir} --use-pnpm --ts --eslint --tailwind --no-src-dir --app --turbopack --import-alias "@/*"`,
    true,
  );

  console.log("🎉 Base template updated successfully!");

  // Copy to FullDir
  fs.mkdirSync(distDir, { recursive: true });
  cleanDir(distDir);
  cpSync(baseDir, distDir, { recursive: true, force: true });
  console.log(`✅ Copied Base to Dist Dir`);
}

setupBase().catch((err) => {
  console.error("❌ Error setting up base template:", err);
  process.exit(1);
});
