# Media-Room-Cal-Sim (Starter)

Open `public/index.html` to test viewer.

## UI Scaffold & Zones

The app now builds a four-region layout with navigation, viewer, controls dock, and shop panels.
Sidebars and the bottom dock can collapse and persist their state to localStorage. When a panel is collapsed, edge handles appear so it can be re-opened without hotkeys. A fullscreen toggle hides all side panels and expands the viewer.

## Room Object Manager

Add speakers, subs, and a main listening position from the control dock. Edit roles, models, and XYZ coordinates with nudge controls. Objects are rendered as simple gizmos in the 3D viewer. Save or load setups via `room.json` files or built-in templates. All room state persists to `localStorage`.
