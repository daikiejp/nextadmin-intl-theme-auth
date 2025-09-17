import { execSync } from "child_process";
import path from "path";
import { cpSync } from "fs";

function run(command: string) {
  console.log(`▶️ Execute: ${command}`);
  execSync(command, { stdio: "inherit" });
}

function main() {
  const intlDir = path.join(__dirname, "..", "templates", "intl");
  const distDir = path.join(__dirname, "..", "dist", "base");
  process.chdir(distDir);
  run("pnpm add next-intl");
  run("pnpm dlx shadcn@latest init --base-color neutral");
  run("pnpm dlx shadcn@latest add select");
  console.log(`✅ Installed next-intl dependencies`);

  cpSync(intlDir, distDir, { recursive: true, force: true });
  console.log(`✅ Copied Intl Files to Dist Dir template.`);
}

main();
