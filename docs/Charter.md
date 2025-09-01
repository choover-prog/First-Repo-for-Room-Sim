# Project Charter — v3.1
_Last updated: 2025-09-01_

## Mission
Deliver a modern Vite + Three.js spatial commerce platform with acoustic insights, calibration helpers, and an extensible commerce/analytics layer — starting with media rooms but extensible to contractors, builders, and real estate.

**Competitive Moat:** Our advantage is a modular core + forkable overlays. Each vertical inherits stability without rewrite, ensuring we scale horizontally without fragmentation.

## Scope (In)
- Phase 1: Viewer, Measure Mode, LF heatmap, Spinorama import, minimal product DB (audio focus).
- Phase 2: First Reflections overlay, Product DB expansion, Presets, Calibration helpers, UI polish.
- Phase 3: AI scaffolds (Calibration Coach, scanning apps), commerce, marketing automation, finance logging.
- Phase 3.5: Analytics capture, manufacturer reports, ML recommenders.
- Phase 4: Autonomy (job runners, affiliate routing), admin dashboard, security, advanced commerce.
- **Future Verticals**: Contractor/Renovation, Home Furnishings, Smart Home, Builders, Real Estate — reusing the same core engine.

## Scope (Out) — Anti-Drift
- CAD-level architectural design (beyond light object placement).
- Heavy structural engineering (load-bearing analysis, permitting).
- Non-consumer BIM integrations (reserved for Pro/Enterprise).

## Stakeholders & Roles
- **Product Owner**: Approves roadmap, scope changes, and feature priorities (including forks).
- **Tech Lead (Vite/Three.js)**: Owns architecture, code quality, perf budgets, and PR approvals on core client.
- **Acoustic Engineer / Overlay Lead**: Oversees simulation methods (mirror, LF, lighting, flow), QA criteria, and material models.
- **Data Lead**: Owns schemas (ingestion, analytics, finance, product), privacy policy, and data quality.
- **UX Lead**: Owns flows, accessibility, pane behavior, discoverability, and error states.
- **Ops & Monetization**: Owns affiliate routing, payouts, admin dashboards, SaaS billing, and KPI definitions.

## Governance
- All scope additions require **Product Owner** approval + impact note from **Tech Lead**.
- PRs require at least 1 code review from domain owner; major refactors require Tech Lead signoff.
- Every merged PR must update relevant docs (schemas/UX/CHANGELOG).
- Forks (e.g. Builder, Real Estate) require mini-charters referencing this parent charter.

## Definition of Done (DoD)
- Feature passes acceptance tests, has export/import parity, and is documented.
- No console errors; handles invalid input gracefully.
- Privacy logging conforms to policy; data schemas validated in CI.
- Fork readiness: DB schema modular, overlays plug-in capable, commerce layer configurable.

-- End --
