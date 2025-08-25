import { playSweep } from '../audio/sweep.js';

function el(html){
  const t=document.createElement('template');
  t.innerHTML=html.trim();
  return t.content.firstChild;
}

export function mountCalibrationPanel(container){
  const root = el(`
    <div style="margin-top:12px">
      <h2 style="font-size:16px;margin:8px 0">Calibration</h2>
      <ol style="font-size:12px;padding-left:16px">
        <li><button id="calSweep">Play Sweep</button></li>
        <li><input type="file" id="calImport" accept=".csv"/></li>
        <li><button id="calExport">Export Filter</button></li>
      </ol>
    </div>
  `);
  container.appendChild(root);
  root.querySelector('#calSweep').onclick=()=>playSweep();
  root.querySelector('#calExport').onclick=()=>{
    const data = 'freq,gain\n100,-3';
    const blob = new Blob([data],{type:'text/csv'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'filters.csv';
    a.click();
  };
  root.querySelector('#calImport').onchange=e=>{
    const file=e.target.files[0];
    if(!file) return;
    const reader=new FileReader();
    reader.onload=()=>console.log('[cal] import', reader.result.slice(0,50));
    reader.readAsText(file);
  };
}
