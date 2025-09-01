import * as THREE from 'three';
import { LAYERS } from './scene.layers';
import { fitCameraToBox } from './camera.fit';
import { toast } from './toast';
import { assert } from './assert';
import { roomStore } from '../state/room.slice';

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
  // remove previous room if any
  const old = ctx.scene.getObjectByName('RoomGroup');
  if(old) ctx.scene.remove(old);

  const group = new THREE.Group();
  group.name = 'RoomGroup';
  group.matrixAutoUpdate = false;
  group.layers.set(LAYERS.DEFAULT);

  const mat = new THREE.MeshStandardMaterial({ color:0xdddddd, side:THREE.DoubleSide });

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), mat.clone());
  floor.rotation.x = -Math.PI/2;
  floor.receiveShadow = true; floor.castShadow = false;
  floor.userData.surfaceType = 'floor';
  group.add(floor);

  const ceiling = floor.clone();
  ceiling.rotation.x = Math.PI/2;
  ceiling.position.z = height;
  ceiling.userData.surfaceType = 'ceiling';
  group.add(ceiling);

  const wallGeoX = new THREE.PlaneGeometry(depth, height);
  const wallGeoY = new THREE.PlaneGeometry(width, height);

  const walls: Array<[string, number, number, number, number]> = [
    ['wall_north', 0, depth/2, Math.PI, 0],
    ['wall_south', 0, -depth/2, 0, 0],
    ['wall_east', width/2, 0, -Math.PI/2, 1],
    ['wall_west', -width/2, 0, Math.PI/2, 1]
  ];

  walls.forEach(([name, x, y, ry, axis])=>{
    const geo = axis ? wallGeoX : wallGeoY;
    const mesh = new THREE.Mesh(geo, mat.clone());
    mesh.position.set(x, y, height/2);
    mesh.rotation.y = ry;
    mesh.receiveShadow = true; mesh.castShadow = false;
    mesh.userData.surfaceType = name;
    group.add(mesh);
  });

  ctx.scene.add(group);
  const box = new THREE.Box3().setFromObject(group);
  fitCameraToBox(ctx.camera, ctx.controls, box);

  roomStore.getState().setRoom(presetId, { x: width, y: depth, z: height });
  toast.info(`Loaded preset: ${presetId} (${width.toFixed(1)} × ${depth.toFixed(1)} × ${height.toFixed(1)} m)`);
  console.groupCollapsed('RoomFactory');
  console.table({ width, depth, height });
  console.groupEnd();
}
