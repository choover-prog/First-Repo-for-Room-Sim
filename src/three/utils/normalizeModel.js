import * as THREE from 'three';

// Heuristically normalize a model's scale and frame it in view.
// opts: { dropToY=0, recenterXZ=true, targetLongest=20 }
// ctx:  { camera, controls, grid, statsEl }
export function normalizeAndFrame(root, opts = {}, ctx = {}) {
  const { dropToY = 0, recenterXZ = true, targetLongest = 20 } = opts;
  const { camera, controls, grid, statsEl } = ctx;

  const mToFt = 3.28084;

  // Initial bounds
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const longest = Math.max(size.x, size.y, size.z);

  // Heuristic scale
  let scale = 1;
  if (targetLongest && isFinite(longest) && longest > 0) {
    scale = targetLongest / longest;
  } else if (longest > 100) {
    scale = 0.01; // cm -> m
  } else if (longest < 0.5) {
    scale = 100; // m -> cm
  }
  if (scale !== 1) root.scale.setScalar(scale);

  // Recompute after scaling
  const box2 = new THREE.Box3().setFromObject(root);
  const center = box2.getCenter(new THREE.Vector3());
  if (recenterXZ) {
    root.position.x -= center.x;
    root.position.z -= center.z;
  }
  root.position.y += dropToY - box2.min.y;

  // Final bounds
  const box3 = new THREE.Box3().setFromObject(root);
  const sz = box3.getSize(new THREE.Vector3());
  const sphere = box3.getBoundingSphere(new THREE.Sphere());
  const dist = sphere.radius / Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);

  // Position camera
  camera.position.set(
    sphere.center.x + dist,
    sphere.center.y + dist,
    sphere.center.z + dist
  );
  controls.target.copy(sphere.center);
  controls.update();

  // Update camera near/far
  camera.near = Math.max(0.01, Math.min(sz.x, sz.y, sz.z) / 200);
  camera.far = Math.max(1000, Math.max(sz.x, sz.y, sz.z) * 50);
  camera.updateProjectionMatrix();

  if (grid) grid.position.y = box3.min.y;
  if (statsEl) {
    statsEl.textContent =
      `Size: ${sz.x.toFixed(2)}×${sz.y.toFixed(2)}×${sz.z.toFixed(2)} m  |  ` +
      `${(sz.x * mToFt).toFixed(2)}×${(sz.y * mToFt).toFixed(2)}×${(sz.z * mToFt).toFixed(2)} ft`;
  }
}
