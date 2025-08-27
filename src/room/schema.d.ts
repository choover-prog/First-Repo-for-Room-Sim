export type Vec3 = [number, number, number];
export interface RoomDims { L:number; W:number; H:number; origin:Vec3; up:'Y'; scale_m:number; }
export type ObjType = 'speaker'|'sub';
export type Role =
  | 'L'|'R'|'C'|'SL'|'SR'|'SBL'|'SBR'|'TFL'|'TFR'|'TRL'|'TRR'
  | 'SUB1'|'SUB2'|'SUB3'|'SUB4';
export interface RoomObj {
  id:string; type:ObjType; role:Role; model_id?:string;
  transform:{ pos:Vec3; rot_euler:Vec3; scale:[number,number,number]; };
  size_m?:[number,number,number]; source?:string; user_verified?:boolean; confidence?:number;
}
export interface MLP { pos:Vec3; yaw:number; }
export interface RoomJSON { room:RoomDims; objects:RoomObj[]; mlp:MLP; meta:{ pipeline:string; ts:number; }; }
