export function ensureOnboarding(root=document.body) {
  const SEEN = 'app.onboarding.seen';
  if (localStorage.getItem(SEEN)==='1') return;
  const tip = document.createElement('div');
  tip.style.cssText = 'position:fixed;right:16px;bottom:16px;background:#11141a;color:#e8eaed;border:1px solid #232832;padding:12px;border-radius:12px;max-width:340px;z-index:9999';
  tip.innerHTML = `
    <b>Welcome!</b><br>
    • Load a GLB or click <em>Load Sample</em>.<br>
    • Orbit with mouse; use grid/axes toggles.<br>
    • Try LF Heatmap and Export buttons.<br>
    <div style="margin-top:8px;text-align:right">
      <button id="obGotIt">Got it</button>
    </div>`;
  root.appendChild(tip);
  tip.querySelector('#obGotIt').onclick = () => {
    localStorage.setItem(SEEN, '1');
    tip.remove();
  };
}
