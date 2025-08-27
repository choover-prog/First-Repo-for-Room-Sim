import * as THREE from 'three';
import * as RoomState from '../room/RoomState.js';

function labelSprite(text){
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.font = '28px sans-serif';
  ctx.fillText(text, 10, 40);
  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
  const spr = new THREE.Sprite(mat);
  spr.scale.set(0.5, 0.125, 1);
  spr.position.set(0, 0.25, 0);
  return spr;
}

function makeMesh(obj){
  let geo, mat;
  if (obj.type === 'speaker') {
    geo = new THREE.BoxGeometry(0.3,0.3,0.3);
    mat = new THREE.MeshBasicMaterial({ color: 0x7f8c8d });
  } else if (obj.type === 'sub') {
    geo = new THREE.SphereGeometry(0.25,16,16);
    mat = new THREE.MeshBasicMaterial({ color: 0x2c3e50 });
  }
  const mesh = new THREE.Mesh(geo, mat);
  mesh.add(labelSprite(obj.role));
  return mesh;
}

function makeMLP(){
  const geo = new THREE.ConeGeometry(0.2,0.5,16);
  const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = Math.PI / 2;
  return mesh;
}

export function mountObjectGizmos(scene){
  const group = new THREE.Group();
  scene.add(group);
  const objs = new Map();
  let mlpMesh = null;

  function upsert(obj){
    let m = objs.get(obj.id);
    if (!m){
      m = makeMesh(obj);
      group.add(m);
      objs.set(obj.id, m);
    }
    const [x,y,z] = obj.transform.pos;
    m.position.set(x,y,z);
  }

  function refresh(){
    const { objects, mlp } = RoomState.getState();
    objects.forEach(upsert);
    if (mlp){
      if (!mlpMesh){ mlpMesh = makeMLP(); group.add(mlpMesh); }
      mlpMesh.position.set(...mlp.pos);
      mlpMesh.rotation.z = mlp.yaw;
    }
  }

  RoomState.subscribe(evt => {
    if (evt.type === 'room:object:add' || evt.type === 'room:object:update') {
      upsert(evt.payload.obj || RoomState.getState().objects.find(o=>o.id===evt.payload.id));
    } else if (evt.type === 'room:object:remove') {
      const mesh = objs.get(evt.payload.id);
      if (mesh){ group.remove(mesh); objs.delete(evt.payload.id); }
    } else if (evt.type === 'room:mlp' || evt.type === 'room:replace') {
      refresh();
    }
  });

  refresh();
}
