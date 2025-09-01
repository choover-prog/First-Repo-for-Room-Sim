import { Group, Material } from 'three';
import { getOverlays, subscribe } from '../../state/overlays.slice';

export function initCeilingVisibility(roomGroup: Group){
  const mats: Material[] = [];
  roomGroup.traverse(obj => {
    if ((obj as any).userData?.tag === 'ceiling' && (obj as any).material){
      const m = (obj as any).material as Material;
      m.transparent = true;
      mats.push(m);
    }
  });
  function apply(opacity: number){
    const o = Math.min(1, Math.max(0.15, opacity));
    mats.forEach(m => { (m as any).opacity = o; });
  }
  apply(getOverlays().ceilingOpacity);
  subscribe(s => apply(s.ceilingOpacity));
}
