import * as THREE from 'three';
import { projectStore } from '../state/projectStore';
import { createSpeakerMesh, SpeakerMesh } from '../three/objects/SpeakerMesh';

export class SceneGraph {
  private scene: THREE.Scene;
  private meshes = new Map<string, SpeakerMesh>();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    projectStore.subscribe(() => this.sync());
    this.sync();
  }

  private sync() {
    const { project } = projectStore.getState();
    const ids = new Set(project.speakers.map((s) => s.id));

    // remove missing
    for (const [id, mesh] of this.meshes) {
      if (!ids.has(id)) {
        this.scene.remove(mesh);
        this.meshes.delete(id);
      }
    }

    // add/update
    for (const sp of project.speakers) {
      let mesh = this.meshes.get(sp.id);
      if (!mesh) {
        mesh = createSpeakerMesh(sp);
        this.meshes.set(sp.id, mesh);
        this.scene.add(mesh);
      } else {
        mesh.position.set(sp.pos.x, sp.pos.y, sp.pos.z);
        mesh.rotation.y = sp.rotY;
      }
      mesh.setSelected(sp.id === project.selectedId);
    }
  }
}
