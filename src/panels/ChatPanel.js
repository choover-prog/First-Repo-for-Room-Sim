import { getChat } from '../ai/bridge/index.js';

function el(html){
  const t=document.createElement('template');
  t.innerHTML=html.trim();
  return t.content.firstChild;
}

export function mountChatPanel(container){
  const chatFn = getChat();
  const root = el(`
    <div style="margin-top:12px">
      <h2 style="font-size:16px;margin:8px 0">Chat</h2>
      <div id="chatLog" style="font-size:12px;min-height:80px;border:1px solid #232832;padding:4px;margin-bottom:4px;"></div>
      <div class="row">
        <input id="chatInput" style="flex:1"/>
        <button id="chatSend">Send</button>
      </div>
    </div>
  `);
  container.appendChild(root);
  const log = root.querySelector('#chatLog');
  const inp = root.querySelector('#chatInput');
  root.querySelector('#chatSend').onclick = async ()=>{
    const msg = inp.value.trim();
    if(!msg) return;
    const messages=[{role:'user',content:msg}];
    log.innerHTML += `<div><b>You:</b> ${msg}</div>`;
    inp.value='';
    try{
      const res = await chatFn(messages);
      log.innerHTML += `<div><b>Bot:</b> ${res.content}</div>`;
    }catch(err){
      log.innerHTML += `<div class="muted">${err.message}</div>`;
    }
  };
}
