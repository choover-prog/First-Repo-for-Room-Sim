import * as THREE from 'three';
import { registerCustomElementsOnce } from '../ui/register-elements';
import { toast } from '../core/toast';

export function bootstrapApp(ctx: { scene: THREE.Scene; camera: THREE.PerspectiveCamera; controls?: any }){
  registerCustomElementsOnce();
  ctx.camera.up.set(0,0,1);
  ctx.controls?.update();
  removeStrayDebugMeshes(ctx.scene);
}

function removeStrayDebugMeshes(scene: THREE.Scene){
  const stray: THREE.Object3D[] = [];
  scene.children.forEach(o => {
    const geom = (o as any).geometry;
    const name = o.name || '';
    if(geom?.type === 'BoxGeometry' && (!name || /debug|placeholder|cube/i.test(name))){
      stray.push(o);
    }
  });
  stray.forEach(o => scene.remove(o));
  if(stray.length) toast.warn(`Removed ${stray.length} stray debug mesh(es)`);
}
