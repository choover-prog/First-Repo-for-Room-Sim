import * as THREE from 'three';
import type { Vec3 } from '../../types/room';

export type MlpMesh = THREE.Object3D & { setSelected: (sel: boolean) => void };

// Create a simple marker for the main listening position (MLP).
// A small sphere floats slightly above a floor ring so it stands out
// against the grid and model geometry.
export function createMlpMesh(pos: Vec3): MlpMesh {
  const group = new THREE.Group() as MlpMesh;

  // floor ring
  const ringGeo = new THREE.RingGeometry(0.18, 0.22, 32);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xff4080,
    side: THREE.DoubleSide,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2; // lie flat on the floor
  group.add(ring);

  // floating sphere
  const sphereGeo = new THREE.SphereGeometry(0.15, 16, 16);
  const sphereMat = new THREE.MeshStandardMaterial({ color: 0xff4080 });
  const sphere = new THREE.Mesh(sphereGeo, sphereMat);
  sphere.position.y = 0.15; // raise above floor
  group.add(sphere);

  group.position.set(pos.x, pos.y, pos.z);
  group.setSelected = (sel: boolean) => {
    const color = sel ? 0xffff00 : 0xff4080;
    sphereMat.color.set(color);
    ringMat.color.set(color);
  };
  return group;
}
