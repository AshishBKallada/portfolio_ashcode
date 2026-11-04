#!/usr/bin/env node
// Lists files under public/ that nothing in the source references.
// A file counts as used if its public path (e.g. /images/hero/cloud.png), its
// folder plus a numbered-frame pattern, or its bare file name appears in src/, the app config, or public/ manifests.
// Prints candidates only; it never deletes. Review before removing.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, extname, basename, dirname } from "node:path";

const root = process.cwd();
const walk = (dir, out = []) => {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const p = join(dir, name);
    statSync(p).isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
};

const sourceExts = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".css", ".json", ".md", ".mdx", ".html", ".webmanifest"]);
const sources = [
  ...walk(join(root, "src")),
  ...["next.config.ts", "next.config.js", "next.config.mjs"].map((f) => join(root, f)).filter((f) => {
    try { return statSync(f).isFile(); } catch { return false; }
  }),
  ...walk(join(root, "public")).filter((f) => [".json", ".webmanifest", ".gltf", ".html", ".css"].includes(extname(f))),
].filter((f) => sourceExts.has(extname(f)) || f.endsWith(".gltf"));
const haystack = sources.map((f) => readFileSync(f, "utf8")).join("\n");

const assets = walk(join(root, "public"));
const unused = [];
let bytes = 0;
for (const file of assets) {
  const rel = "/" + relative(join(root, "public"), file).split("\\").join("/");
  const name = basename(file);
  // Numbered frames (frame-001.webp) are usually built in code from a folder and an index.
  const framed = /\d{2,}\.\w+$/.test(name) && haystack.includes(dirname(rel));
  if (haystack.includes(rel) || haystack.includes(name) || framed) continue;
  const size = statSync(file).size;
  bytes += size;
  unused.push(`${(size / 1024).toFixed(0).padStart(7)} KB  public${rel}`);
}
console.log(unused.sort().join("\n") || "No unused assets found.");
console.log(`\n${unused.length} candidate(s), ${(bytes / 1024 / 1024).toFixed(1)} MB`);
