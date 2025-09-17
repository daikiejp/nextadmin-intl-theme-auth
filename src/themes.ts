import { execSync } from "child_process";
import path from "path";
import { cpSync } from "fs";

function run(command: string) {
  console.log(`▶️ Execute: ${command}`);
  execSync(command, { stdio: "inherit" });
}

function main() {
  const intlDir = path.join(__dirname, "..", "templates", "themes");
  const distDir = path.join(__dirname, "..", "dist", "base");
  process.chdir(distDir);
  run("pnpm add next-themes");
  run("pnpm dlx shadcn@latest add dropdown-menu");
  run("pnpm dlx shadcn@latest add button");
  console.log(`✅ Installed next-themes dependencies`);

  cpSync(intlDir, distDir, { recursive: true, force: true });
  console.log(`✅ Copied Themes Files to Dist Dir template.`);
}

main();
