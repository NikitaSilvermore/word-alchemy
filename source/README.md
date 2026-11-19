# Word Alchemy: release folder (19 November 2026)

- `site/` is the whole game, ready to host. Put the CONTENTS of `site/` at the root of a GitHub repository
  (index.html at the top level, next to the `assets` folder) and turn on GitHub Pages for the main branch.
- `source/` holds the three source files the page is built from, plus the build script.
  index.html = head.html + engine.js + ui.js, with small images folded in by build.py.
  The build script expects the folder layout of the working chat (paths at the top of build.py); adjust them if you rebuild elsewhere.
- Saves: on a normal web host the game saves in the browser only (localStorage). The artifact version uses the artifact's own storage instead.
- Some folders under `site/assets` (rv, em, ic, og, and the status icons in fx) are already folded into index.html and are not loaded from disk. They are included anyway so nothing is missing if that changes.
