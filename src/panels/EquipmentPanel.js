import { getPersona } from '../lib/persona.js';
import { badge } from '../ui/Badges.js';

export function mountEquipmentPanel(root) {
  const heading = root.querySelector('h2') || root.appendChild(document.createElement('h2'));
  const personaId = getPersona();
  const personaColor = { casual:'#74c0fc', diy:'#b197fc', pro:'#ffd43b', reviewer:'#63e6be' }[personaId] || '#adb5bd';
  heading.appendChild(badge(personaId.toUpperCase(), personaColor, 'Current persona'));
}
