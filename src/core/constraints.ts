import { Object3D, Vector3 } from 'three';

export interface Bounds { min: Vector3; max: Vector3; }
export interface ClampOpts {
  zMin?: number;
  zMax?: number;
  wallClearance?: number;
  showToast?: boolean;
}

export function clampEntityPosition(obj: Object3D, room: Bounds, opts: ClampOpts = {}) {
  const { zMin = 0.2, zMax = room.max.z - 0.2, wallClearance = 0.05, showToast = true } = opts;
  const pos = obj.position;
  let clamped = false;
  if (pos.z < zMin) { pos.z = zMin; clamped = true; }
  if (pos.z > zMax) { pos.z = zMax; clamped = true; }
  if (pos.x < room.min.x + wallClearance) { pos.x = room.min.x + wallClearance; clamped = true; }
  if (pos.x > room.max.x - wallClearance) { pos.x = room.max.x - wallClearance; clamped = true; }
  if (pos.y < room.min.y + wallClearance) { pos.y = room.min.y + wallClearance; clamped = true; }
  if (pos.y > room.max.y - wallClearance) { pos.y = room.max.y - wallClearance; clamped = true; }
  if (clamped && showToast) {
    console.warn('Position clamped');
  }
  return clamped;
}
