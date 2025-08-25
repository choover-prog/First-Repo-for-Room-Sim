export function badge(label, color, title = '') {
  const span = document.createElement('span');
  span.textContent = label;
  span.title = title;
  span.style.cssText = 'display:inline-block;padding:2px 6px;border-radius:999px;font-size:12px;font-weight:600;background:' + color + ';color:#0b0d10';
  return span;
}
