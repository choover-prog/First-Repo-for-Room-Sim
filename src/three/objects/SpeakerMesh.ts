import * as THREE from 'three';
import type { Speaker } from '../../types/room';

export type SpeakerMesh = THREE.Mesh & { setSelected: (selected: boolean) => void };

export function createSpeakerMesh(data: Speaker): SpeakerMesh {
  const geom = new THREE.BoxGeometry(0.3, 0.3, 0.3);
  const mat = new THREE.MeshStandardMaterial({ color: 0x555555 });
  const mesh = new THREE.Mesh(geom, mat) as SpeakerMesh;
  mesh.position.set(data.pos.x, data.pos.y, data.pos.z);
  mesh.rotation.y = data.rotY;

  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geom),
    new THREE.LineBasicMaterial({ color: 0xffff00 })
  );
  edges.visible = false;
  mesh.add(edges);

  mesh.setSelected = (selected: boolean) => {
    edges.visible = selected;
  };

  return mesh;
}
