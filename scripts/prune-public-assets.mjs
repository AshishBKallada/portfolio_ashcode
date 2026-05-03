/**
 * Deletes files in `public/` that are not referenced by the app.
 * Run: node scripts/prune-public-assets.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

/** Exact filenames (root of public/) kept — must match imports in app/. */
const KEEP_ROOT = new Set(
  [
    "project1.avif",
    "project2.avif",
    "project3.avif",
    "project4.avif",
    "hero-latestx.png",
    "flying-dove.png",
    "elegant-japanese-katana-swords-with-red-scabbards-floral-detailing-crossed.png",
    "300.gif",
    "doodlearrow.png",
    "arrowblack1.png",
    "contact-section.png",
    "hero-background.jpg",
    "skills-background.jpg",
    "cube-float.png",
    "vintage-camera-white-background.png",
    "hand-dials-old-red-rotary-phone-dusted-with-time.jpg",
    "freepik__talk__92491.png",
    "3d-rendering-triangle-water.jpg",
    "vintage-rotary-dial-phone-with-japanese-characters.jpg",
    "scroll-with-japanese-calligraphy-wooden-stand-with-two-rolledup-scrolls.jpg",
  ].map((s) => s.toLowerCase()),
);

function keepFooterSync(name) {
  return /^footer-from-downloads\./i.test(name);
}

const KEEP_AUDIO = new Set(["hero.mp3", ".gitkeep"].map((s) => s.toLowerCase()));

function main() {
  let removed = 0;
  for (const ent of fs.readdirSync(publicDir, { withFileTypes: true })) {
    const full = path.join(publicDir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "audio") {
        for (const a of fs.readdirSync(full, { withFileTypes: true })) {
          if (!a.isFile()) continue;
          const low = a.name.toLowerCase();
          if (KEEP_AUDIO.has(low)) continue;
          fs.unlinkSync(path.join(full, a.name));
          removed += 1;
        }
      }
      continue;
    }
    if (!ent.isFile()) continue;
    const low = ent.name.toLowerCase();
    if (KEEP_ROOT.has(low) || keepFooterSync(ent.name)) continue;
    fs.unlinkSync(full);
    removed += 1;
  }
  console.log(`[prune-public-assets] Removed ${removed} file(s).`);
}

main();
