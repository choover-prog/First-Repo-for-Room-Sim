# Media-Room-Cal-Sim (Starter)

Open `public/index.html` to test viewer.

## Spinorama Importer

```
node tools/import_spinorama.mjs data/speakers/JBL_Studio_590.json path/to/spin.csv
```

CSV headers required: `freq_hz,on_axis_db,listening_window_db,early_reflections_db,sound_power_db,di_listening_window_db,di_sound_power_db`.

## LF Heatmap

Toggle the low-frequency heatmap overlay and adjust room dimensions with the inputs `L`, `W`, and `H` (meters).

## Report Export

Use **Export PNG** to save a screenshot of the viewer and **Export JSON** to save the current app state.

## UI Badges

Persona, data tier, and confidence appear as pill badges in the Equipment panel.
