# Media-Room-Cal-Sim (Starter)

Open `public/index.html` to test viewer.

## UI Scaffold & Zones

The application uses a 4-zone layout managed in `src/ui/Layout.js`:

- **Left (Navigation)** – project templates and imports.
- **Main (Viewer)** – Three.js scene or future graph views.
- **Dock (Controls)** – room and measurement tools.
- **Right (Equipment)** – gear selection and comparison.

Each panel can be collapsed and the state persists via `localStorage`. A
fullscreen toggle hides the side panels and dock. Hotkeys: `F` for
fullscreen, `[` and `]` collapse left and right panels respectively.
