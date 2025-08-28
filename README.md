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
