import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { subscribe, dispatch } from '../../state/store.js';

let scene, camera, renderer, orbit, control, raycaster, dom;
let snapEnabled = true, snapSize = 0.0762; // meters
const selectable = new Set();   // meshes/groups we can select (speakers, mlp, etc.)
let selected = null;

export function registerSelectable(obj){
  selectable.add(obj);
}
export function unregisterSelectable(obj){
  selectable.delete(obj);
  if (selected === obj) deselect();
}

export function initObjectControls(ctx){
  ({ scene, camera, controls:orbit, renderer } = ctx);
  dom = renderer.domElement;
  raycaster = new THREE.Raycaster();

  control = new TransformControls(camera, dom);
  control.setSpace('world');
  control.addEventListener('dragging-changed', e => { orbit.enabled = !e.value; });
  control.addEventListener('mouseDown', ()=>{ applySnap(); });
  control.addEventListener('objectChange', ()=> {
    if (!selected) return;
    // commit move/rotate in mouseUp
  });
  control.addEventListener('mouseUp', ()=> {
    if (!selected) return;
    const pos = selected.position;
    if (control.getMode()==='translate'){
      dispatch({ type:'Move', object:selected.userData?.kind || 'speaker', id:selected.userData?.id, pos:{ x:pos.x, y:pos.y, z:pos.z } });
    }
    if (control.getMode()==='rotate'){
      const deg = THREE.MathUtils.radToDeg(selected.rotation.y);
      dispatch({ type:'RotateY', id:selected.userData?.id, setTo:deg });
    }
  });
  scene.add(control);

  // Selection by click
  dom.addEventListener('pointerdown', onPointerDown);

  // React to store changes (selection created/deleted)
  subscribe(state => {
    if (state.selected){
      const obj = findById(state.selected);
      if (obj) select(obj); else deselect();
    } else {
      deselect();
    }
  });

  return {
    setModeSelect(){ control.detach(); markActive('toolSelect'); },
    setModeTranslate(){ control.setMode('translate'); markActive('toolTranslate'); },
    setModeRotate(){ control.setMode('rotate'); markActive('toolRotate'); },
    duplicateSelected(){ if(!selected) return; duplicateObject(selected); },
    deleteSelected(){ if(!selected) return; deleteObject(selected); },
    setSnapEnabled(v){ snapEnabled = v; applySnap(); },
    setSnapSize(v){ snapSize = Math.max(0, v||0); applySnap(); },
  };
}

function onPointerDown(e){
  const rect = dom.getBoundingClientRect();
  const ndc = new THREE.Vector2(
    ((e.clientX - rect.left)/rect.width)*2 - 1,
    -((e.clientY - rect.top)/rect.height)*2 + 1
  );
  raycaster.setFromCamera(ndc, camera);
  const hits = raycaster.intersectObjects([...selectable], true);
  if (hits.length){
    const root = getRootRegistered(hits[0].object);
    if (root) {
      dispatch({ type:'Select', payload:{ type: root.userData?.kind || 'speaker', id: root.userData?.id }});
      select(root);
    }
  } else {
    dispatch({ type:'Select', payload:null });
    deselect();
  }
}

function getRootRegistered(obj){
  let p = obj;
  while (p && p.parent){ if (selectable.has(p)) return p; p = p.parent; }
  return selectable.has(obj) ? obj : null;
}

function select(obj){
  selected = obj;
  control.attach(obj);
  applySnap();
  markActive(null);
}
function deselect(){
  selected = null;
  control.detach();
  markActive('toolSelect');
}

function applySnap(){
  if (!control) return;
  if (snapEnabled){
    control.setTranslationSnap(snapSize);
    control.setRotationSnap(THREE.MathUtils.degToRad(5));
  } else {
    control.setTranslationSnap(null);
    control.setRotationSnap(null);
  }
}

function duplicateObject(src){
  const clone = src.clone(true);
  clone.position.x += snapSize || 0.1;
  src.parent.add(clone);
  dispatch({ type:'Duplicate', id: src.userData?.id });
}

function deleteObject(obj){
  dispatch({ type:'Delete', typeOf: obj.userData?.kind || 'speaker', id: obj.userData?.id });
  obj.parent?.remove(obj);
  deselect();
}

function findById(sel){
  let found = null;
  scene.traverse(o=>{
    if (o.userData && o.userData.id===sel.id && (sel.type===o.userData.kind)) found = o;
  });
  return found;
}

function markActive(id){
  ['toolSelect','toolTranslate','toolRotate'].forEach(x=>{
    const b = document.getElementById(x); if (b) b.classList.toggle('active', x===id);
  });
}
