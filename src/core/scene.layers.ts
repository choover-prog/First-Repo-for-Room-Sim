import * as THREE from 'three';

export const LAYERS = {
  DEFAULT: 0,
  SELECTABLE: 1,
  APP: 2,
} as const;

// Recursively set layer for object and descendants
export function setLayerDeep(obj: THREE.Object3D, layer: number) {
  obj.traverse((o) => o.layers.set(layer));
}

// Enable both DEFAULT and APP layers on the camera for safe rendering
export function enableCameraSafeLayers(camera: THREE.Camera) {
  // @ts-ignore - mask is internal
  camera.layers.mask = 0; // reset existing mask
  camera.layers.enable(LAYERS.APP);
  camera.layers.enable(LAYERS.DEFAULT);
}
