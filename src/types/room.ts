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
  selectedId: string | null;
}
