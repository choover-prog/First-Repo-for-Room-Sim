import { ROOM_CHANGED } from '../state/room.slice';

// Listen for room changes and recompute reflections once per change
export function initReflectionsAgent(ctx: { bus: any; recomputeReflections: (id: string) => void; reflectionsCache?: Map<any, any> }) {
  let timer: any;
  ctx.bus.on(ROOM_CHANGED, (payload: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      ctx.reflectionsCache?.clear?.();
      ctx.recomputeReflections(payload.presetId);
    }, 150);
  });
}
