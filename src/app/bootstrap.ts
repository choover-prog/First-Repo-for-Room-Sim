import * as THREE from 'three';
import { registerCustomElementsOnce } from '../ui/register-elements';
import { ensureAppRoot, purgeLegacyStrays } from '../core/room.session';
import { LAYERS } from '../core/scene.layers';

export function bootstrapApp(ctx: { scene: THREE.Scene; camera: THREE.PerspectiveCamera; controls?: any }) {
  registerCustomElementsOnce();

  ctx.camera.up.set(0, 0, 1);
  ctx.controls?.update();

  ensureAppRoot(ctx.scene);
  ctx.camera.layers.disableAll?.();
  ctx.camera.layers.enable(LAYERS.APP);

  purgeLegacyStrays(ctx.scene);
}
