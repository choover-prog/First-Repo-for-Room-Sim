import { isCollapsed, setCollapsed, isFullscreen, setFullscreen } from '../state/ui.js';

export function mountLayout({ root }){
  const app = document.createElement('div');
  app.id = 'layout';
  app.style.cssText = 'position:fixed;inset:0;display:grid;grid-template-columns:240px 1fr 280px;';

  const style = document.createElement('style');
  style.textContent = `
    #layout .zone{display:flex;flex-direction:column;}
    #layout .zone-header{background:#1a1f29;padding:4px 8px;font-size:12px;display:flex;justify-content:space-between;align-items:center;}
    #layout .zone-body{flex:1;overflow:auto;}
    #layout .viewer{position:relative;flex:1;}
    #layout .dock{height:160px;}
    #layout.fullscreen{grid-template-columns:0 1fr 0;}
  `;
  document.head.append(style);

  const left = makeZone('Navigation');
  const viewerWrap = document.createElement('div');
  viewerWrap.className = 'viewer';
  const dock = makeZone('Controls');
  dock.zone.classList.add('dock');
  const right = makeZone('Equipment');

  const center = document.createElement('div');
  center.style.cssText = 'display:flex;flex-direction:column;';
  center.append(viewerWrap, dock.zone);

  app.append(left.zone, center, right.zone);
  root.append(app);

  // restore collapse states
  applyCollapse(left.zone, 'left');
  applyCollapse(right.zone, 'right');
  applyCollapse(dock.zone, 'bottom');
  if (isFullscreen()) {
    app.classList.add('fullscreen');
  }

  // header buttons
  left.btn.onclick = () => toggleCollapse(left.zone, 'left');
  right.btn.onclick = () => toggleCollapse(right.zone, 'right');
  dock.btn.onclick = () => toggleCollapse(dock.zone, 'bottom');

  const fullBtn = document.createElement('button');
  fullBtn.textContent = 'Fullscreen';
  fullBtn.onclick = () => {
    const f = !isFullscreen();
    setFullscreen(f);
    app.classList.toggle('fullscreen', f);
  };
  viewerWrap.append(fullBtn);

  return { root: app, regions: { left: left.body, viewer: viewerWrap, dock: dock.body, right: right.body } };
}

function makeZone(title){
  const zone = document.createElement('div');
  zone.className = 'zone';
  const header = document.createElement('div');
  header.className = 'zone-header';
  header.textContent = title;
  const btn = document.createElement('button');
  btn.textContent = 'Collapse';
  header.append(btn);
  const body = document.createElement('div');
  body.className = 'zone-body';
  zone.append(header, body);
  return { zone, header, body, btn };
}

function applyCollapse(el, zone){
  if (isCollapsed(zone)) {
    el.style.display = 'none';
  }
}
function toggleCollapse(el, zone){
  const collapsed = el.style.display === 'none';
  el.style.display = collapsed ? '' : 'none';
  setCollapsed(zone, !collapsed);
}
