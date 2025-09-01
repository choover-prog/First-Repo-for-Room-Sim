import * as THREE from 'three';

interface RoomPreset { id: string; dimensions: { x: number; y: number; z: number }; }

export class RoomFactory {
  private scene: THREE.Scene;
  private manifest: RoomPreset[] | null = null;
  private group: THREE.Group | null = null;
  private normals: THREE.Object3D[] = [];
  private showNormalsFlag = false;
  private currentId: string | null = null;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  private async loadManifest(): Promise<RoomPreset[]> {
    if (this.manifest) return this.manifest;
    const res = await fetch('/presets/rooms.json');
    this.manifest = await res.json();
    return this.manifest;
  }

  async buildRoomFromPreset(id: string) {
    const list = await this.loadManifest();
    const preset = list.find(p => p.id === id);
    if (!preset) {
      console.warn('Unknown room preset', id);
      return null;
    }
    this.currentId = id;
    const { x: width, y: length, z: height } = preset.dimensions;

    if (this.group) {
      this.scene.remove(this.group);
      this.group.children.forEach(c => {
        if ((c as any).geometry) (c as any).geometry.dispose();
        if ((c as any).material) (c as any).material.dispose();
      });
    }
    this.group = new THREE.Group();
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x888888, side: THREE.DoubleSide });
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x999999, side: THREE.DoubleSide });

    // floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(width, length), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.userData.tag = 'floor';
    this.group.add(floor);

    // ceiling
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(width, length), wallMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = height;
    ceiling.userData.tag = 'ceiling';
    this.group.add(ceiling);

    // walls
    const north = new THREE.Mesh(new THREE.PlaneGeometry(width, height), wallMat);
    north.position.z = -length / 2;
    north.rotation.y = Math.PI;
    north.userData.tag = 'wall_north';
    this.group.add(north);

    const south = new THREE.Mesh(new THREE.PlaneGeometry(width, height), wallMat);
    south.position.z = length / 2;
    south.userData.tag = 'wall_south';
    this.group.add(south);

    const east = new THREE.Mesh(new THREE.PlaneGeometry(length, height), wallMat);
    east.position.x = width / 2;
    east.rotation.y = -Math.PI / 2;
    east.userData.tag = 'wall_east';
    this.group.add(east);

    const west = new THREE.Mesh(new THREE.PlaneGeometry(length, height), wallMat);
    west.position.x = -width / 2;
    west.rotation.y = Math.PI / 2;
    west.userData.tag = 'wall_west';
    this.group.add(west);

    this.scene.add(this.group);
    this.applyNormals();
    window.dispatchEvent(new Event('sceneChanged'));
    return preset.dimensions;
  }

  showNormals(flag: boolean) {
    this.showNormalsFlag = flag;
    this.applyNormals();
  }

  private applyNormals() {
    this.normals.forEach(n => this.group?.remove(n));
    this.normals = [];
    if (!this.showNormalsFlag || !this.group) return;
    const len = 0.5;
    this.group.children.forEach(obj => {
      const mesh = obj as THREE.Mesh;
      const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(mesh.quaternion);
      const origin = mesh.position.clone();
      const arrow = new THREE.ArrowHelper(normal, origin, len, 0xff0000);
      this.group!.add(arrow);
      this.normals.push(arrow);
    });
  }

  getCurrentPresetId() {
    return this.currentId;
  }
}
