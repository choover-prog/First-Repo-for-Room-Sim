# Product Data & Specification Ingestion — v4.1
_Last updated: 2025-09-01_

## Purpose
Standardize ingestion and display of **product data** with validation and provenance.  
Originally audio-focused (speakers/amps), now generalized to support multiple industries (furnishings, fixtures, IoT, appliances, etc.).

---

## Core Product Fields (minimum)
- category (audio, furniture, lighting, HVAC, IoT, etc.)
- brand
- model
- series / collection
- form_factor / type
- dimensions (H x W x D, cm/in)
- weight (optional)
- materials (optional)
- power/energy (if applicable)
- SKU / product_id
- verified (bool)
- source (url)
- **status** (`draft | verified | deprecated`)
- **provenance_score** (0–100, numeric indicator of trust level)

## Audio Subschema (extension)
- alignment (sealed/ported)
- drivers (text)
- impedance_ohm
- sensitivity_db
- power_continuous_w
- f3_hz
- spinorama_id

## Amplifier Subschema (extension)
- channels
- amp_class
- power_8ohm_w
- power_4ohm_w
- room_correction
- io.inputs[]
- io.outputs[]

## Furniture Subschema (example extension)
- material (wood, fabric, metal)
- finish (matte, gloss, stain)
- seat_height (if applicable)
- weight_capacity

## IoT / Smart Device Subschema (example extension)
- protocol (Zigbee, WiFi, Z-Wave, etc.)
- range (sq ft / meters)
- power_draw_w
- integrations (Alexa, Google, Apple)

---

## Validation
- Required fields must be present.  
- Numeric values must fall within expected ranges (e.g., sensitivity 70–110 dB, power_draw positive).  
- `verified=true` only when from trusted source; attach `source` URL.  
- Subschema-specific fields validated only when category matches (e.g., audio, furniture).  
- **status** must be one of `draft`, `verified`, `deprecated`.  
- **provenance_score** must be between 0 and 100.

---

## UI Representation
- Badges: “Verified”, “Spinorama”, “Eco-Friendly”, “Pro Source”.  
- Status and provenance shown as badges (e.g., Deprecated = red, Provenance 85 = green).  
- Show warnings (yellow) for missing/estimated fields; never crash renderer.  
- Group subschema-specific attributes under collapsible sections.

---

## 📦 Starter Templates

### products_starter.csv
```csv
category,brand,model,series,type,dimensions,SKU,verified,source,status,provenance_score
audio_speaker,JBL,Studio 590,Studio,tower,"WxHxD: 12x49x16",spin_jbl590,true,https://www.jbl.com,verified,90
furniture,Ikea,Poäng,Living Chair,chair,"WxHxD: 26x39x32",ikea_poang,true,https://www.ikea.com,draft,75
iot_device,Philips,Hue Bulb,White Ambiance,bulb,"WxHxD: 2x4x2",hue_white,true,https://www.philips-hue.com,verified,95
```

---

## Acceptance Criteria
- CSV/JSON templates load successfully without schema errors.  
- Import validates required fields and flags missing/invalid entries.  
- Renderer assigns correct badges based on verification + provenance.  
- System never crashes on bad input — errors are caught and logged.  
- Schema is modular: supports new categories without breaking audio roots.  
- Status and provenance integrated into validation and UI.

-- End --
