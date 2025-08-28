import { initObjectControls } from '../three/controls/objectControls.js';
import { dispatch } from '../state/store.js';

let api = null;

export function mountObjectToolbar(ctx){
  api = initObjectControls(ctx);

  const $ = id => document.getElementById(id);

  $('#toolSelect')?.addEventListener('click', ()=>{
    api.setModeSelect();
    api.setSnapEnabled($('#chkSnap')?.checked);
  });
  $('#toolTranslate')?.addEventListener('click', ()=> api.setModeTranslate());
  $('#toolRotate')?.addEventListener('click', ()=> api.setModeRotate());
  $('#btnDuplicate')?.addEventListener('click', ()=> api.duplicateSelected());
  $('#btnDeleteObj')?.addEventListener('click', ()=> api.deleteSelected());
  $('#btnUndoObj')?.addEventListener('click', ()=> dispatch({type:'Undo'}));
  $('#btnRedoObj')?.addEventListener('click', ()=> dispatch({type:'Redo'}));

  $('#chkSnap')?.addEventListener('change', (e)=> api.setSnapEnabled(e.target.checked));
  $('#snapSize')?.addEventListener('change', (e)=> api.setSnapSize(parseFloat(e.target.value)));

  // Keyboard shortcuts
  window.addEventListener('keydown', (e)=>{
    const mod = e.ctrlKey || e.metaKey;
    if (e.key==='w' || e.key==='W'){ api.setModeTranslate(); }
    if (e.key==='e' || e.key==='E'){ api.setModeRotate(); }
    if (mod && (e.key==='z' || e.key==='Z')){ dispatch({type:'Undo'}); e.preventDefault(); }
    if (mod && (e.key==='y' || e.key==='Y')){ dispatch({type:'Redo'}); e.preventDefault(); }
    if (mod && (e.key==='d' || e.key==='D')){ api.duplicateSelected(); e.preventDefault(); }
    if (e.key==='Delete' || e.key==='Backspace'){ api.deleteSelected(); e.preventDefault(); }
    if (mod && (e.key==='g' || e.key==='G')){
      const chk = document.getElementById('chkSnap'); if (chk){ chk.checked = !chk.checked; chk.dispatchEvent(new Event('change')); }
      e.preventDefault();
    }
  });
}
