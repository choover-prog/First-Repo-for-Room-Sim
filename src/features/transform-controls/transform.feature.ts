import { Object3D, Scene } from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { clampEntityPosition } from '../../core/constraints';
import type { Bounds } from '../../core/constraints';

interface Ctx {
  camera: any;
  domElement: HTMLElement;
  orbit: { enabled: boolean };
  scene: Scene;
  roomBounds: Bounds;
}

export function initTransformFeature(ctx: Ctx){
  const controls = new TransformControls(ctx.camera, ctx.domElement);
  ctx.scene.add(controls);
  controls.setMode('translate');
  controls.space = 'world';
  controls.addEventListener('dragging-changed', e => { ctx.orbit.enabled = !e.value; });
  controls.addEventListener('objectChange', () => {
    if (controls.object) clampEntityPosition(controls.object as Object3D, ctx.roomBounds);
  });
  function attach(obj: Object3D){ controls.attach(obj); }
  function detach(){ controls.detach(); }
  function setSnap(enabled: boolean){ controls.setTranslationSnap(enabled ? 0.05 : null); }
  function setFloorConstraint(enabled: boolean){ /* placeholder */ }
  return { controls, attach, detach, setSnap, setFloorConstraint };
}
