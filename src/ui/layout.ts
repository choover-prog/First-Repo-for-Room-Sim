//----------------------------------------------
// Layout sizing helpers

export type PaneSizes = {
  topH: number;
  bottomH: number;
  leftW: number;
  rightW: number;
};

const LSK = 'layout.v1';
export const DEFAULTS: PaneSizes = { topH: 60, bottomH: 110, leftW: 260, rightW: 300 };

export function readSizes(): PaneSizes {
  try {
    return { ...DEFAULTS, ...(JSON.parse(localStorage.getItem(LSK) || '{}')) };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveSizes(s: PaneSizes) {
  localStorage.setItem(LSK, JSON.stringify(s));
}

export function applySizes(s: PaneSizes) {
  const root = document.documentElement;
  root.style.setProperty('--topPaneHeight', `${s.topH}px`);
  root.style.setProperty('--bottomPaneHeight', `${s.bottomH}px`);
  root.style.setProperty('--leftPaneWidth', `${s.leftW}px`);
  root.style.setProperty('--rightPaneWidth', `${s.rightW}px`);
}

export function resetSizes() {
  saveSizes(DEFAULTS);
  applySizes(DEFAULTS);
}
