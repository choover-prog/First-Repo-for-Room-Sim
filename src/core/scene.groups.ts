import { Group, Object3D } from 'three';
import { LAYERS } from './scene.layers';

export function createRoomGroup(): Group {
  const g = new Group();
  g.name = 'RoomGroup';
  g.matrixAutoUpdate = false;
  return g;
}

export function createEntitiesGroup(): Group {
  const g = new Group();
  g.name = 'EntitiesGroup';
  return g;
}

export function moveEntityToSelectableLayer(obj: Object3D){
  obj.layers.set(LAYERS.SELECTABLE);
}
