import { makeButton, makeDropdown, mountSection, initPane } from '../controls.js';

export function mount(el) {
  if (!el) return;
  const content = initPane(el, 'right');
  const sec = mountSection();
  sec.append(
    makeDropdown('selSpeakerModel', ['Speaker A', 'Speaker B']),
    makeDropdown('selAmpModel', ['Amp A', 'Amp B']),
    makeButton('btnAddToCart', 'Add to Cart'),
    makeButton('btnCart', 'Cart')
  );
  const badges = document.createElement('div');
  badges.className = 'badges';
  ['Persona', 'Tier', 'Spinorama Verified'].forEach(t => {
    const s = document.createElement('span');
    s.className = 'badge';
    s.textContent = t;
    badges.appendChild(s);
  });
  sec.appendChild(badges);
  content.appendChild(sec);
}
