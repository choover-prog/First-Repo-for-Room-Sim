import * as THREE from 'three';
import { projectStore } from '../state/projectStore';
import { createSpeakerMesh, SpeakerMesh } from '../three/objects/SpeakerMesh';
import { createMlpMesh, MlpMesh } from '../three/objects/MlpMesh';

export class SceneGraph {
  private scene: THREE.Scene;
  private meshes = new Map<string, SpeakerMesh>();
  private mlp: MlpMesh | null = null;

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

    if (project.mlp) {
      if (!this.mlp) {
        this.mlp = createMlpMesh(project.mlp);
        this.scene.add(this.mlp);
      } else {
        this.mlp.position.set(project.mlp.x, project.mlp.y, project.mlp.z);
      }
      this.mlp.setSelected(project.selectedId === 'mlp');
    } else if (this.mlp) {
      this.scene.remove(this.mlp);
      this.mlp = null;
    }
  }
}
