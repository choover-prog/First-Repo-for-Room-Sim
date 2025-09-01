# Workflow Standards & Guard Rails
_Version 1.3 — Updated: 2025-08-30_

## 1) Development Workflow (Hybrid: local + cloud)
- Local dev is primary; Codespaces optional for clean PR previews.
- Visual Studio Copilot Chat/Edits used to generate tests and focused multi-file edits **before** PR.
- Devcontainer (optional) pins Node/PNPM/Playwright for reproducibility.

### Branching & Flags
- `main` releasable; short-lived feature branches.
- Risky changes behind `VITE_FLAG_*` (e.g., FLAG_THREE_R179, FLAG_DIRECT_CHECKOUT).

### Modular Feature Pattern
- Each feature under `src/features/<name>/` exporting:
  ```ts
  export interface Feature { id: string; enable(ctx: AppCtx): void; disable(): void; }
  ```
- `AppCtx` provides scene/camera/renderer, state (Zustand/mini store), bus, export registry.

### State & Events
- Central store slices: room, pins, overlays, persona, cart.
- Event topics: ROOM_CHANGED, PINS_CHANGED, OVERLAYS_CHANGED, TEMPLATE_SELECTED.

## 2) CI/CD (Required on every PR)
- Lint/format (ESLint/Prettier), Typecheck.
- Unit tests (Jest), E2E smoke (Playwright scene interactions).
- Accessibility checks (jest-axe + axe in Playwright).
- Data schema validation (Zod) for manifests/templates/equipment.
- Bundle budget alerts; preview deploy (Vercel/Netlify).

## 3) Definition of Done (per feature)
- Functional OK; Integration OK (pins/reflections/calibration/export unchanged).
- A11y: no critical violations; keyboard-nav; labels/aria present.
- Export JSON/PDF updated; export hook registered.
- Perf sanity: baseline scene <16ms avg; heavy recomputes debounced.
- Docs updated (`docs/<feature>.md` or README section).

## 4) Data & Content
- Zod schemas enforce equipment/templates/manifest validity (timestamps, spinoramaComplete, affiliate links).
- Provenance tags; price timestamps.

## 5) Accessibility
- Headless/Radix primitives for dialogs/menus; focus management.
- ≥4.5:1 contrast; no color-only signals; visible focus ring.
- Alt text for snapshots; aria-labels for canvas controls.

## 6) Security & Privacy
- Opt-in analytics only; anonymized; no PII in manufacturer rollups.
- Secrets via repo/org secrets; never committed.
- Affiliate disclosures in UI and PDFs.

## 7) Session & Prompt Hygiene (Drift Control)
- Start sessions with: `Load charter.md; Anchor: Phase …; Mode: …` and use templates in `codex_prompt_templates.md`.
- **Mandatory Continuity Step (each session end):**
  1) Generate the Continuity Summary (Decisions, Open items, Next actions w/ owner→due, Anchor for next session).
  2) Append it to `continuity_journal.md` in Google Drive folder `/AudioForge/docs/` (link: https://drive.google.com/drive/folders/1bwTmEJO18xxhwWZkde6ALuw_Jc-JvZYH?usp=drive_link).
  3) Confirm the append succeeded.
- No background writes; all Drive edits occur interactively during the session.

## 8) Quick Acceptance Checklists
- **Room Builder (Rect Wizard MVP):** emits ROOM_CHANGED; reflections/pins update; export has room dims; ft↔m tests; e2e toggles pass.
- **First Reflections:** overlay toggles; snapshot markers visible; export flag present.
- **Commerce Drawer (Affiliate):** price timestamps; quote PDF with links; a11y checks pass.
