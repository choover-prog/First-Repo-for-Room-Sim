export async function readJSON(path: string){
  try{
    const r = await fetch(path);
    return await r.json();
  }catch{
    return null;
  }
}
export async function writeJSON(_path: string, _obj: any){
  /* browser dev fallback: no-op; logged in admin */
}
