import * as THREE from 'three';

export let currentRoomGroup: THREE.Group | null = null;
export let roomSessionId = 0;

export function attachRoom(scene: THREE.Scene, next: THREE.Group){
  // dispose previous geometry/materials and remove from scene
  if(currentRoomGroup){
    currentRoomGroup.traverse((o:any) => {
      if(o.geometry?.dispose) o.geometry.dispose();
      if(o.material?.dispose) o.material.dispose();
    });
    scene.remove(currentRoomGroup);
  }
  currentRoomGroup = next;
  scene.add(next);
  roomSessionId++;
  return roomSessionId;
}
