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

Controls emit `ui:action` custom events for easy wiring and panes remember their open/closed state and size. Panels can be mounted programmatically via the helper:

```js
import { mountInto, PANE_IDS } from './ui/panes.ts';
const node = document.createElement('div');
mountInto(PANE_IDS.right, node);
```

## Pane controls

Each pane header provides Collapse and Fullscreen toggles. Collapsing hides the pane body but leaves the header visible for quick restore. The top header also provides **Restore** to reopen the last collapsed pane and **Reset Layout** to clear saved sizes and return all panes to their defaults. Fullscreen panes dim the rest of the interface and include an inline Exit control or respond to the Escape key.

## Phase-2 Features

### Reflections
Enable first-order reflections overlay via the `Reflections` checkbox (`#tglReflections`).
Uses the image-source (mirror) method wired to speaker and MLP pins and is structured for
future upgrades like frequency bands, materials, directivity, and diffraction.

### Room Templates
Choose presets from `roomTemplateSel` to auto-fill room dimensions from JSON templates.

### Persona Onboarding
A restartable, step-based flow helps pick personas and tooltip preferences (`btnRestartOnboarding`).

### Mic Layout Export
Select mic layouts (`micLayoutSel`) and export their positions as JSON (`btnExportMics`).

### PDF Export
`btnExportPDF` captures the canvas and selections into a basic PDF report.

### Speaker/Listener Placement
`Add Speaker` drops an orange pin you can drag around the floor. `Add Listener` creates additional green pins. Select a listener and use `Mark MLP` to designate the main listening position.
Pins persist between sessions and export with the JSON report.

## Spinorama Import

Drag a CEA-2034 CSV onto the Spinorama Import panel, preview the first rows and confidence, then apply the import to the selected speaker. The importer uses a built-in CSV parser, so no external packages are required. Required headers: `freq_hz,on_axis_db,[listening_window_db,early_reflections_db,sound_power_db,di_listening_window_db,di_sound_power_db]`. Valid imports compute a confidence score and speakers with confidence ≥0.7 display a **Spinorama Verified** badge noting the data source.
