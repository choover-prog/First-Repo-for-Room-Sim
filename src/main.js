import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { mountEquipmentPanel } from './panels/EquipmentPanel.js';
import { mountOnboarding } from './ui/Onboarding.js';
import { personasList, getPersona, setPersona, isTooltipsEnabled, setTooltipsEnabled } from './lib/persona.js';
import { LFHeatmapLayer } from './render/LFHeatmapLayer.js';
import { captureCanvasPNG, downloadBlobURL, generateRoomReport, exportHeatmapData } from './lib/report.js';
import { BadgeManager } from './ui/Badges.js';
import { mountLayout } from './ui/Layout.js';
import './state/ui.js';
import { bindHotkeys } from './ui/Hotkeys.js';
import { mountViewerHost } from './render/ViewerHost.js';
import { mountSpeakerPanel } from './ui/SpeakerPanel.js';
import { projectStore } from './state/projectStore';
import { SceneGraph } from './viewer/SceneGraph';
import { RaycastController } from './three/interaction/RaycastController';
import { DragController, snap } from './three/interaction/DragController';

const mToFt = 3.28084;

const { regions } = mountLayout({ root: document.getElementById('app') });
bindHotkeys();
mountViewerHost(regions.viewer);
mountEquipmentPanel(regions.right);
mountSpeakerPanel(regions.dock);

// DOM
const container   = document.getElementById('view');
const statsEl     = document.getElementById('stats');
const gridToggle  = document.getElementById('gridT');
const axesToggle  = document.getElementById('axesT');
const fileInput   = document.getElementById('file');
const loadSample  = document.getElementById('btnLoadSample');
const measureBtn  = document.getElementById('measureBtn');
const clearBtn    = document.getElementById('clearMeasure');
const unitsSel    = document.getElementById('units');
const labelEl     = document.getElementById('measureLabel');

// New UI elements
const roomLengthInput = document.getElementById('roomLength');
const roomWidthInput  = document.getElementById('roomWidth');
const roomHeightInput = document.getElementById('roomHeight');
const updateDimensionsBtn = document.getElementById('updateDimensions');
const heatmapToggle = document.getElementById('heatmapToggle');
const exportPNGBtn = document.getElementById('exportPNG');
const exportJSONBtn = document.getElementById('exportJSON');
const targetSizeInput = document.getElementById('targetSize');
const applyCustomScaleBtn = document.getElementById('applyCustomScale');
const snapZoomBtn = document.getElementById('snapZoom');
const resetViewBtn = document.getElementById('resetView');
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

mountOnboarding(document.body);

// Renderer / Scene / Camera
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);
const gl = renderer.getContext();
let glErrorLogged = false;

const scene  = new THREE.Scene();
scene.background = new THREE.Color(0x0b0d10);

const camera = new THREE.PerspectiveCamera(
  60,
  container.clientWidth / container.clientHeight,
  0.01,
  10000
);
camera.position.set(4, 2, 6);

function resize() {
  const w = container.clientWidth;
  const h = container.clientHeight;
  if (w && h) {
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
}
window.addEventListener('resize', resize);
resize();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
ensureDefaultLights(scene);

// Helpers
const grid = new THREE.GridHelper(20, 20, 0x335577, 0x223344);
grid.material.opacity = 0.25;
grid.material.transparent = true;
scene.add(grid);

const axes = new THREE.AxesHelper(2);
scene.add(axes);

const sceneGraph = new SceneGraph(scene);
const ray = new RaycastController(camera, renderer.domElement);
new DragController(projectStore, ray, renderer.domElement);

// Mode label for debugging
const modeEl = document.createElement('div');
modeEl.style.cssText =
  'position:absolute;top:8px;left:8px;padding:2px 6px;font-size:12px;background:#1b2330cc;border:1px solid #2a3446;border-radius:4px';
container.appendChild(modeEl);

projectStore.subscribe(() => {
  const { mode } = projectStore.getState();
  modeEl.textContent = mode;
  controls.enabled = mode === 'idle';
});
modeEl.textContent = projectStore.getState().mode;

function worldFromEvent(ev) {
  const rect = renderer.domElement.getBoundingClientRect();
  const ndc = new THREE.Vector2(
    ((ev.clientX - rect.left) / rect.width) * 2 - 1,
    -((ev.clientY - rect.top) / rect.height) * 2 + 1
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(ndc, camera);
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const hit = new THREE.Vector3();
  raycaster.ray.intersectPlane(plane, hit);
  return { x: hit.x, y: 0, z: hit.z };
}

renderer.domElement.addEventListener('pointerdown', (ev) => {
  const state = projectStore.getState();
  if (state.mode !== 'placingSpeaker' && state.mode !== 'placingMLP') return;
  const world = worldFromEvent(ev);
  if (state.mode === 'placingSpeaker') {
    const p = { x: snap(world.x, 0.0762), y: 0, z: snap(world.z, 0.0762) };
    state.addSpeaker({ model: state.placingModel || 'Generic', pos: p });
    state.setMode('idle');
    console.log('[Place]', 'speaker', '→', p.x.toFixed(3), p.z.toFixed(3));
  } else if (state.mode === 'placingMLP') {
    const p = { x: world.x, y: 0, z: world.z };
    state.addMLP({ pos: p });
    state.setMode('idle');
    console.log('[Place]', 'mlp', '→', p.x.toFixed(3), p.z.toFixed(3));
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    projectStore.getState().setMode('idle');
  }
});

// Initialize new systems
let lfHeatmap = null;
let badgeManager = null;
let measurements = [];
let currentPersona = null;

// Pickable meshes (for measuring)
let pickables = [];

// GLTF Loader with DRACO support
const loadingManager = new THREE.LoadingManager();
loadingManager.onError = (url) => {
  console.error(`Error loading ${url}. If using DRACO compression, place decoders in /public/libs/draco/`);
};

const loader = new GLTFLoader(loadingManager);
const dracoLoader = new DRACOLoader(loadingManager);
dracoLoader.setDecoderPath('/libs/draco/');
loader.setDRACOLoader(dracoLoader);
let root = null;

// Initialize new systems
lfHeatmap = new LFHeatmapLayer(scene);
currentPersona = { tooltipsEnabled: isTooltipsEnabled() };
badgeManager = new BadgeManager(currentPersona);

// ---------- Utility UI ----------
gridToggle.onchange = e => (grid.visible = e.target.checked);
axesToggle.onchange = e => (axes.visible = e.target.checked);

// Room dimensions
if (updateDimensionsBtn && roomLengthInput && roomWidthInput && roomHeightInput) {
  updateDimensionsBtn.addEventListener('click', () => {
    const length = parseFloat(roomLengthInput.value);
    const width = parseFloat(roomWidthInput.value);
    const height = parseFloat(roomHeightInput.value);

    if (length > 0 && width > 0 && height > 0) {
      lfHeatmap.updateDimensions(length, width, height);
      console.log(`Updated room dimensions: ${length}×${width}×${height} ft`);
    }
  });
}

// Heatmap toggle
if (heatmapToggle) {
  heatmapToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
      lfHeatmap.show();
    } else {
      lfHeatmap.hide();
    }
  });
}

// Export functionality
if (exportPNGBtn) {
  exportPNGBtn.addEventListener('click', async () => {
    try {
      const canvas = renderer.domElement;
      const blob = await captureCanvasPNG(canvas, 'room-screenshot.png');
      downloadBlobURL(blob, 'room-screenshot.png');
    } catch (error) {
      console.error('Export PNG failed:', error);
      alert('Failed to export PNG. See console for details.');
    }
  });
}

if (exportJSONBtn && roomLengthInput && roomWidthInput && roomHeightInput) {
  exportJSONBtn.addEventListener('click', () => {
    try {
      const roomData = {
        length: parseFloat(roomLengthInput.value),
        width: parseFloat(roomWidthInput.value),
        height: parseFloat(roomHeightInput.value)
      };

      const heatmapData = lfHeatmap.getState();
      const equipment = {}; // TODO: Add equipment data

      const report = generateRoomReport(roomData, heatmapData, measurements, equipment);
      const jsonString = JSON.stringify(report, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      downloadBlobURL(blob, 'room-report.json');
    } catch (error) {
      console.error('Export JSON failed:', error);
      alert('Failed to export JSON. See console for details.');
    }
  });
}

// Custom scaling
if (applyCustomScaleBtn && targetSizeInput) {
  applyCustomScaleBtn.addEventListener('click', () => {
    if (root) {
      const targetSize = parseFloat(targetSizeInput.value);
      applyCustomScale(root, targetSize);

      // Re-center and update view
      const box = new THREE.Box3().setFromObject(root);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);

      root.position.sub(center);
      fitToScene(root);

      // Update stats
      statsEl.textContent =
        `Size: ${size.x.toFixed(2)}×${size.y.toFixed(2)}×${size.z.toFixed(2)} m  |  ` +
        `${(size.x*mToFt).toFixed(2)}×${(size.y*mToFt).toFixed(2)}×${(size.z*mToFt).toFixed(2)} ft`;
    }
  });
}

if (snapZoomBtn) {
  snapZoomBtn.addEventListener('click', () => {
    if (root) {
      fitToScene(root);
    }
  });
}

if (resetViewBtn) {
  resetViewBtn.addEventListener('click', () => {
    camera.position.set(4, 2, 6);
    controls.target.set(0, 0, 0);
    controls.update();
  });
}

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

// Custom scaling function for when auto-scaling fails
function applyCustomScale(obj, targetSize = 8) {
  const box = new THREE.Box3().setFromObject(obj);
  const size = new THREE.Vector3();
  box.getSize(size);
  
  const longest = Math.max(size.x, size.y, size.z);
  if (isFinite(longest) && longest > 0) {
    const scale = targetSize / longest;
    obj.scale.setScalar(scale);
    console.log(`Applied custom scale: ${scale.toFixed(3)}x (target: ${targetSize}m)`);
  }
}

// Snap zoom function for better initial view
function fitToScene(obj) {
  const box = new THREE.Box3().setFromObject(obj);
  const sphere = box.getBoundingSphere(new THREE.Sphere());
  const fov = THREE.MathUtils.degToRad(camera.fov);
  const dist = sphere.radius / Math.sin(fov / 2);
  camera.position.set(
    sphere.center.x + dist,
    sphere.center.y + dist,
    sphere.center.z + dist
  );
  controls.target.copy(sphere.center);
  controls.update();
  const camDist = camera.position.distanceTo(sphere.center);
  console.log(`Fit to scene - radius: ${sphere.radius.toFixed(2)}m, camera distance: ${camDist.toFixed(2)}m`);
}

function buildPickables(obj) {
  pickables = [];
  obj.traverse(o => { if (o.isMesh) pickables.push(o); });
}

function ensureDefaultLights(scene) {
  if (scene.getObjectByName('DefaultLights')) return;
  const g = new THREE.Group();
  g.name = 'DefaultLights';
  g.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.8));
  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(5, 10, 7);
  g.add(dir);
  scene.add(g);
}

function logBounds(root) {
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  console.log(
    `Mesh added - bbox: ${size.x.toFixed(2)}×${size.y.toFixed(2)}×${size.z.toFixed(2)}m, minY=${box.min.y.toFixed(3)} maxY=${box.max.y.toFixed(3)}`
  );
}

function dropToFloor(root) {
  const box = new THREE.Box3().setFromObject(root);
  root.position.y -= box.min.y;
}

function postLoadPositioning(model) {
  ensureDefaultLights(scene);
  logBounds(model);
  const normalize = localStorage.getItem('ui.normalizeImport') !== 'false';
  if (normalize) {
    centerScaleAndFrame(model);
  } else {
    dropToFloor(model);
    fitToScene(model);
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    statsEl.textContent =
      `Size: ${size.x.toFixed(2)}×${size.y.toFixed(2)}×${size.z.toFixed(2)} m  |  ` +
      `${(size.x * mToFt).toFixed(2)}×${(size.y * mToFt).toFixed(2)}×${(size.z * mToFt).toFixed(2)} ft`;
    grid.position.y = 0;
  }
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

  // center XZ and drop to floor
  obj.position.x -= ct.x;
  obj.position.y -= box2.min.y;
  obj.position.z -= ct.z;

  // Position camera to frame the object
  fitToScene(obj);

  // Update camera near/far planes
  camera.near = Math.max(0.01, Math.min(sz.x, sz.y, sz.z) / 200);
  camera.far  = Math.max(1000, Math.max(sz.x, sz.y, sz.z) * 50);
  camera.updateProjectionMatrix();

  grid.position.y = 0;

  statsEl.textContent =
    `Size: ${sz.x.toFixed(2)}×${sz.y.toFixed(2)}×${sz.z.toFixed(2)} m  |  ` +
    `${(sz.x*mToFt).toFixed(2)}×${(sz.y*mToFt).toFixed(2)}×${(sz.z*mToFt).toFixed(2)} ft`;
}

// ---------- Loaders ----------
function onLoaded(gltf) {
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
    postLoadPositioning(root);
  } catch (err) {
    console.error(err);
    alert(`Model loaded but could not be displayed: ${err.message}`);
  }
}
async function loadURL(url) {
  statsEl.textContent = `Loading: ${url}`;
  try {
    const gltf = await loader.loadAsync(url);
    onLoaded(gltf);
  } catch (err) {
    console.error(err);
    alert(`Could not load ${url}\n${err.message}`);
  }
}

// File input / Sample / Drag&Drop
fileInput.addEventListener('change', async e => {
  const f = e.target.files?.[0];
  if (!f) return;
  statsEl.textContent = `Loading local file: ${f.name}`;
  const url = URL.createObjectURL(f);
  try {
    const gltf = await loader.loadAsync(url);
    onLoaded(gltf);
  } catch (err) {
    console.error(err);
    alert(`Could not load model: ${err.message}`);
  } finally {
    URL.revokeObjectURL(url);
  }
});

loadSample?.addEventListener('click', () => loadURL('/models/sample.glb'));

container.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; });
container.addEventListener('drop', async e => {
  e.preventDefault();
  const f = e.dataTransfer.files?.[0];
  if (!f) return;
  const url = URL.createObjectURL(f);
  try {
    const gltf = await loader.loadAsync(url);
    onLoaded(gltf);
  } catch (err) {
    console.error(err);
  } finally {
    URL.revokeObjectURL(url);
  }
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
  
  // Clear stored measurements
  measurements = [];
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
    
    // Store measurement for export
    const distance = pA.distanceTo(pB);
    const units = unitsSel.value;
    measurements.push({
      pointA: { x: pA.x, y: pA.y, z: pA.z },
      pointB: { x: pB.x, y: pB.y, z: pB.z },
      distance: distance,
      units: units,
      timestamp: new Date().toISOString()
    });
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

  if (!glErrorLogged) {
    const err = gl.getError();
    if (err !== gl.NO_ERROR) {
      console.error('WebGL error', err);
      glErrorLogged = true;
    }
  }

  if (measureOn) {
    // only draw label if we have a finished segment
    labelEl.style.display = (pA && pB) ? 'block' : labelEl.style.display;
    if (pA && pB) updateMeasureLabel();
  }
})();
