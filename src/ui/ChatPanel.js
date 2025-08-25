import { askAgent } from '../ai/Agent.js';

export function mountChatPanel({ rootEl, onApplyAction }) {
  const panel = document.createElement('div');
  panel.id = 'chatPanel';
  panel.innerHTML = `
    <div class="chat-header">Calibration Coach</div>
    <div class="chat-msgs"></div>
    <div class="chat-quick">
      <button data-msg="Time align subs">Time-align subs</button>
      <button data-msg="Suggest crossover">Suggest XO</button>
      <button data-msg="Generate PEQ">Generate PEQ</button>
      <button data-msg="Export filters">Export Filters</button>
      <button data-msg="Show checklist">Show Checklist</button>
    </div>
    <div class="chat-attach"><input id="chatFiles" type="file" multiple accept=".csv,.txt,.json"/></div>
    <div class="chat-input">
      <input type="text" id="chatText" placeholder="Ask the coach..."/>
      <button id="chatSend">Send</button>
    </div>
    <label class="chat-cloud"><input type="checkbox" id="askCloudAI"/> Ask Cloud AI</label>
  `;
  rootEl.appendChild(panel);

  const msgsEl = panel.querySelector('.chat-msgs');
  const inputEl = panel.querySelector('#chatText');
  const sendBtn = panel.querySelector('#chatSend');
  const fileEl = panel.querySelector('#chatFiles');
  const cloudChk = panel.querySelector('#askCloudAI');

  const messages = [];

  function appendMessage(role, text) {
    const m = document.createElement('div');
    m.className = `msg ${role}`;
    m.innerHTML = `<span>${text}</span>`;
    msgsEl.appendChild(m);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  async function handleSend(text) {
    const files = fileEl.files;
    if (text) {
      const userMsg = { role: 'user', content: text };
      messages.push(userMsg);
      appendMessage('user', text);
    }

    try {
      const res = await askAgent({ messages, files, useCloud: cloudChk.checked });
      if (res && Array.isArray(res.messages)) {
        res.messages.forEach(m => {
          messages.push(m);
          appendMessage(m.role, m.content);
        });
      }
      if (res && Array.isArray(res.suggestedActions) && onApplyAction) {
        const acts = document.createElement('div');
        acts.className = 'chat-actions';
        res.suggestedActions.forEach(action => {
          const b = document.createElement('button');
          b.textContent = action.label || 'Apply';
          b.onclick = () => {
            onApplyAction(action);
            const undo = document.createElement('button');
            undo.textContent = 'Undo';
            undo.onclick = () => onApplyAction({ type: 'undo' });
            acts.appendChild(undo);
            b.disabled = true;
          };
          acts.appendChild(b);
        });
        msgsEl.appendChild(acts);
        msgsEl.scrollTop = msgsEl.scrollHeight;
      }
    } catch (err) {
      appendMessage('assistant', 'Error: ' + err.message);
    }
    inputEl.value = '';
    fileEl.value = '';
  }

  sendBtn.onclick = () => handleSend(inputEl.value.trim());
  inputEl.onkeydown = e => { if (e.key === 'Enter') handleSend(inputEl.value.trim()); };

  panel.querySelectorAll('.chat-quick button').forEach(b => {
    b.onclick = () => handleSend(b.dataset.msg);
  });

  const style = document.createElement('style');
  style.textContent = `
    #chatPanel { position:fixed; top:0; right:0; width:320px; height:100%; background:#1b1f27; border-left:1px solid #232832; transform:translateX(100%); transition:transform .3s; display:flex; flex-direction:column; z-index:1000; }
    #chatPanel.open { transform:translateX(0); }
    #chatPanel .chat-header { padding:8px; border-bottom:1px solid #232832; font-weight:bold; }
    #chatPanel .chat-msgs { flex:1; padding:8px; overflow:auto; }
    #chatPanel .msg { margin:4px 0; }
    #chatPanel .msg span { display:inline-block; padding:6px 8px; border-radius:6px; background:#2a2f3a; }
    #chatPanel .msg.user { text-align:right; }
    #chatPanel .msg.user span { background:#2a6bf2; }
    #chatPanel .chat-input { display:flex; gap:4px; padding:8px; }
    #chatPanel .chat-quick { display:flex; flex-wrap:wrap; gap:4px; padding:4px; border-bottom:1px solid #232832; }
    #chatPanel .chat-attach { padding:4px; border-bottom:1px solid #232832; }
    #chatPanel .chat-actions { padding:4px; display:flex; gap:4px; flex-wrap:wrap; }
    #chatPanel .chat-cloud { font-size:12px; padding:4px; border-top:1px solid #232832; }
  `;
  document.head.appendChild(style);

  return {
    toggle() { panel.classList.toggle('open'); }
  };
}
