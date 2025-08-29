import { describe, it, expect } from 'vitest';
import { parseCSV } from '../../src/lib/csv-lite.js';

describe('csv-lite parser', () => {
  it('parses simple csv', () => {
    const text = 'a,b\n1,2\n3,4';
    const { headers, rows } = parseCSV(text);
    expect(headers).toEqual(['a', 'b']);
    expect(rows).toEqual([{ a: '1', b: '2' }, { a: '3', b: '4' }]);
  });

  it('handles quoted comma', () => {
    const text = 'a\n"Q, value"';
    const { rows } = parseCSV(text);
    expect(rows[0].a).toBe('Q, value');
  });

  it('handles escaped quotes', () => {
    const text = 'a\n"He said ""hi"""';
    const { rows } = parseCSV(text);
    expect(rows[0].a).toBe('He said "hi"');
  });

  it('supports CRLF', () => {
    const text = 'a,b\r\n1,2\r\n';
    const { headers, rows } = parseCSV(text);
    expect(headers).toEqual(['a', 'b']);
    expect(rows.length).toBe(1);
  });

  it('ignores empty trailing line', () => {
    const text = 'a\n1\n\n';
    const { rows } = parseCSV(text);
    expect(rows.length).toBe(1);
  });

  it('ignores lines with only commas', () => {
    const text = 'a,b\n1,2\n,\n3,4';
    const { rows } = parseCSV(text);
    expect(rows).toEqual([
      { a: '1', b: '2' },
      { a: '3', b: '4' }
    ]);
  });

  it('handles BOM, CRLF, quoted commas, and escaped quotes', () => {
    const text = '\uFEFFname,quote\r\n"Doe, John","He said ""hello"""\r\n';
    const { headers, rows } = parseCSV(text);
    expect(headers).toEqual(['name', 'quote']);
    expect(rows[0]).toEqual({ name: 'Doe, John', quote: 'He said "hello"' });
  });
});
