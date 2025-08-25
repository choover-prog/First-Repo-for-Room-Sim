import { flags } from '../config/flags.js';
import { snapshot, exportJSON } from '../lib/ledger.js';
import './admin.css';

function el(html){
  const t=document.createElement('template');
  t.innerHTML=html.trim();
  return t.content.firstChild;
}

function render(){
  const root = el(`<div class="admin">
    <h1>Admin Dashboard</h1>
    <h2>Feature Flags</h2>
    <pre>${JSON.stringify(flags, null, 2)}</pre>
    <h2>Jobs</h2>
    <div id="jobLog"></div>
    <h2>Ledger</h2>
    <button id="ledgerExport">Export JSON</button>
  </div>`);
  document.body.appendChild(root);
  root.querySelector('#ledgerExport').onclick=()=>exportJSON();
}

if(new URLSearchParams(location.search).get('admin')==='1'){
  render();
}else{
  document.body.textContent='unauthorized';
}
