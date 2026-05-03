/**
 * Copies the newest image from ~/Downloads (and on Windows ~/OneDrive/Downloads)
 * into `public/` as `footer-from-downloads.<ext>`, then writes
 * `app/generated/footer-downloads-path.ts` so the app only references `public/` URLs
 * (no API route).
 *
 * Run manually: `npm run sync:downloads-image` (e.g. before `npm run dev` / `npm run build`).
 *
 * If nothing is found, removes stale `footer-from-downloads.*` and points the
 * generated module at `/hero-latestx.png`.
 */
import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const publicDir = path.join(root, "public");
const genDir = path.join(root, "app", "generated");
const genFile = path.join(genDir, "footer-downloads-path.ts");
const FALLBACK = "/hero-latestx.png";
const PREFIX = "footer-from-downloads";
const IMAGE_EXT = /\.(png|jpe?g|webp|avif|gif)$/i;

function downloadsDirs() {
  const h = os.homedir();
  const dirs = [path.join(h, "Downloads")];
  if (process.platform === "win32") {
    dirs.push(path.join(h, "OneDrive", "Downloads"));
  }
  return dirs;
}

function findLatestImage() {
  let best = null;
  for (const dir of downloadsDirs()) {
    if (!fs.existsSync(dir)) continue;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      if (!ent.isFile()) continue;
      if (!IMAGE_EXT.test(ent.name)) continue;
      const full = path.join(dir, ent.name);
      try {
        const st = fs.statSync(full);
        if (!best || st.mtimeMs > best.mtime) {
          best = { path: full, mtime: st.mtimeMs };
        }
      } catch {
        /* skip */
      }
    }
  }
  return best;
}

function removeStaleCopies() {
  if (!fs.existsSync(publicDir)) return;
  for (const name of fs.readdirSync(publicDir)) {
    if (name.startsWith(`${PREFIX}.`)) {
      fs.unlinkSync(path.join(publicDir, name));
    }
  }
}

function writeGenerated(publicPath) {
  fs.mkdirSync(genDir, { recursive: true });
  const body = `/**
 * Public URL for the footer backdrop (copied from Downloads by the sync script).
 * Run: \`npm run sync:downloads-image\` (also runs before \`dev\` / \`build\`).
 * Do not edit by hand; this file is overwritten by the script.
 */
export const FOOTER_FROM_DOWNLOADS_PUBLIC_PATH = ${JSON.stringify(publicPath)} as const;
`;
  fs.writeFileSync(genFile, body, "utf8");
}

function main() {
  const best = findLatestImage();
  removeStaleCopies();

  if (!best) {
    console.warn("[sync-downloads-image] No image found in Downloads; using fallback:", FALLBACK);
    writeGenerated(FALLBACK);
    process.exit(0);
  }

  const ext = path.extname(best.path).toLowerCase() || ".png";
  const destName = `${PREFIX}${ext}`;
  const destPath = path.join(publicDir, destName);
  fs.copyFileSync(best.path, destPath);
  const publicPath = `/${destName}`;
  console.log("[sync-downloads-image] Copied:", best.path, "->", destPath);
  writeGenerated(publicPath);
}

main();
