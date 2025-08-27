import * as RoomState from '../room/RoomState.js';
import { saveRoomJSON, loadRoomJSON } from '../io/roomio.js';

function nextId(type){
  return `${type}_${Math.random().toString(36).slice(2,6)}`;
}

const speakerRoles = ['L','R','C','SL','SR','SBL','SBR','TFL','TFR','TRL','TRR'];
const subRoles = ['SUB1','SUB2','SUB3','SUB4'];
function nextRole(type){
  const roles = type==='speaker'?speakerRoles:subRoles;
  const used = RoomState.getState().objects.map(o=>o.role);
  for (const r of roles){ if(!used.includes(r)) return r; }
  return type==='speaker'?`L${used.length}`:`SUB${used.length+1}`;
}

export function mountObjectManager(container){
  const root = document.createElement('div');
  root.style.padding = '8px';
  container.appendChild(root);

  const addRow = document.createElement('div');
  addRow.className = 'row';
  const addSpk = document.createElement('button'); addSpk.textContent = 'Add Speaker';
  const addSub = document.createElement('button'); addSub.textContent = 'Add Sub';
  const addMLP = document.createElement('button'); addMLP.textContent = 'Add MLP';
  addRow.append(addSpk, addSub, addMLP);
  root.appendChild(addRow);

  const list = document.createElement('div');
  root.appendChild(list);

  const saveRow = document.createElement('div');
  saveRow.className = 'row';
  const saveBtn = document.createElement('button'); saveBtn.textContent = 'Save';
  const loadInput = document.createElement('input'); loadInput.type = 'file'; loadInput.accept = '.json';
  saveRow.append(saveBtn, loadInput);
  root.appendChild(saveRow);

  addSpk.onclick = () => {
    const role = nextRole('speaker');
    RoomState.addObject({
      id: nextId('spk'),
      type: 'speaker',
      role,
      transform: { pos: [0,1,-1], rot_euler:[0,0,0], scale:[1,1,1] },
      source: 'manual.v1'
    });
  };

  addSub.onclick = () => {
    const role = nextRole('sub');
    RoomState.addObject({
      id: nextId('sub'),
      type: 'sub',
      role,
      transform: { pos: [0,0.4,-1], rot_euler:[0,0,0], scale:[1,1,1] },
      source: 'manual.v1'
    });
  };

  addMLP.onclick = () => {
    RoomState.setMLP({ pos:[0,1,1], yaw:0 });
  };

  saveBtn.onclick = () => {
    saveRoomJSON(RoomState.getState());
  };

  loadInput.onchange = async e => {
    const f = e.target.files[0];
    if (!f) return;
    const data = await loadRoomJSON(f);
    RoomState.replaceAll(data);
  };

  function render(){
    list.innerHTML = '';
    const { objects, mlp } = RoomState.getState();
    objects.forEach(obj => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.gap = '4px';
      const roleSel = document.createElement('select');
      (obj.type==='speaker'?speakerRoles:subRoles).forEach(r=>{
        const opt = document.createElement('option'); opt.value=r; opt.textContent=r; if(r===obj.role) opt.selected=true; roleSel.appendChild(opt);
      });
      roleSel.onchange = () => { RoomState.updateObject(obj.id, { role: roleSel.value }); };
      const model = document.createElement('input'); model.placeholder='model'; model.value = obj.model_id||''; model.onchange=()=>RoomState.updateObject(obj.id,{ model_id:model.value });
      const posInputs = ['x','y','z'].map((ax,i)=>{
        const wrap = document.createElement('span');
        const inp = document.createElement('input'); inp.type='number'; inp.step='0.1'; inp.value=obj.transform.pos[i];
        inp.onchange=()=>{ const p=[...obj.transform.pos]; p[i]=parseFloat(inp.value); RoomState.updateObject(obj.id,{ transform:{...obj.transform,pos:p} }); };
        const dec = document.createElement('button'); dec.textContent='-'; dec.onclick=()=>{ inp.value=parseFloat(inp.value)-0.1; inp.dispatchEvent(new Event('change')); };
        const inc = document.createElement('button'); inc.textContent='+'; inc.onclick=()=>{ inp.value=parseFloat(inp.value)+0.1; inp.dispatchEvent(new Event('change')); };
        wrap.append(inp,dec,inc); return wrap; });
      const del = document.createElement('button'); del.textContent='Del'; del.onclick=()=>{ RoomState.removeObject(obj.id); };
      row.append(roleSel, model, ...posInputs, del);
      list.appendChild(row);
    });
    if (mlp){
      const row = document.createElement('div');
      row.style.display='flex';
      row.style.gap='4px';
      ['x','y','z'].forEach((ax,i)=>{
        const wrap=document.createElement('span');
        const inp=document.createElement('input'); inp.type='number'; inp.step='0.1'; inp.value=mlp.pos[i];
        inp.onchange=()=>{ const p=[...mlp.pos]; p[i]=parseFloat(inp.value); RoomState.setMLP({ pos:p }); };
        const dec=document.createElement('button'); dec.textContent='-'; dec.onclick=()=>{ inp.value=parseFloat(inp.value)-0.1; inp.dispatchEvent(new Event('change')); };
        const inc=document.createElement('button'); inc.textContent='+'; inc.onclick=()=>{ inp.value=parseFloat(inp.value)+0.1; inp.dispatchEvent(new Event('change')); };
        wrap.append(inp,dec,inc); row.appendChild(wrap);
      });
      const yawInp=document.createElement('input'); yawInp.type='number'; yawInp.step='0.1'; yawInp.value=mlp.yaw; yawInp.onchange=()=>RoomState.setMLP({ yaw: parseFloat(yawInp.value) });
      row.appendChild(yawInp);
      list.appendChild(row);
    }
  }

  RoomState.subscribe(()=>render());
  render();
}
