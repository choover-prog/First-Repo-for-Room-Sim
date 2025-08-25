# Media-Room-Cal-Sim (Starter)

Open `public/index.html` to test viewer.

## LF Heatmap
Toggle **LF Heatmap** to overlay a low-frequency axial mode visualization. Adjust room **L/W/H** inputs to match your space.

## Report Export
Use **Export PNG** for a screenshot and **Export JSON** for a snapshot of the current configuration.

## Spinorama Import
Save review CSV with headers: freq_hz,on_axis_db,listening_window_db,early_reflections_db,sound_power_db,di_listening_window_db,di_sound_power_db

Run:
`node tools/import_spinorama.mjs data/speakers/JBL_Studio_590.json /path/to/spin.csv`

## Data Quality
Equipment panel badges show data tier, confidence, and current persona.
