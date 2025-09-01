import * as THREE from 'three';
import { LAYERS } from './scene.layers';
import { fitCameraToBox } from './camera.fit';
import { toast } from './toast';
import { assert } from './assert';
import { roomStore } from '../state/room.slice';
import { attachRoom } from './room.session';

export async function buildRoomFromPreset(
  presetId: string,
  ctx: { scene: THREE.Scene; camera: THREE.PerspectiveCamera; controls: any }
){
  const manifestUrl = new URL(`${import.meta.env.BASE_URL || '/'}presets/rooms.json`, window.location.origin).toString();
  let manifest: Record<string, { size: [number, number, number] }> = {};
  try{
    const res = await fetch(manifestUrl);
    assert(res.ok, 'presets manifest fetch failed', { url: manifestUrl, status: res.status });
    manifest = await res.json();
  }catch(err:any){
    toast.error('Presets manifest failed', { url: manifestUrl, error: err?.message });
    return;
  }
  const def = manifest[presetId];
  if(!def){
    toast.error(`Preset not found: ${presetId}`);
    return;
  }

  const [width, depth, height] = def.size;
  const group = new THREE.Group();
  group.name = 'RoomGroup';
  group.matrixAutoUpdate = false;
  group.layers.set(LAYERS.DEFAULT);

  const mat = new THREE.MeshStandardMaterial({ color:0xdddddd, side:THREE.DoubleSide });

  // floor sits on XY plane with Z-up, no rotation needed
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), mat.clone());
  floor.receiveShadow = true; floor.castShadow = false;
  floor.userData.surfaceType = 'floor';
  group.add(floor);

  // ceiling mirrors the floor at +height, flip normal downward
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), mat.clone());
  ceiling.position.z = height;
  ceiling.rotation.x = Math.PI; // face toward interior
  ceiling.receiveShadow = true; ceiling.castShadow = false;
  ceiling.userData.surfaceType = 'ceiling';
  group.add(ceiling);

  // north/south walls (width × height planes, rotated around X)
  const wallNorth = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat.clone());
  wallNorth.position.set(0, depth/2, height/2);
  wallNorth.rotation.x = Math.PI/2;
  wallNorth.receiveShadow = true; wallNorth.castShadow = false;
  wallNorth.userData.surfaceType = 'wall_north';
  group.add(wallNorth);

  const wallSouth = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat.clone());
  wallSouth.position.set(0, -depth/2, height/2);
  wallSouth.rotation.x = -Math.PI/2;
  wallSouth.receiveShadow = true; wallSouth.castShadow = false;
  wallSouth.userData.surfaceType = 'wall_south';
  group.add(wallSouth);

  // east/west walls (depth × height planes, rotated around Y)
  const wallEast = new THREE.Mesh(new THREE.PlaneGeometry(height, depth), mat.clone());
  wallEast.position.set(width/2, 0, height/2);
  wallEast.rotation.y = -Math.PI/2;
  wallEast.receiveShadow = true; wallEast.castShadow = false;
  wallEast.userData.surfaceType = 'wall_east';
  group.add(wallEast);

  const wallWest = new THREE.Mesh(new THREE.PlaneGeometry(height, depth), mat.clone());
  wallWest.position.set(-width/2, 0, height/2);
  wallWest.rotation.y = Math.PI/2;
  wallWest.receiveShadow = true; wallWest.castShadow = false;
  wallWest.userData.surfaceType = 'wall_west';
  group.add(wallWest);

  attachRoom(ctx.scene, group);
  // ensure world matrices are up to date before fitting camera
  group.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(group);
  fitCameraToBox(ctx.camera, ctx.controls, box);

  roomStore.getState().setRoom(presetId, { x: width, y: depth, z: height });
  toast.info(`Loaded preset: ${presetId} (${width.toFixed(1)} × ${depth.toFixed(1)} × ${height.toFixed(1)} m)`);
  console.groupCollapsed('RoomFactory');
  console.table({ width, depth, height });
  console.groupEnd();
}
