import * as THREE from 'three';
import { attachScan } from '../core/room.session';
import { ROOM_CHANGED } from '../state/room.slice';

// Import a GLB/GLTF room scan and attach it via the ScanGroup
export async function importRoomScan(fileOrUrl: File | string, ctx: { scene: THREE.Scene; loaders: any; bus: any; core?: any; controls?: any }) {
  const gltf = await ctx.loaders.gltf(fileOrUrl);
  const root = gltf.scene;
  root.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(root);
  attachScan(ctx.scene, root);

  if (ctx.core?.fitToBox) {
    ctx.core.fitToBox(box);
  } else {
    ctx.controls?.update?.();
  }

  ctx.bus.emit(ROOM_CHANGED, { presetId: 'scan_import', box });
}
