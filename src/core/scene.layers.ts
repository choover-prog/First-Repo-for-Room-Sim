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
