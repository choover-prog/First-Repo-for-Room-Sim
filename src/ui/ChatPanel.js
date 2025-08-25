import { askAI } from '../lib/ai_bridge.js';
import { getPersona } from '../lib/persona.js';

const LS_KEY = 'app.chatTranscript';

export function mountChatPanel() {
  const root = document.createElement('div');
  root.id = 'chatPanel';
  root.style = 'position:fixed;right:0;bottom:0;width:320px;height:400px;background:#11141a;border-left:1px solid #232832;border-top:1px solid #232832;display:none;flex-direction:column;z-index:1000';
  root.innerHTML = `
    <div id="chatMsgs" style="flex:1;overflow:auto;padding:8px;font-size:13px"></div>
    <div style="padding:4px;display:flex;gap:4px;flex-wrap:wrap;justify-content:center">
      <button class="qbtn" data-q="Placement tips">Placement tips</button>
      <button class="qbtn" data-q="Calibration help">Calibration help</button>
      <button class="qbtn" data-q="Checkout questions">Checkout questions</button>
    </div>
    <div style="display:flex;padding:8px;gap:4px;border-top:1px solid #232832">
      <input id="chatInput" style="flex:1"/>
      <button id="chatSend">Send</button>
    </div>
  `;
  document.body.appendChild(root);

  const msgs = root.querySelector('#chatMsgs');
  const input = root.querySelector('#chatInput');
  const sendBtn = root.querySelector('#chatSend');
  const qBtns = root.querySelectorAll('.qbtn');

  function saveTranscript() {
    localStorage.setItem(LS_KEY, JSON.stringify(transcript));
  }

  function addMessage(role, text) {
    transcript.push({ role, text });
    const div = document.createElement('div');
    div.textContent = (role === 'user' ? 'You: ' : 'AI: ') + text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    saveTranscript();
  }

  async function send(text) {
    if (!text) return;
    addMessage('user', text);
    input.value = '';
    const persona = getPersona();
    const reply = await askAI(persona, text);
    addMessage('bot', reply);
  }

  sendBtn.onclick = () => send(input.value.trim());
  input.onkeydown = e => { if (e.key === 'Enter') send(input.value.trim()); };
  qBtns.forEach(b => b.onclick = () => send(b.dataset.q));

  let transcript = [];
  try {
    const saved = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
    transcript = Array.isArray(saved) ? saved : [];
    transcript.forEach(m => addMessage(m.role, m.text));
  } catch { /* ignore */ }

  return {
    open() { root.style.display = 'flex'; },
    close() { root.style.display = 'none'; }
  };
}
