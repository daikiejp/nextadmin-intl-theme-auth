import { execSync } from "child_process";
import path from "path";

function run(command: string) {
  console.log(`▶️ Execute: ${command}`);
  execSync(command, { stdio: "inherit" });
}

function main() {
  const distDir = path.join(__dirname, "..", "dist", "base");
  process.chdir(distDir);
  run("pnpm add -D eslint-plugin-react-hooks @next/eslint-plugin-next");
  console.log(`✅ Patches generated into: ${distDir}`);
}

main();
