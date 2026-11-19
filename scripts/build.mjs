import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
execFileSync(process.execPath, ["scripts/verify.mjs"], { stdio: "inherit" });
const from = path.resolve("site");
const to = path.resolve("dist");
fs.rmSync(to, { recursive: true, force: true });
fs.cpSync(from, to, { recursive: true, force: true, dereference: false, errorOnExist: false });
console.log("Build complete:", fs.readdirSync(to).join(", "));
