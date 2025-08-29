//------------------------------------------------------------
// Pane mounting helpers (no framework dependency)
export const PANE_IDS = {
  top: 'paneTop',
  left: 'paneLeft',
  right: 'paneRight',
  bottom: 'paneBottom',
  center: 'view'
};

export function ensurePane(id: string) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('div');
    el.id = id;
    el.dataset.pane = id;
    document.body.appendChild(el);
  }
  return el;
}

export function mountInto(paneId: string, child: HTMLElement, beforeSelector?: string) {
  const pane = ensurePane(paneId);
  if (beforeSelector) {
    const anchor = pane.querySelector(beforeSelector);
    if (anchor?.parentElement) {
      anchor.parentElement.insertBefore(child, anchor);
      return child;
    }
  }
  pane.appendChild(child);
  return child;
}

export function clearChildren(node: HTMLElement) {
  while (node.firstChild) node.removeChild(node.firstChild);
}
