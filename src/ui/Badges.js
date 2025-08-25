export function badge(label, color, title='') {
  const span = document.createElement('span');
  span.textContent = label;
  span.style.cssText = 'display:inline-block;padding:2px 8px;border-radius:999px;margin-right:6px;font-weight:600;color:#0b0d10;background:'+color;
  if (title) span.title = title;
  return span;
}
