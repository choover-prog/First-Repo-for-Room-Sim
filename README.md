# Media-Room-Cal-Sim (Starter)

Open `public/index.html` to test viewer.

## Phase 3 Features

- In-app chat support with persona-aware responses.
- Calibration assistant for REW sweeps and simple EQ export.
- Marketing content generator (`tools/gen_content.mjs`).
- Commerce checkout routing with ledger logging.
- Ledger export button for finance snapshots.

### Content Generator

Run `node tools/gen_content.mjs data/speakers/JBL_Studio_590.json` to create a draft blog in `content/drafts`.

### Architecture

Future AI backends can replace `src/lib/ai_bridge.js` and `src/lib/distributor.js` with real APIs.
