/**
 * Direct copy: newest image from Downloads → `public/projects/latest.<ext>`
 * Runs automatically before `npm run dev` (predev).
 */
import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");
const projectsDir = path.join(publicDir, "projects");
const PREFIX = "latest";
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
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
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
  if (!fs.existsSync(projectsDir)) return;
  for (const name of fs.readdirSync(projectsDir)) {
    if (name.startsWith(`${PREFIX}.`)) {
      fs.unlinkSync(path.join(projectsDir, name));
    }
  }
}

function main() {
  const best = findLatestImage();
  removeStaleCopies();

  if (!best) {
    console.warn("[copy:project-image] No image in Downloads — skipped.");
    process.exit(0);
  }

  const ext = path.extname(best.path).toLowerCase() || ".png";
  const destName = `${PREFIX}${ext}`;
  fs.mkdirSync(projectsDir, { recursive: true });
  const destPath = path.join(projectsDir, destName);
  fs.copyFileSync(best.path, destPath);
  console.log("[copy:project-image]", best.path, "→", destPath);
}

main();
