export function firstReflectionPoints({ roomBox, speakerPos = [], listenerPos = [] }) {
  const { L, W, H } = roomBox || {};
  if (![L, W, H].every(v => typeof v === 'number')) return { walls: [], ceiling: [], floor: [] };
  const results = { walls: [], ceiling: [], floor: [] };
  const planes = [
    { axis: 'x', at: 0, type: 'wall' },
    { axis: 'x', at: L, type: 'wall' },
    { axis: 'z', at: 0, type: 'wall' },
    { axis: 'z', at: W, type: 'wall' },
    { axis: 'y', at: 0, type: 'floor' },
    { axis: 'y', at: H, type: 'ceiling' }
  ];
  for (const s of speakerPos) {
    for (const l of listenerPos) {
      for (const p of planes) {
        const mirrored = { x: s.x, y: s.y, z: s.z };
        mirrored[p.axis] = p.at * 2 - s[p.axis];
        const dir = { x: mirrored.x - l.x, y: mirrored.y - l.y, z: mirrored.z - l.z };
        const denom = dir[p.axis];
        if (denom === 0) continue;
        const t = (p.at - l[p.axis]) / denom;
        if (t <= 0 || t >= 1) continue;
        const hit = {
          x: l.x + dir.x * t,
          y: l.y + dir.y * t,
          z: l.z + dir.z * t
        };
        if (hit.x < 0 || hit.x > L || hit.y < 0 || hit.y > H || hit.z < 0 || hit.z > W) continue;
        if (p.type === 'wall') results.walls.push(hit);
        else if (p.type === 'floor') results.floor.push(hit);
        else results.ceiling.push(hit);
      }
    }
  }
  return results;
}
