import { describe, it, expect } from 'vitest';
import { Object3D, Vector3 } from 'three';
import { clampEntityPosition } from '../../src/core/constraints';

describe('constraints', () => {
  it('clamps within bounds', () => {
    const obj = new Object3D();
    obj.position.set(100, 100, -1);
    const room = { min: new Vector3(0,0,0), max: new Vector3(10,10,3) };
    clampEntityPosition(obj, room);
    expect(obj.position.z).toBeGreaterThanOrEqual(0.2);
  });
});
