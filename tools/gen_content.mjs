import fs from 'fs';
import path from 'path';

const [, , input] = process.argv;
if (!input) {
  console.error('Usage: node tools/gen_content.mjs <product.json>');
  process.exit(1);
}

const raw = fs.readFileSync(input, 'utf8');
const product = JSON.parse(raw);
const brand = product.brand || 'Brand';
const model = product.model || 'Model';
const category = product.category || '';

let title = '';
if (/sub/i.test(model) || /sub/i.test(category)) {
  title = `Top 5 budget subs – why ${brand} ${model} stands out`;
} else {
  title = `How to place surrounds with ${brand} ${model}`;
}

const body = `# ${title}\n\n` +
  `## Overview\n${brand} ${model} offers a solid starting point for enthusiasts.\n` +
  `## Tips\n- Describe placement.\n- Highlight strengths.\n`;

const outDir = path.join('content', 'drafts');
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, `${brand}_${model}.md`.replace(/\s+/g, '_'));
fs.writeFileSync(outFile, body);
console.log('Draft created at', outFile);
