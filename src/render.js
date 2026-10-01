// Enregistre l'animation image par image (timeline.seek) puis assemble le MP4 avec ffmpeg.
// Usage : node render.js [--from=0] [--to=32] [--only=t1,t2,...] [--out=frames_dir]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const args = Object.fromEntries(process.argv.slice(2).map(a => a.replace(/^--/, '').split('=')));
const FPS = 30;
const ROOT = path.join(__dirname, '..');
const HTML = path.join(ROOT, 'hub-beelix-video.html');
const GSAP = process.env.GSAP_PATH || require.resolve('gsap/dist/gsap.min.js');
const FRAMES = args.out || path.join(ROOT, '.frames');

(async () => {
  const browser = await chromium.launch({ args: ['--force-color-profile=srgb', '--hide-scrollbars'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  // GSAP est chargé depuis cdnjs dans le HTML ; on sert le même fichier en local pendant le rendu.
  await page.route(/cdnjs\.cloudflare\.com\/ajax\/libs\/gsap\//, r =>
    r.fulfill({ body: fs.readFileSync(GSAP, 'utf8'), contentType: 'application/javascript' }));
  page.on('pageerror', e => console.error('PAGE ERROR', e));
  await page.goto('file://' + HTML + '?render=1');
  await page.evaluate(() => window.__ready);
  const duration = await page.evaluate(() => window.__duration);
  fs.mkdirSync(FRAMES, { recursive: true });
  let times;
  if (args.only) times = args.only.split(',').map(Number);
  else {
    const from = Number(args.from || 0), to = Number(args.to || duration);
    times = []; for (let f = Math.round(from * FPS); f < Math.round(to * FPS); f++) times.push(f / FPS);
  }
  console.log('durée timeline', duration, 's —', times.length, 'images');
  const t0 = Date.now();
  for (const t of times) {
    await page.evaluate(t => window.__seek(t), t);
    const name = args.only ? `t_${t.toFixed(2)}.png` : `f_${String(Math.round(t * FPS)).padStart(5, '0')}.png`;
    await page.screenshot({ path: path.join(FRAMES, name) });
    const f = Math.round(t * FPS);
    if (!args.only && f % 60 === 0) console.log(`  ${t.toFixed(1)} s (${((Date.now() - t0) / 1000).toFixed(0)} s écoulées)`);
  }
  await browser.close();
  if (!args.only && !args.from && !args.to) {
    const out = path.join(ROOT, 'hub-beelix-video.mp4');
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(FRAMES, 'f_%05d.png'),
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-profile:v', 'high', '-level', '4.1',
      '-pix_fmt', 'yuv420p', '-r', String(FPS), '-movflags', '+faststart', out], { stdio: 'inherit' });
    console.log('MP4 :', out);
  }
})();
