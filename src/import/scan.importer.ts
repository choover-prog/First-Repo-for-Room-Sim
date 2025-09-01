import * as THREE from 'three';
import { attachScan, addDebugHelper } from '../core/room.session';
import { ROOM_CHANGED } from '../state/room.slice';

// Import a GLB/GLTF room scan and attach it via the ScanGroup
export async function importRoomScan(fileOrUrl: File | string, ctx: { scene: THREE.Scene; loaders: any; bus: any; core?: any; controls?: any }) {
  const gltf = await ctx.loaders.gltf(fileOrUrl);
  const root = gltf.scene;
  root.updateMatrixWorld(true);

  // optional debug helper to visualize scan bounds
  const box = new THREE.Box3().setFromObject(root);
  const helper = new THREE.Box3Helper(box, 0x888888);
  addDebugHelper(helper);

  attachScan(ctx.scene, root);

  // try to fit camera similarly to presets
  if (ctx.core?.fitToBox) {
    ctx.core.fitToBox(box);
  } else if (ctx.controls?.update) {
    ctx.controls.update();
  }

  ctx.bus.emit(ROOM_CHANGED, { presetId: 'scan_import', box });
}
