# Word Alchemy: release folder (20 November 2026)

- `site/` is the whole game, ready to host. Replace everything in your GitHub repository with the CONTENTS of
  `site/` (index.html at the top level, next to the `assets` folder). GitHub Pages picks it up in a minute or two.
- This web build loads every picture as its own file, so there is no limit on how many pictures it can hold.
  (The artifact version bundles small pictures into a few pack files to stay under its file limit; the web build does not need that.)
- `source/` holds the source files and the build script. build.py writes two pages: index_web.html (this one,
  for hosting) and index.html (the artifact version with packs).
- Saves: on a normal web host the game saves in the browser only (localStorage).
