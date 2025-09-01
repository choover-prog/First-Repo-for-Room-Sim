import * as THREE from 'three';

export class SceneHost {
  scene: THREE.Scene;
  roomGroup: THREE.Group;
  objectGroup: THREE.Group;
  overlayGroup: THREE.Group;

  constructor() {
    this.scene = new THREE.Scene();
    this.roomGroup = new THREE.Group();
    this.objectGroup = new THREE.Group();
    this.overlayGroup = new THREE.Group();
    this.scene.add(this.roomGroup, this.objectGroup, this.overlayGroup);
  }
}
