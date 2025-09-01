# Project Pre-Development Audit — Quick Checklist (Expanded)
_Date: 2025-09-01_

This checklist reflects the **current state** with fork-readiness criteria added.

---

## TL;DR
- Vision and roadmap are set (see *My Story* + *Project_Phases*).  
- Governance and scope locked in (*Charter*).  
- Product ingestion spec generalized (multi-category: audio, furniture, IoT).  
- Stretch features prioritized (Validation Harness + Material Library in; others deferred).  
- Remaining work: enforce success metrics in CI, link schemas/UX docs in repo, and validate fork readiness.

---

## ✅ Already in Place
- **Vision & Roadmap**: Phases 1 → 4 defined, with stretch features prioritized.  
- **Charter v3.1**: Mission, scope, roles, governance, and DoD (fork-friendly).  
- **Product ingestion**: multi-category fields, validation, provenance, and starter CSV/JSON templates.  
- **Schemas**: calibration, analytics, finance, manufacturer reports, preset rooms.  
- **UX one-pagers**: reflections overlay, calibration helpers, persona onboarding, AI coach outline.  

---

## ⚠️ To Finalize (Pre-Code)
1) **Standards & Workflows**
   - Coding standards: naming, lint, formatting.  
   - Branch/PR: naming, reviewers, CI checks, acceptance criteria.  
   - Decision log: template + storage location.  
   - Privacy & security: confirm logging + retention policies.

2) **Success Metrics**
   - Add measurable exit criteria per phase (see North Star KPIs in *Project_Phases*).  
   - Link metrics to CI/QA harness.  

3) **Fork Readiness**
   - Product DB proven to support multiple categories.  
   - Overlay API documented and plug-in capable.  
   - Commerce layer configurable per fork (affiliate, SaaS, direct).  
   - Export pipeline validated for non-audio outputs.  
   - Analytics capture schema agnostic (tracks across verticals).  
   - **UX Fork Checklist** enforced: overlays toggleable, at least one report/quote export, badges for new product types.  

4) **Continuity Automation**
   - On PR merge, bot/CI appends key Decisions + Next Actions to `continuity_journal.md`.  
   - Maintains a rolling log of context without manual gaps.  

---

## Minimal Acceptance Criteria (Phase 2)
- First Reflections overlay renders and round-trips settings (export JSON).  
- Product DB expansion loads from starter CSV/JSON with validation.  
- Calibration helpers export/import without data loss.  
- Preset rooms load reliably; no viewer crashes on invalid presets.  
- UI: toggles/buttons discoverable; no fullscreen trap; panes restore.  
- Validation Harness integrated for regression testing.  
- **Fork readiness scaffolding validated in CI.**  
- **UX Fork Checklist validated.**  

---

## Next Action List
- [ ] Publish coding standards & PR workflow docs.  
- [ ] Finalize privacy/security logging rules.  
- [ ] Define measurable success metrics per phase.  
- [ ] Integrate schemas into CI validation.  
- [ ] Wire UX flows into UI mockups.  
- [ ] Validate fork readiness pipeline (DB, overlays, commerce, exports).  
- [ ] Add CI hook for continuity automation.  

---

## File Handoff Notes
- Store this checklist in **/Project Docs/**.  
- Create sibling folders: **schemas/**, **ux-flows/**, **datasets/**, **standards/**.  
- Link each work item to a PR/issue for traceability.  

— AudioForge Advisors
