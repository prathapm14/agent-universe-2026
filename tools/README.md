# Rebuilding the Agent Universe images, decks and docs

Everything is generated from the event data on the website.

1. **Export the data** (from the website repo, with the production secrets; never commit the export) into `.cache/data.json`:
   sessions in schedule order with the speaker's name, headline, job title, company, bio and photo id. Also refresh `sessions.json` (names, titles, times) for the images.
2. **Download the speaker photos** from the website (`/api/avatar/<user-id>`) into `../photos/NN.jpg` (schedule order) and `.cache/photos/<speaker-name>.png`.
   Put the ITC logo, the lineup poster and the ITC Cat images in `.cache/assets/` (`itc-logo.png`, `poster.png`, `cat-wave.png`, `cat-smile.png`).
3. **Add or update the speaker intro** in `speakers.js` (one entry per session; `host` is who introduces it). Only use facts from the speaker's own profile.
4. Build:
   ```bash
   npm install
   node build.mjs     # ../posters, ../templates (the banner backgrounds the website uses) and banner previews in .cache/preview
   node assets.js     # deck backgrounds, round photo frames, icons
   node host.js       # ../slides/agent-universe-2026-host-deck.pptx
   node template.js   # ../slides/agent-universe-2026-speaker-template.pptx
   python3 docs.py    # README, schedule.csv, .ics, run-of-show.md
   ```
5. **Download the speaker banners** from the website, which draws each speaker's card on the templates:
   `https://innovationtechcommunity.com/banner/<session-id>.png?size=portrait|story|landscape` into `../banners/<size>/NN-<name>.png`.

`build.mjs` uses Playwright from the website repo (`~/innovationtechcommunity`) and the installed Google Chrome.
If you change a template, copy it to the website's `public/events/agent-universe-2026-banner-<size>.jpg`; the card boxes in `build.mjs` (`CARD`) and `src/lib/banner.tsx` (`CARD_BOX`) must stay the same.

`.cache/`, `node_modules/` and `../photos/` are git-ignored.
