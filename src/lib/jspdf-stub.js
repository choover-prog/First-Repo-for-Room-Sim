export default class jsPDF {
  constructor(){ this.lines=[]; this.image=null; }
  addImage(img,type,x,y,w,h){ this.image=img; }
  text(lines,x,y){ this.lines = Array.isArray(lines)?lines:[lines]; }
  save(name){
    const content = this.lines.join('\n');
    const blob = new Blob([content], {type:'application/pdf'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name; a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
}
