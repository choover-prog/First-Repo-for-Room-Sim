import * as THREE from 'three';
import { registerCustomElementsOnce } from '../ui/register-elements';
import { ensureDebugGroupAttached } from '../core/room.session';

export function bootstrapApp(ctx: { scene: THREE.Scene; camera: THREE.PerspectiveCamera; controls?: any }) {
  // register any web components once to avoid duplicate definition errors
  registerCustomElementsOnce();
  // enforce Z-up coordinate system
  ctx.camera.up.set(0, 0, 1);
  ctx.controls?.update();
  // ensure debug helpers group exists for future purge
  ensureDebugGroupAttached(ctx.scene);
}
