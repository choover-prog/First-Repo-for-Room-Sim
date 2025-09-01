import * as THREE from 'three';
import { LAYERS, setLayerDeep } from './scene.layers';

export type RoomArtifacts = {
  appRoot: THREE.Group;
  roomGroup: THREE.Group | null;
  scanGroup: THREE.Group | null;
  entitiesGroup: THREE.Group | null;
  debugGroup: THREE.Group;
};

export const artifacts: RoomArtifacts = {
  appRoot: new THREE.Group(),
  roomGroup: null,
  scanGroup: null,
  entitiesGroup: null,
  debugGroup: new THREE.Group(),
};

export function ensureAppRoot(scene: THREE.Scene) {
  if (!artifacts.appRoot.parent) {
    artifacts.appRoot.name = 'AppRoot';
    scene.add(artifacts.appRoot);
  }
  if (!artifacts.debugGroup.parent) {
    artifacts.debugGroup.name = 'DebugHelpers';
    artifacts.appRoot.add(artifacts.debugGroup);
  }
  setLayerDeep(artifacts.appRoot, LAYERS.APP);
}

export function deepDispose(root: THREE.Object3D) {
  root.traverse((n: any) => {
    n.geometry?.dispose?.();
    n.material?.dispose?.();
  });
}

export function purgeLegacyStrays(scene: THREE.Scene) {
  const killName = /^(FitBox|bboxHelper|MediumRoom|Sample(Room)?|Placeholder|Debug(Room)?|Sim\s?Cube|Cube|Box)$/i;
  const toRemove: THREE.Object3D[] = [];
  scene.traverse((o: any) => {
    if (artifacts.appRoot.contains(o)) return;
    const isMesh = o.isMesh === true;
    const isBox = isMesh && (o.geometry?.type === 'BoxGeometry' || o.geometry?.type === 'BoxBufferGeometry');
    const strayName = killName.test(o.name || '');
    const notTagged = o.userData?.af_tag !== 'APP';
    if ((isBox || strayName) && notTagged) {
      toRemove.push(o);
    }
  });
  toRemove.forEach((o) => {
    o.parent?.remove(o);
    deepDispose(o);
  });
  if (toRemove.length) {
    console.warn(`[room.session] Purged ${toRemove.length} stray object(s):`, toRemove.map((o) => o.name || o.type));
  }
}

export function resetAppRoot(scene: THREE.Scene) {
  const keep = artifacts.appRoot;
  const kids = [...keep.children];
  kids.forEach((c) => {
    keep.remove(c);
    deepDispose(c);
  });
  artifacts.debugGroup = new THREE.Group();
  artifacts.debugGroup.name = 'DebugHelpers';
  artifacts.appRoot.add(artifacts.debugGroup);
  artifacts.roomGroup = null;
  artifacts.scanGroup = null;
  artifacts.entitiesGroup = null;
}

export function attachRoom(scene: THREE.Scene, roomGroup: THREE.Group) {
  ensureAppRoot(scene);
  resetAppRoot(scene);
  artifacts.roomGroup = roomGroup;
  roomGroup.name = 'RoomGroup';
  roomGroup.userData.af_tag = 'APP';
  artifacts.appRoot.add(roomGroup);
  setLayerDeep(roomGroup, LAYERS.APP);
  purgeLegacyStrays(scene);
}

export function attachScan(scene: THREE.Scene, scanRoot: THREE.Object3D) {
  ensureAppRoot(scene);
  if (!artifacts.scanGroup) {
    artifacts.scanGroup = new THREE.Group();
    artifacts.scanGroup.name = 'ScanGroup';
    artifacts.appRoot.add(artifacts.scanGroup);
  } else {
    artifacts.scanGroup.clear();
  }
  scanRoot.userData.af_tag = 'APP';
  artifacts.scanGroup.add(scanRoot);
  setLayerDeep(artifacts.scanGroup, LAYERS.APP);
}

export function addDebugHelper(obj: THREE.Object3D) {
  obj.name ||= 'FitBox';
  artifacts.debugGroup.add(obj);
}
