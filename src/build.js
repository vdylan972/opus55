// Construit le HTML autonome : images et polices intégrées en base64.
const fs = require('fs'), path = require('path');
const A = path.join(__dirname, 'assets');
let html = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
html = html.replace(/\{\{FONT_(\d+)\}\}/g, (_, w) =>
  'data:font/ttf;base64,' + fs.readFileSync(path.join(A, `outfit-${w}.ttf`)).toString('base64'));
html = html.replace(/\{\{([a-z-]+)\}\}/g, (_, n) =>
  'data:image/png;base64,' + fs.readFileSync(path.join(A, `${n}.png`)).toString('base64'));
const out = path.join(__dirname, '..', 'hub-beelix-video.html');
fs.writeFileSync(out, html);
console.log('OK', out, (html.length / 1024).toFixed(0) + ' Ko');
