import { makeToggle } from './toggles';
import { getOverlays, setCeilingOpacity, toggleCeilingVisibilityQuick } from '../state/overlays.slice';
import { buildRoomFromPreset } from '../core/room.factory';
import { getRoom } from '../state/room.slice';
import { importRoomScan } from '../import/scan.importer';

export function mountTopToolbar(ctx: { scene: any; camera: any; controls: any; bus: any; loaders: any; core?: any }) {
  const toolbar = document.getElementById('top-toolbar');
  if (!toolbar) return;

  // Load Test Room dropdown
  const roomSel = document.createElement('select');
  roomSel.id = 'roomPreset';
  ['baseline_6x8x2.6', 'small_4.2x5.5x2.4', 'l_room', 'low_ceiling_5x5x2.25'].forEach((id) => {
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = id;
    roomSel.appendChild(opt);
  });
  const cur = getRoom().presetId;
  if (cur) roomSel.value = cur;
  roomSel.addEventListener('change', () => buildRoomFromPreset(roomSel.value, ctx));
  toolbar.appendChild(roomSel);

  // Load Sample button using a deterministic preset
  const sampleBtn = document.createElement('button');
  sampleBtn.textContent = 'Load Sample';
  sampleBtn.addEventListener('click', () => buildRoomFromPreset('baseline_6x8x2.6', ctx));
  toolbar.appendChild(sampleBtn);

  // File input for GLB imports
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.glb,.gltf';
  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (file) importRoomScan(file, ctx);
  });
  toolbar.appendChild(fileInput);

  // existing toggles
  toolbar.appendChild(
    makeToggle({
      id: 'tglPlaneNormals',
      label: 'Show plane normals',
      onChange: (c) => window.dispatchEvent(new CustomEvent('ui:action', { detail: { id: 'tglPlaneNormals', payload: c } })),
    })
  );
  toolbar.appendChild(
    makeToggle({
      id: 'tglBouncePoints',
      label: 'Show bounce points',
      onChange: (c) => window.dispatchEvent(new CustomEvent('ui:action', { detail: { id: 'tglBouncePoints', payload: c } })),
    })
  );

  // ceiling quick toggle
  const quick = makeToggle({
    id: 'tglCeiling',
    label: 'See-through ceiling',
    checked: getOverlays().ceilingOpacity < 0.8,
    onChange: () => toggleCeilingVisibilityQuick(),
  });
  toolbar.appendChild(quick);

  // opacity slider
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = '0.15';
  slider.max = '1';
  slider.step = '0.01';
  slider.value = String(getOverlays().ceilingOpacity);
  slider.addEventListener('input', (e) =>
    setCeilingOpacity(parseFloat((e.target as HTMLInputElement).value))
  );
  toolbar.appendChild(slider);

  // selection dropdown placeholder
  const sel = document.createElement('select');
  sel.id = 'entitySelect';
  toolbar.appendChild(sel);

  // constrain to floor toggle
  toolbar.appendChild(
    makeToggle({
      id: 'tglFloor',
      label: 'Constrain to floor',
      onChange: (c) =>
        window.dispatchEvent(new CustomEvent('ui:action', { detail: { id: 'constrainFloor', payload: c } })),
    })
  );
  // snap toggle
  toolbar.appendChild(
    makeToggle({
      id: 'tglSnap',
      label: 'Snap 5 cm',
      onChange: (c) =>
        window.dispatchEvent(new CustomEvent('ui:action', { detail: { id: 'snap', payload: c } })),
    })
  );
}
