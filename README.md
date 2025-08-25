# Media-Room-Cal-Sim (Starter)

Open `public/index.html` to test viewer.

## How to run

```bash
npm i && npm run dev
```

## LF Heatmap

Toggle the **LF Heatmap** checkbox and adjust the L/W/H inputs to view the low-frequency heatmap.

## Spinorama import

```bash
node tools/import_spinorama.mjs data/speakers/JBL_Studio_590.json /path/to/spin.csv
```

Expected CSV headers: `Frequency (Hz)`, `OnAxis (dB)`, `ListeningWindow (dB)`, `EarlyReflections (dB)`, `SoundPower (dB)`, `SoundPowerDI (dB)`.

## Report export

Use the **Export PNG** and **Export JSON** buttons in the UI to generate reports.

## Accuracy tiers & confidence badges

Speaker files include a data quality tier (A–F) and confidence level. The equipment panel displays tier and confidence badges for the selected speaker.
