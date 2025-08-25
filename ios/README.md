# RoomCaptureKit (iOS scaffold)

Experimental iOS 16+ scaffolding for room scanning and tagging.
The package exposes a small Swift library and demo app to capture a room
with ARKit/RoomPlan, review detected objects, and export a `scan.glb`
mesh plus a `room.json` file compatible with the web viewer in this repo.

## Targets & features

- **Capture** – `CaptureManager` starts an `ARSession` with mesh
  reconstruction. When RoomPlan is available, plane primitives can be
  incorporated later. Mesh anchors are accumulated for export.
- **Detection** – `DetectionManager` wraps a Core ML detector for objects
  such as sofa, TV, speakers, subs, AVR and acoustic panels. A small model
  is stubbed out; without it the UI allows manual tagging.
- **Back‑projection** – `BackProjector` lifts 2D detections into 3D using
  depth/mesh data to produce oriented bounding boxes.
- **Mesher** – `Mesher` merges `ARMeshAnchor`s and prepares a decimated
  triangle mesh for GLB export.
- **Exporter** – `Exporter` writes `scan.glb` (placeholder) and
  `room.json` in meters with Y‑up axis so it can be visualised on the web.
- **UI** – `ScanView` provides start/stop/reset controls, `ReviewView`
  lists detections for manual editing, and `ShareSheet` wraps
  `UIActivityViewController` for export.

## Build & run

1. Open `Package.swift` in Xcode 15 or later.
2. Add the `RoomCaptureKit` package to an iOS 16+ app target or run the
   sample app in `App/RoomCaptureApp.swift` on a device.
3. Devices with LiDAR (iPhone Pro/iPad Pro) unlock RoomPlan primitives;
   other devices fall back to ARKit mesh only.

## Export testing

1. In the review screen choose **Export** (to be hooked up) which uses
   `Exporter` to create `scan.glb` and `room.json` in the app’s temporary
   directory.
2. Use the share sheet to AirDrop or email the files.
3. Load both into the web viewer (`npm run dev` from repo root) to verify
   geometry and tagged objects.

## Notes

Many components are stubs with `TODO:` markers – they outline where
RoomPlan integration, Core ML models, mesh decimation, and full GLB
writing should be implemented in later phases.
