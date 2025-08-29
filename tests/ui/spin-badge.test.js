// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { mountEquipmentPanel } from '../../src/panels/EquipmentPanel.js';
import { setSpinForEquipment } from '../../src/lib/spin/store.js';

describe('spin badge ui', () => {
  it('shows badge when spin verified', async () => {
    global.fetch = vi.fn((url) => {
      if (url.endsWith('manifest.json')) {
        return Promise.resolve({ ok: true, json: async () => ({ speakers: ['sp1.json'], amps: ['amp1.json'] }) });
      }
      if (url.endsWith('speakers/sp1.json')) {
        return Promise.resolve({ ok: true, json: async () => ({ brand: 'B', model: 'M', sensitivity_db: 85, f_low_f3_hz: 40, spinorama: { freq_hz: [], on_axis_db: [] }, data_quality: { tier: 'C' } }) });
      }
      if (url.endsWith('amps/amp1.json')) {
        return Promise.resolve({ ok: true, json: async () => ({ brand: 'A', model: 'Amp', power_w_8ohm_all: 100 }) });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    document.body.innerHTML = '<div id="paneRight"></div>';
    setSpinForEquipment('sp1', { id: 's1', rows: [], confidence_0_1: 0.8, verified: true, source: 'unit' });
    mountEquipmentPanel();
    await Promise.resolve();
    await Promise.resolve();
    const spSel = document.getElementById('spSel');
    const ampSel = document.getElementById('ampSel');
    spSel.value = 'sp1.json';
    ampSel.value = 'amp1.json';
    spSel.dispatchEvent(new Event('change'));
    await new Promise((r) => setTimeout(r, 0));
    const badge = document.querySelector('.badge.spin-verified');
    expect(badge).toBeTruthy();
    expect(badge.getAttribute('title')).toContain('confidence: 0.80');
    expect(badge.getAttribute('title')).toContain('source: unit');
  });
});
