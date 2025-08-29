export function firstOrder({ room, speakers = [], mlp }) {
  if (!room || !mlp || !speakers.length) return [];
  const { L, W, H } = room;
  const planes = [
    { surface: 'posX', point: [L, 0, 0], normal: [-1, 0, 0] },
    { surface: 'negX', point: [0, 0, 0], normal: [1, 0, 0] },
    { surface: 'posZ', point: [0, 0, W], normal: [0, 0, -1] },
    { surface: 'negZ', point: [0, 0, 0], normal: [0, 0, 1] },
    { surface: 'floor', point: [0, 0, 0], normal: [0, 1, 0] },
    { surface: 'ceiling', point: [0, H, 0], normal: [0, -1, 0] }
  ];

  const hits = [];

  const mirror = (p, plane) => {
    const diff = [p[0] - plane.point[0], p[1] - plane.point[1], p[2] - plane.point[2]];
    const dot = diff[0]*plane.normal[0] + diff[1]*plane.normal[1] + diff[2]*plane.normal[2];
    return [
      p[0] - 2*dot*plane.normal[0],
      p[1] - 2*dot*plane.normal[1],
      p[2] - 2*dot*plane.normal[2]
    ];
  };

  const intersect = (a, b, plane) => {
    const dir = [b[0]-a[0], b[1]-a[1], b[2]-a[2]];
    const denom = dir[0]*plane.normal[0] + dir[1]*plane.normal[1] + dir[2]*plane.normal[2];
    if (Math.abs(denom) < 1e-6) return null;
    const t = ((plane.point[0]-a[0])*plane.normal[0] + (plane.point[1]-a[1])*plane.normal[1] + (plane.point[2]-a[2])*plane.normal[2]) / denom;
    if (t < 0 || t > 1) return null;
    return [a[0]+dir[0]*t, a[1]+dir[1]*t, a[2]+dir[2]*t];
  };

  const inside = ([x,y,z]) => x>=0 && x<=L && y>=0 && y<=H && z>=0 && z<=W;

  const dist = (a,b) => Math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2);

  speakers.forEach(sp => {
    const s = [sp.pos.x, sp.pos.y, sp.pos.z];
    planes.forEach(pl => {
      const sm = mirror(s, pl);
      const hit = intersect(sm, [mlp.x, mlp.y, mlp.z], pl);
      if (!hit || !inside(hit)) return;
      const d = dist(s, hit) + dist(hit, [mlp.x, mlp.y, mlp.z]);
      const az = Math.atan2(hit[2]-s[2], hit[0]-s[0]) * 180/Math.PI;
      const el = Math.atan2(hit[1]-s[1], Math.hypot(hit[0]-s[0], hit[2]-s[2])) * 180/Math.PI;
      hits.push({
        surface: pl.surface,
        point: hit,
        distM: d,
        timeMs: d / 343 * 1000,
        speakerId: sp.id,
        incident: { azDeg: az, elDeg: el }
      });
    });
  });

  return hits;
}
