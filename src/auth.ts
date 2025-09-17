import { execSync } from "child_process";
import path from "path";
import fs, { cpSync, readFileSync, appendFileSync } from "fs";

function run(command: string) {
  console.log(`▶️ Execute: ${command}`);
  execSync(command, { stdio: "inherit" });
}

function main() {
  const intlDir = path.join(__dirname, "..", "templates", "auth");
  const distDir = path.join(__dirname, "..", "dist", "base");
  const gitignore = path.join(
    __dirname,
    "..",
    "dist",
    "base",
    ".gitignore",
  );
  const packageJson = path.join(
    __dirname,
    "..",
    "dist",
    "base",
    "package.json",
  );
  process.chdir(distDir);
  run("pnpm add prisma -D");
  run("pnpm add @prisma/client");
  run("pnpm add next-auth@beta");
  run("pnpm add bcryptjs");
  run("pnpm add @auth/prisma-adapter");
  run("pnpm dlx shadcn@latest add form");
  run("pnpm dlx shadcn@latest add card");
  run("pnpm dlx shadcn@latest add input");
  console.log(`✅ Installed next-auth dependencies`);

  cpSync(intlDir, distDir, { recursive: true, force: true });
  console.log(`✅ Copied Auth Files to Dist Dir template.`);

  const newLines = `

#prisma
prisma/dev.db
prisma/generated/
`;
  const content = readFileSync(gitignore, "utf8");
  if (!content.includes("#prisma")) {
    appendFileSync(gitignore, newLines);
    console.log("✅ Added Prisma to .gitignore");
  } else {
    console.log("ℹ️ Already exists #prisma en el .gitignore");
  }

  const pkg = JSON.parse(fs.readFileSync(packageJson, "utf-8"));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts.build =
    "pnpm prisma generate && pnpm prisma db push && next build";
  pkg.pnpm = pkg.pnpm || {};
  pkg.pnpm.onlyBuiltDependencies = [
    "@prisma/client",
    "@prisma/engines",
    "esbuild",
    "prisma",
    "sharp",
    "unrs-resolver",
  ];
  fs.writeFileSync(packageJson, JSON.stringify(pkg, null, 2) + "\n");
  console.log("✅ package.json updated successfully!");
}

main();
