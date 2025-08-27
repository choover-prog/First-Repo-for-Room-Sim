export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Speaker {
  id: string;
  model: string;
  pos: Vec3;
  rotY: number;
}

export interface Project {
  speakers: Speaker[];
  mlp: Vec3 | null;
  selectedId: string | null;
}
