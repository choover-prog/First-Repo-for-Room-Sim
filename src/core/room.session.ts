import * as THREE from 'three';

// Central artifact registry so we can teardown/attach deterministically
export type RoomArtifacts = {
  roomGroup: THREE.Group | null;
  debugGroup: THREE.Group;
  entitiesGroup: THREE.Group | null;
  scanGroup: THREE.Group | null;
};

export const artifacts: RoomArtifacts = {
  roomGroup: null,
  debugGroup: new THREE.Group(),
  entitiesGroup: null,
  scanGroup: null,
};

// Ensure the DebugHelpers group is attached once so helpers are easy to purge
export function ensureDebugGroupAttached(scene: THREE.Scene) {
  if (!artifacts.debugGroup.parent) {
    artifacts.debugGroup.name = 'DebugHelpers';
    scene.add(artifacts.debugGroup);
  }
}

// Remove stray meshes such as placeholder slabs and bbox helpers
function purgeStrays(scene: THREE.Scene) {
  const killNames = /^(FitBox|bboxHelper|MediumRoom|SampleRoom|Placeholder|DebugRoom|Cube|Box)$/i;
  // Clear any helpers we added under DebugHelpers
  artifacts.debugGroup.clear();

  const toRemove: THREE.Object3D[] = [];
  scene.children.forEach((o) => {
    const isMesh = (o as any).isMesh === true;
    const isBoxGeo = isMesh && (o as any).geometry?.type === 'BoxGeometry';
    const namedStray = killNames.test(o.name || '');
    if ((isBoxGeo || namedStray) && !['RoomGroup', 'EntitiesGroup', 'ScanGroup'].includes(o.name)) {
      toRemove.push(o);
    }
  });
  toRemove.forEach((o) => {
    o.traverse((n: any) => {
      n.geometry?.dispose?.();
      n.material?.dispose?.();
    });
    scene.remove(o);
  });
  if (toRemove.length) {
    console.warn(`[room.session] Purged ${toRemove.length} stray mesh(es)`);
  }
}

export function detachPreviousRoom(scene: THREE.Scene) {
  if (artifacts.roomGroup) {
    artifacts.roomGroup.traverse((n: any) => {
      n.geometry?.dispose?.();
      n.material?.dispose?.();
    });
    scene.remove(artifacts.roomGroup);
    artifacts.roomGroup = null;
  }
  if (artifacts.scanGroup) {
    artifacts.scanGroup.traverse((n: any) => {
      n.geometry?.dispose?.();
      n.material?.dispose?.();
    });
    scene.remove(artifacts.scanGroup);
    artifacts.scanGroup = null;
  }
  purgeStrays(scene);
}

export function attachRoom(scene: THREE.Scene, roomGroup: THREE.Group) {
  detachPreviousRoom(scene);
  roomGroup.name = 'RoomGroup';
  scene.add(roomGroup);
  artifacts.roomGroup = roomGroup;
  ensureDebugGroupAttached(scene);
}

export function attachScan(scene: THREE.Scene, scanRoot: THREE.Object3D) {
  if (!artifacts.scanGroup) {
    artifacts.scanGroup = new THREE.Group();
    artifacts.scanGroup.name = 'ScanGroup';
    scene.add(artifacts.scanGroup);
  } else {
    artifacts.scanGroup.clear();
  }
  artifacts.scanGroup.add(scanRoot);
}

export function addDebugHelper(obj: THREE.Object3D) {
  obj.name ||= 'FitBox';
  artifacts.debugGroup.add(obj);
}
