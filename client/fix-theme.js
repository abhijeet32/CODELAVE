/* eslint-disable */
const fs = require('fs');

let css = fs.readFileSync('app/globals.css', 'utf8');

const replacements = [
  { search: /#070707/g, replace: 'var(--dash-bg)' },
  { search: /#0F0F0F/g, replace: 'var(--dash-surface)' },
  { search: /#F2F2F2/g, replace: 'var(--dash-text)' },
  { search: /#969696/g, replace: 'var(--dash-muted)' },
  { search: /rgba\(255,\s*255,\s*255,\s*0\.1\)/g, replace: 'var(--dash-border)' },
  { search: /rgba\(255,\s*255,\s*255,\s*0\.2\)/g, replace: 'var(--dash-border-hover)' },
  { search: /rgba\(255,\s*255,\s*255,\s*0\.04\)/g, replace: 'var(--dash-hover)' },
  { search: /rgba\(255,\s*255,\s*255,\s*0\.05\)/g, replace: 'var(--dash-hover)' },
  { search: /rgba\(255,\s*255,\s*255,\s*0\.01\)/g, replace: 'var(--dash-hover)' }
];

// Apply replacements ONLY after line 175
const lines = css.split('\n');
const prefix = lines.slice(0, 175).join('\n');
let suffix = lines.slice(175).join('\n');

replacements.forEach(r => {
  suffix = suffix.replace(r.search, r.replace);
});

css = prefix + '\n' + suffix;

// Add variables to :root and .dark
const rootVars = `
  --dash-bg: #f4f4f5;
  --dash-surface: #ffffff;
  --dash-text: #18181b;
  --dash-muted: #71717a;
  --dash-border: rgba(0, 0, 0, 0.1);
  --dash-border-hover: rgba(0, 0, 0, 0.2);
  --dash-hover: rgba(0, 0, 0, 0.05);
`;

const darkVars = `
  --dash-bg: #070707;
  --dash-surface: #0F0F0F;
  --dash-text: #F2F2F2;
  --dash-muted: #969696;
  --dash-border: rgba(255, 255, 255, 0.1);
  --dash-border-hover: rgba(255, 255, 255, 0.2);
  --dash-hover: rgba(255, 255, 255, 0.04);
`;

css = css.replace(':root {', ':root {' + rootVars);
css = css.replace('.dark {', '.dark {' + darkVars);

fs.writeFileSync('app/globals.css', css);
console.log('Done!');
