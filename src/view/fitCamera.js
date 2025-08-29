import * as THREE from 'three';

export function fitCameraToObject(camera, object, controls, opts = {}) {
  const {
    margin = 1.4,
    elevate = 0.25,
    minDistFactor = 0.75,
    maxDistFactor = 4.0
  } = opts;

  const box = new THREE.Box3().setFromObject(object);
  if (!isFinite(box.min.x) || !isFinite(box.max.x)) return null;

  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);

  const fov = (camera.fov ?? 50) * Math.PI / 180;
  let dist = (maxDim / 2) / Math.tan(fov / 2);
  dist *= margin;

  const target = center.clone();
  const camPos = new THREE.Vector3(center.x, center.y + maxDim * elevate, center.z + dist);

  camera.position.copy(camPos);
  camera.near = Math.max(0.01, (dist * minDistFactor) / 50);
  camera.far = Math.max(camera.far, dist * maxDistFactor + maxDim * 2);
  camera.updateProjectionMatrix();

  if (controls) {
    controls.target.copy(target);
    if ('minDistance' in controls) controls.minDistance = Math.max(0.25, dist * 0.2);
    if ('maxDistance' in controls) controls.maxDistance = dist * 6.0;
    if ('enableDamping' in controls) controls.enableDamping = true;
    if ('dampingFactor' in controls) controls.dampingFactor = 0.08;
    controls.update();
  }

  return { center, size, maxDim, dist, camPos, target };
}

export function fitOrthoToObject() {
  // TODO when ortho is introduced
}

