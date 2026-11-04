---
name: cleanup
description: Find and remove what this Next.js portfolio no longer uses (unreferenced components and modules, unused exports and dependencies, unused images, models, videos and audio in public/, and dead CSS rules), then check the app still builds and runs smoothly. Use when asked to clean up, remove unused files, images or styles, slim the bundle, or make the app lighter and smoother.
---

# Cleanup

Remove dead weight without breaking anything. Find, review, delete, verify, in that order.
Never delete on a tool's word alone: confirm each candidate has no reference first.

## 1. Snapshot

- `git status --short`: note what is already uncommitted, so you only remove what you meant to.
- Untracked files can't be recovered from git once deleted. List them separately and take extra care with them.

## 2. Unused code

1. Run `npx knip --no-progress` (no install needed). It reports unused files, exports and dependencies.
2. Treat these as live even when knip flags them, since Next.js loads them by convention:
   `src/app/**/{page,layout,loading,error,not-found,template,route,default}.tsx`,
   `opengraph-image`, `icon`, `sitemap`, `robots`, `middleware`/`proxy`, `instrumentation`.
3. For each flagged file, `grep -rn "<FileName>" src` (component names and import paths) to confirm.
   Then check for dynamic imports (`import("./X")`, `dynamic(() => import(...))`).
4. A component imported only by other unused files is unused too. Remove the whole chain.
5. Unused dependencies: remove them from `package.json` only after the grep shows no import. Then run `npm install`.

## 3. Unused assets in `public/`

1. Run `node .claude/skills/cleanup/scripts/unused-assets.mjs`. It lists files no source references, with sizes.
2. Before deleting each candidate, check:
   - Paths built in code. Search for its folder (e.g. `/images/hero/head/`) and template strings.
   - Model sidecars. A `.gltf` loads its own `.bin` and textures by relative path, so keep a model's folder whole if the `.gltf` is used.
   - Files named in docs or metadata (`manifest`, OG images).
3. Delete confirmed files with `rm`. Remove folders left empty.

## 4. Dead CSS

1. In `src/app/globals.css`, list every class selector, e.g. `grep -o "^\.[a-zA-Z0-9_-]*" src/app/globals.css | sort -u`.
2. For each one, `grep -rn "<class>" src --include=*.tsx`. Account for classes built at runtime (`edition-nav__${part}`), and for `data-*` attribute selectors.
3. Remove rules with no user. Keep `@theme`, `:root` tokens and `@keyframes` that are still referenced.

## 5. Smoothness pass

Look for these while you're in the code. Fix any you find.
- WebGL canvases (`<Canvas>`) that render every frame while off screen or idle. They should use `frameloop="demand"` or `"never"` when hidden.
- `filter: blur()` or `backdrop-filter` on layers that move every frame.
- Scroll handlers that set React state on every scroll event. Use refs, `data-*` attributes or motion values instead.
- Images larger than they display. Prefer `next/image` or right-sized `.webp`/`.avif`.
- `will-change` left on many static elements.

## 6. Verify

1. `npm run typecheck` and `npm run lint`. Both must pass.
2. `npm run build`. Must succeed.
3. Load the home page and the routes you touched. Scroll the whole page and check that no image 404s:
   `curl -s -o /dev/null -w "%{http_code}"` on a few asset URLs, or check the browser console.
4. Report what was removed: file counts, MB saved, dependencies dropped, plus anything you kept on purpose and why.
