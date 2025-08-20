(()=>{const mToFt=3.28084;const c=document.getElementById('view');const r=new THREE.WebGLRenderer({antialias:true});r.setPixelRatio(devicePixelRatio);r.setSize(c.clientWidth,c.clientHeight);c.appendChild(r.domElement);
const s=new THREE.Scene();s.background=new THREE.Color(0x0b0d10);const cam=new THREE.PerspectiveCamera(60,c.clientWidth/c.clientHeight,.05,5000);cam.position.set(4,2,6);const ctl=new THREE.OrbitControls(cam,r.domElement);ctl.enableDamping=true;
const hemi=new THREE.HemisphereLight(0xffffff,0x223344,.8);s.add(hemi);const dir=new THREE.DirectionalLight(0xffffff,.6);dir.position.set(6,8,5);s.add(dir);
const grid=new THREE.GridHelper(20,20,0x335577,0x223344);grid.material.opacity=.25;grid.material.transparent=true;s.add(grid);const axes=new THREE.AxesHelper(2);s.add(axes);
document.getElementById('gridT').onchange=e=>grid.visible=e.target.checked;document.getElementById('axesT').onchange=e=>axes.visible=e.target.checked;
const stats=document.getElementById('stats');const L=new THREE.GLTFLoader();let root=null;function frame(o){const b=new THREE.Box3().setFromObject(o),sz=new THREE.Vector3(),ct=new THREE.Vector3();b.getSize(sz);b.getCenter(ct);
const fov=cam.fov*(Math.PI/180);let cz=Math.abs(Math.max(sz.x,sz.y,sz.z)/(2*Math.tan(fov/2)));cz*=1.6;cam.position.set(ct.x+cz*.6,ct.y+cz*.4,ct.z+cz);cam.near=Math.max(.01,Math.min(sz.x,sz.y,sz.z)/100);cam.far=Math.max(sz.x,sz.y,sz.z)*100;cam.updateProjectionMatrix();ctl.target.copy(ct);ctl.update();grid.position.y=b.min.y;
stats.textContent=`Size: ${sz.x.toFixed(2)}×${sz.y.toFixed(2)}×${sz.z.toFixed(2)} m | ${(sz.x*mToFt).toFixed(1)}×${(sz.y*mToFt).toFixed(1)}×${(sz.z*mToFt).toFixed(1)} ft`; }
function loadBuf(buf){L.parse(buf,'',(g)=>{if(root)s.remove(root);root=g.scene;s.add(root);frame(root);},e=>alert('GLB parse failed'));}
document.getElementById('file').addEventListener('change',e=>{const f=e.target.files[0];if(f)f.arrayBuffer().then(loadBuf);});
document.getElementById('loadSample').addEventListener('click',()=>{fetch('../examples/sample-room.glb').then(r=>r.arrayBuffer()).then(loadBuf).catch(()=>alert('Sample missing'));});
c.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='copy';});c.addEventListener('drop',e=>{e.preventDefault();const f=e.dataTransfer.files&&e.dataTransfer.files[0];if(f)f.arrayBuffer().then(loadBuf);});
window.addEventListener('resize',()=>{r.setSize(c.clientWidth,c.clientHeight);cam.aspect=c.clientWidth/c.clientHeight;cam.updateProjectionMatrix();});(function loop(){requestAnimationFrame(loop);ctl.update();r.render(s,cam);})();
})();