import { Box3, PerspectiveCamera, Vector3 } from 'three';

// simple camera fit utility with minimal tween
export function fitCameraToBox(
  camera: PerspectiveCamera,
  controls: { target: Vector3 },
  box: Box3,
  opts: { padding?: number; minDistance?: number; maxDistance?: number } = {}
){
  const padding = opts.padding ?? 1.1;
  const minDist = opts.minDistance ?? 0.5;
  const maxDist = opts.maxDistance ?? Infinity;
  const size = new Vector3();
  box.getSize(size);
  const center = new Vector3();
  box.getCenter(center);

  // figure distance based on largest dimension
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * Math.PI / 180;
  let dist = (maxDim/2) / Math.tan(fov/2) * padding;
  dist = Math.max(minDist, Math.min(maxDist, dist));

  const dir = camera.position.clone().sub(controls.target).normalize();
  const newPos = center.clone().add(dir.multiplyScalar(dist));

  const start = camera.position.clone();
  const startTarget = controls.target.clone();
  const endTarget = center.clone();
  const duration = 300; // ms
  const startTime = performance.now();

  function update(){
    const t = Math.min(1, (performance.now()-startTime)/duration);
    camera.position.lerpVectors(start, newPos, t);
    controls.target.lerpVectors(startTarget, endTarget, t);
    camera.updateProjectionMatrix();
    if(t<1) requestAnimationFrame(update);
  }
  update();
}
