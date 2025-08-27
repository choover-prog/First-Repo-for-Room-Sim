export function mountViewerHost(target, element) {
  if (!target || !element) return;
  if (element.parentNode !== target) {
    target.appendChild(element);
  }
  return element;
}
