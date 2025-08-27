# Media-Room-Cal-Sim (Starter)

Open `public/index.html` to test viewer.

## UI Scaffold & Zones

The app now uses a four-zone layout with collapsible panels and fullscreen support.
Left sidebar holds viewer load/settings, right shows equipment, and a bottom dock
contains speaker controls. Each region can be collapsed and its state is persisted
in `localStorage`. A fullscreen mode hides all side panels and expands the viewer.
Collapsed panels show edge handles to expand them again. Hotkeys: `[` and `]`
collapse left/right, `F` toggles fullscreen.
