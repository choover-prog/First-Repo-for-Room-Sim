import { describe, it, expect } from 'vitest';
import { firstOrder } from '../../src/acoustics/ism.js';

describe('firstOrder reflections', () => {
  it('returns empty when speakers missing', () => {
    const res = firstOrder({ room: { L:5, W:4, H:3 }, speakers: [], mlp: { x:0, y:1, z:0 } });
    expect(res).toEqual([]);
  });

  it('computes hits for simple case', () => {
    const room = { L:5, W:4, H:3 };
    const speakers = [{ id:'s1', pos:{ x:1, y:1, z:1 } }];
    const mlp = { x:2, y:1, z:2 };
    const res = firstOrder({ room, speakers, mlp });
    expect(res.length).toBeGreaterThan(0);
    expect(res[0]).toHaveProperty('surface');
  });
});
