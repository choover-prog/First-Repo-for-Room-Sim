import * as THREE from 'three';
import type { Vec3 } from '../../types/room';

export function createMlpMesh(pos: Vec3): THREE.Mesh {
  const geom = new THREE.SphereGeometry(0.15, 16, 16);
  const mat = new THREE.MeshStandardMaterial({ color: 0x0080ff });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.set(pos.x, pos.y, pos.z);
  return mesh;
}
