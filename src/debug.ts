import path from "path";
import { execSync } from "node:child_process";
import { existsSync, renameSync, appendFileSync } from "fs";

const projectName = "./";

// Generate Auth Secret
console.log("🔐 Generating Auth Secret...");
execSync(`pnpm dlx auth secret`, {
  stdio: "inherit",
  cwd: projectName,
});

const envLocalPath = path.join(projectName, ".env.local");
const envPath = path.join(projectName, ".env");

if (existsSync(envLocalPath)) {
  console.log("🔄 Renaming .env.local to .env...");
  renameSync(envLocalPath, envPath);
}

// Add DATABASE_URL to .env
const envFilePath = path.join(projectName, ".env");
const databaseUrl = 'DATABASE_URL="file:./dev.db"';

if (existsSync(envFilePath)) {
  console.log("🔄 Adding DATABASE_URL to .env...");
  appendFileSync(envFilePath, `\n${databaseUrl}`, "utf8");
}

// Prisma Generate
console.log("⚡ Running Prisma generate...");
execSync(`pnpm prisma generate`, {
  stdio: "inherit",
  cwd: projectName,
});

// Prisma DB Push
console.log("🚀 Running Prisma push...");
execSync(`pnpm prisma db push`, {
  stdio: "inherit",
  cwd: projectName,
});
