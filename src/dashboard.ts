#!/usr/bin/env ts-node
import { execSync } from "child_process";
import { info } from "console";
import fs, { cpSync } from "fs";
import path from "path";

// Path to base template folder
const baseDir = path.join(__dirname, "..", "dist", "base");
const distDir = path.join(__dirname, "..", "dist", "dashboard");
const dashboardDir = path.join(__dirname, "..", "templates", "dashboard");

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

function run(command: string) {
  console.log(`▶️ Execute: ${command}`);
  execSync(command, { stdio: "inherit" });
}

/**
 * Main script logic
 */
async function setupDashboard() {
  // Copy to Dashboard Dist Dir
  fs.mkdirSync(distDir, { recursive: true });
  cleanDir(distDir);
  cpSync(baseDir, distDir, { recursive: true, force: true });
  console.log(`✅ Copied Base Dir to Dashboard Dist Dir`);

  process.chdir(distDir);
  run(`
  pnpm dlx shadcn@latest add avatar &&
  pnpm dlx shadcn@latest add badge &&
  pnpm dlx shadcn@latest add chart &&
  pnpm dlx shadcn@latest add checkbox &&
  pnpm dlx shadcn@latest add separator &&
  pnpm dlx shadcn@latest add sheet &&
  pnpm dlx shadcn@latest add sidebar &&
  pnpm dlx shadcn@latest add skeleton &&
  pnpm dlx shadcn@latest add sonner &&
  pnpm dlx shadcn@latest add table &&
  pnpm dlx shadcn@latest add tabs &&
  pnpm dlx shadcn@latest add toggle-group &&
  pnpm dlx shadcn@latest add toggle &&
  pnpm dlx shadcn@latest add tooltip &&
  pnpm add @tanstack/react-table &&
  pnpm add @dnd-kit/core &&
  pnpm add @dnd-kit/modifiers &&
  pnpm add @dnd-kit/sortable &&
  pnpm add @dnd-kit/utilities
`);
  console.log(`✅ Installed Dashboard dependencies`);

  cpSync(dashboardDir, distDir, { recursive: true, force: true });
  console.log(`✅ Copied Dashboard Files to Dist Dir template.`);
}

setupDashboard().catch((err) => {
  console.error("❌ Error setting up dashboard template:", err);
  process.exit(1);
});
