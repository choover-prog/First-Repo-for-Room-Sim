import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { mountEquipmentPanel } from './panels/EquipmentPanel.js';
import { mountOnboarding } from './ui/Onboarding.js';
import { personasList, getPersona, setPersona, isTooltipsEnabled, setTooltipsEnabled } from './lib/persona.js';
import { loadCatalog } from './lib/catalog.js';
import { cart } from './lib/cart.js';
import { mountCartPanel } from './ui/CartPanel.js';
import { checkoutAffiliate, checkoutDirect } from './commerce/checkout.js';

const mToFt = 3.28084;

// DOM
const container   = document.getElementById('view');
const statsEl     = document.getElementById('stats');
const gridToggle  = document.getElementById('gridT');
const axesToggle  = document.getElementById('axesT');
const fileInput   = document.getElementById('file');
const loadSample  = document.getElementById('loadSample');
const measureBtn  = document.getElementById('measureBtn');
const clearBtn    = document.getElementById('clearMeasure');
const unitsSel    = document.getElementById('units');
const labelEl     = document.getElementById('measureLabel');
(function addSettingsStrip(){
  const ui = document.getElementById('ui');
  if (!ui || document.getElementById('settingsStrip')) return;
  const div = document.createElement('div');
  div.id = 'settingsStrip';
  div.style = 'margin-bottom:8px;border-bottom:1px solid #232832;padding-bottom:8px';
  const persona = getPersona();
  const opts = personasList().map(p => `<option value="${p.id}" ${p.id===persona?'selected':''}>${p.label}</option>`).join('');
  div.innerHTML = `
    <div class="row" style="align-items:center;gap:8px">
      <label>Persona:
        <select id="personaSel">${opts}</select>
      </label>
      <label>Tooltips:
        <input id="tipsChk" type="checkbox" ${isTooltipsEnabled()?'checked':''}/>
      </label>
      <button id="resetOnb" title="Show first-time persona tutorial again">Run Tutorial</button>
    </div>
  `;
  ui.prepend(div);
  div.querySelector('#personaSel').onchange = (e)=> setPersona(e.target.value);
  div.querySelector('#tipsChk').onchange = (e)=> setTooltipsEnabled(e.target.checked);
  div.querySelector('#resetOnb').onclick = ()=> mountOnboarding(document.body);
})();

await loadCatalog();
async function handleCheckout(mode = cart.mode) {
  if (mode === 'affiliate') return checkoutAffiliate(cart);
  return checkoutDirect(cart);
}
const cartPanel = mountCartPanel({ rootEl: document.body, onCheckout: handleCheckout });
const btnCart = document.getElementById('btnCart');
btnCart.onclick = () => cartPanel.toggle();
function updateCartBtn() { btnCart.textContent = `Cart (${cart.items.reduce((a,i)=>a+i.qty,0)})`; }
window.addEventListener('cart:change', updateCartBtn);
updateCartBtn();

mountEquipmentPanel(document.getElementById('ui'));
mountOnboarding(document.body);


// Renderer / Scene / Camera
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

const scene  = new THREE.Scene();
scene.background = new THREE.Color(0x0b0d10);

const camera = new THREE.PerspectiveCamera(
  60,
  container.clientWidth / container.clientHeight,
  0.01,
  10000
);
camera.position.set(4, 2, 6);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
scene.add(new THREE.HemisphereLight(0xffffff, 0x223344, 0.9));
const dir = new THREE.DirectionalLight(0xffffff, 0.7);
dir.position.set(6, 8, 5);
scene.add(dir);

// Helpers
const grid = new THREE.GridHelper(20, 20, 0x335577, 0x223344);
grid.material.opacity = 0.25;
grid.material.transparent = true;
scene.add(grid);

const axes = new THREE.AxesHelper(2);
scene.add(axes);

// Pickable meshes (for measuring)
let pickables = [];

// GLTF Loader
const loader = new GLTFLoader();
let root = null;

// ---------- Utility UI ----------
gridToggle.onchange = e => (grid.visible = e.target.checked);
axesToggle.onchange = e => (axes.visible = e.target.checked);

// ---------- Model prep / framing ----------
function prepMaterialsAndHideCube(obj) {
  obj.traverse(o => {
    if (!o.isMesh) return;
    // help with inside faces from scans
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    for (const m of mats) if (m && m.side !== THREE.DoubleSide) m.side = THREE.DoubleSide;
    // hide a stray Blender Cube shell if present
    if (/^cube$/i.test(o.name)) o.visible = false;
  });
}

function buildPickables(obj) {
  pickables = [];
  obj.traverse(o => { if (o.isMesh) pickables.push(o); });
}

function centerScaleAndFrame(obj) {
  const box = new THREE.Box3().setFromObject(obj);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  // normalize to about 8m across longest axis
  const longest = Math.max(size.x, size.y, size.z);
  if (isFinite(longest) && longest > 0) {
    const s = THREE.MathUtils.clamp(8 / longest, 0.001, 1000);
    obj.scale.setScalar(s);
  }

  // re-evaluate after scale
  const box2 = new THREE.Box3().setFromObject(obj);
  const sz = new THREE.Vector3();
  const ct = new THREE.Vector3();
  box2.getSize(sz);
  box2.getCenter(ct);

  // center to origin
  obj.position.sub(ct);

  // frame
  const fov = THREE.MathUtils.degToRad(camera.fov);
  let dist = Math.max(sz.x, sz.y, sz.z) / (2 * Math.tan(fov / 2));
  dist *= 1.6;

  camera.near = Math.max(0.01, Math.min(sz.x, sz.y, sz.z) / 200);
  camera.far  = Math.max(1000, Math.max(sz.x, sz.y, sz.z) * 50);
  camera.updateProjectionMatrix();

  camera.position.set(dist * 0.6, dist * 0.4, dist);
  controls.target.set(0, 0, 0);
  controls.update();

  grid.position.y = box2.min.y;

  statsEl.textContent =
    `Size: ${sz.x.toFixed(2)}×${sz.y.toFixed(2)}×${sz.z.toFixed(2)} m  |  ` +
    `${(sz.x*mToFt).toFixed(2)}×${(sz.y*mToFt).toFixed(2)}×${(sz.z*mToFt).toFixed(2)} ft`;
}

// ---------- Loaders ----------
function onParsed(gltf) {
  try {
    if (root) {
      scene.remove(root);
      clearMeasure();
    }
    root = gltf.scene || gltf.scenes?.[0];
    if (!root) throw new Error('No scene in GLB');

    prepMaterialsAndHideCube(root);
    buildPickables(root);

    scene.add(root);
    centerScaleAndFrame(root);
  } catch (err) {
    console.error(err);
    alert(`Model parsed but could not be displayed: ${err.message}`);
  }
}

function loadArrayBuffer(buf) {
  try {
    loader.parse(
      buf, '', onParsed,
      e => { console.error('GLB parse failed', e); alert('GLB parse failed (see console).'); }
    );
  } catch (err) {
    console.error(err);
    alert(`Unexpected parse error: ${err.message}`);
  }
}

function fetchAndLoad(url) {
  statsEl.textContent = `Loading: ${url}`;
  fetch(url)
    .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.arrayBuffer(); })
    .then(loadArrayBuffer)
    .catch(err => { console.error(err); alert(`Could not load ${url}\n${err.message}`); });
}

// File input / Sample / Drag&Drop
fileInput.addEventListener('change', e => {
  const f = e.target.files?.[0];
  if (!f) return;
  statsEl.textContent = `Loading local file: ${f.name}`;
  f.arrayBuffer().then(loadArrayBuffer).catch(err => { console.error(err); alert(`Read error: ${err.message}`); });
});

loadSample.addEventListener('click', () => fetchAndLoad('/examples/sample-room.glb'));

container.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; });
container.addEventListener('drop', e => {
  e.preventDefault();
  const f = e.dataTransfer.files?.[0];
  if (f) f.arrayBuffer().then(loadArrayBuffer);
});

// ---------- Measure Mode ----------
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let measureOn = false;
let pA = null, pB = null;
let markerA = null, markerB = null, line = null;

measureBtn.addEventListener('click', () => {
  measureOn = !measureOn;
  measureBtn.classList.toggle('on', measureOn);
  labelEl.style.display = measureOn && pA && pB ? 'block' : 'none';
});

clearBtn.addEventListener('click', clearMeasure);
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') clearMeasure();
});

function clearMeasure() {
  pA = pB = null;
  if (markerA) { scene.remove(markerA); markerA = null; }
  if (markerB) { scene.remove(markerB); markerB = null; }
  if (line)    { scene.remove(line);    line = null; }
  labelEl.style.display = 'none';
}

function makeMarker(pos) {
  const g = new THREE.SphereGeometry(0.06, 16, 16);
  const m = new THREE.MeshStandardMaterial({ color: 0x4cc3ff, emissive: 0x081d2b, metalness: 0.1, roughness: 0.5 });
  const mesh = new THREE.Mesh(g, m);
  mesh.position.copy(pos);
  mesh.renderOrder = 999; // keep on top a bit
  return mesh;
}

function makeLine(a, b) {
  const geo = new THREE.BufferGeometry().setFromPoints([ a.clone(), b.clone() ]);
  const mat = new THREE.LineBasicMaterial({ color: 0x7fb3ff, linewidth: 2 });
  return new THREE.Line(geo, mat);
}

function updateLine() {
  if (!line || !pA || !pB) return;
  const pos = line.geometry.attributes.position;
  pos.setXYZ(0, pA.x, pA.y, pA.z);
  pos.setXYZ(1, pB.x, pB.y, pB.z);
  pos.needsUpdate = true;
}

function setPointerFromEvent(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  const x = ( (event.clientX - rect.left) / rect.width ) * 2 - 1;
  const y = - ( (event.clientY - rect.top) / rect.height ) * 2 + 1;
  pointer.set(x, y);
}

function intersectAtPointer() {
  if (!pickables.length) return null;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(pickables, true);
  return hits[0] || null;
}

renderer.domElement.addEventListener('pointerdown', e => {
  if (!measureOn) return;
  setPointerFromEvent(e);
  const hit = intersectAtPointer();
  if (!hit) return;

  if (!pA) {
    pA = hit.point.clone();
    markerA = makeMarker(pA);
    scene.add(markerA);
    labelEl.style.display = 'none';
  }
  else if (!pB) {
    pB = hit.point.clone();
    markerB = makeMarker(pB);
    scene.add(markerB);
    if (!line) {
      line = makeLine(pA, pB);
      scene.add(line);
    } else {
      updateLine();
    }
    labelEl.style.display = 'block';
  }
  else {
    // start over with a new A
    clearMeasure();
    pA = hit.point.clone();
    markerA = makeMarker(pA);
    scene.add(markerA);
  }
});

renderer.domElement.addEventListener('pointermove', e => {
  if (!measureOn) return;
  if (!pA || pB) return; // only preview between placing A and B
  setPointerFromEvent(e);
  const hit = intersectAtPointer();
  if (!hit) return;

  if (!line) {
    line = makeLine(pA, hit.point);
    scene.add(line);
  } else {
    pB = hit.point.clone();
    updateLine();
    pB = null; // keep it as preview only
  }
});

// screen-space label updates
function updateMeasureLabel() {
  if (!pA || !pB) return;

  // midpoint in world
  const mid = new THREE.Vector3().addVectors(pA, pB).multiplyScalar(0.5);

  // project to NDC -> screen px
  const ndc = mid.clone().project(camera);
  const x = (ndc.x * 0.5 + 0.5) * renderer.domElement.clientWidth;
  const y = (-ndc.y * 0.5 + 0.5) * renderer.domElement.clientHeight;

  labelEl.style.left = `${x}px`;
  labelEl.style.top  = `${y}px`;

  const distMeters = pA.distanceTo(pB);
  labelEl.textContent = unitsSel.value === 'ft'
    ? `${(distMeters * mToFt).toFixed(2)} ft`
    : `${distMeters.toFixed(2)} m`;
}

// ---------- Resize / Animate ----------
window.addEventListener('resize', () => {
  renderer.setSize(container.clientWidth, container.clientHeight);
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
});

(function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);

  if (measureOn) {
    // only draw label if we have a finished segment
    labelEl.style.display = (pA && pB) ? 'block' : labelEl.style.display;
    if (pA && pB) updateMeasureLabel();
  }
})();
