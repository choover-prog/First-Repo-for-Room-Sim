// Zero-dep CSV parser with header support and quoted-field handling.
export function parseCSV(text) {
  // returns { headers: string[], rows: object[] }
  // Requirements:
  // - Accept CRLF/CR/LF newlines
  // - Fields may be quoted; quotes escaped as "" inside quoted fields
  // - Commas inside quotes are part of the field
  // - First row is header
  const lines = [];
  let i=0, cur="", inQ=false;
  function pushLine(){ lines.push(cur); cur=""; }
  while (i < text.length) {
    const ch = text[i];
    if (ch === '"') {
      if (inQ && text[i+1] === '"') { cur += '"'; i+=2; continue; }
      inQ = !inQ; i++; continue;
    }
    if (!inQ && (ch === '\n' || ch === '\r')) {
      // consume \r\n pairs
      if (ch === '\r' && text[i+1] === '\n') i++;
      pushLine(); i++; continue;
    }
    cur += ch; i++;
  }
  // last line
  if (cur.length || text.endsWith('\n') || text.endsWith('\r')) pushLine();

  // split fields on commas respecting quotes already handled above by line builder
  function splitCSVLine(line) {
    const out=[]; let field=""; let j=0, q=false;
    while (j <= line.length) {
      const c = line[j];
      if (c === '"' ) { q=!q; j++; continue; }
      if (c === ',' && !q) { out.push(field); field=""; j++; continue; }
      if (c === undefined) { out.push(field); break; }
      field += c; j++;
    }
    return out.map(s => s.trim());
  }

  if (lines.length === 0) return { headers:[], rows:[] };
  const headerFields = splitCSVLine(lines[0]).map(h => h.replace(/^\uFEFF/, '')); // strip BOM
  const rows = [];
  for (let k = 1; k < lines.length; k++) {
    const line = lines[k];
    if (!line.trim()) continue;
    if (line.replace(/,/g, '').trim() === '') continue;
    const fields = splitCSVLine(line);
    const obj = {};
    for (let c = 0; c < headerFields.length; c++) obj[headerFields[c]] = fields[c] ?? "";
    rows.push(obj);
  }
  return { headers: headerFields, rows };
}
