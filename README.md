# Media-Room-Cal-Sim (Starter)

Open `public/index.html` to test viewer.

## 4-Pane Layout

The viewer now renders with a four-pane scaffold that surrounds the 3D scene without interfering with interaction.

- **Top – Global Menu** (`#paneTop`):
  - `btnFullscreenToggle`
  - `btnImportRoom`
- `btnExportPNG`
- `btnExportJSON`
- `btnExportPDF`
- `btnRestartOnboarding`
  - `btnGuide`
- **Left – Visual Overlays** (`#paneLeft`):
- `tglLFHeatmap`, `roomL`, `roomW`, `roomH`
- `tglReflections`
- `tglMicLayout`
- `tglSeatMarker`
- **Right – Equipment & Cart** (`#paneRight`):
  - `selSpeakerModel`
  - `selAmpModel`
  - `btnAddToCart`
  - `btnCart`
  - badge placeholders for persona, tier and spinorama
- **Bottom – Calibration & AI** (`#paneBottom`):
  - `btnChat`
  - `btnCalAssistant`
  - `btnImportREW`
  - `btnExportFilters`

Controls emit `ui:action` custom events for easy wiring and panes remember their open/closed state and size.

## Pane controls: Fullscreen & Restore

Each pane header provides Collapse and Fullscreen toggles. Fullscreen panes dim the rest of the interface and include an inline Exit control or respond to the Escape key. Collapsed panes can be revived using the persistent "Restore Pane" button in the lower-left corner.

## Phase-2 Features

### Reflections
Enable first-reflection markers via `tglReflections`. Uses a simple mirror method to visualize wall hits.

### Room Templates
Choose presets from `roomTemplateSel` to auto-fill room dimensions from JSON templates.

### Persona Onboarding
A restartable, step-based flow helps pick personas and tooltip preferences (`btnRestartOnboarding`).

### Mic Layout Export
Select mic layouts (`micLayoutSel`) and export their positions as JSON (`btnExportMics`).

### PDF Export
`btnExportPDF` captures the canvas and selections into a basic PDF report.
