# LE HUB Beelix — vidéo de lancement

| Fichier | Rôle |
|---|---|
| `hub-beelix-video.mp4` | Vidéo finale : 1920×1080, 30 i/s, 32 s, H.264 (yuv420p), sans son |
| `hub-beelix-video.html` | Animation source autonome (GSAP via cdnjs, images et police Outfit en base64). Ouvrir dans un navigateur : elle tourne en boucle. |
| `src/template.html` | Même source, mais les images sont des repères `{{nom}}` (plus simple à modifier) |
| `src/assets/` | Icônes recadrées (carré arrondi seul) + police Outfit |
| `src/build.js` | Intègre les assets en base64 → `hub-beelix-video.html` |
| `src/render.js` | Rendu image par image (`timeline.seek`) avec Playwright, puis assemblage ffmpeg |

## Régénérer

```bash
cd src
npm i gsap@3.12.5 playwright   # une fois
node build.js                  # template + assets → hub-beelix-video.html
node render.js                 # 960 images → hub-beelix-video.mp4
node render.js --only=5,12.5   # captures de contrôle à des instants précis
```

## Storyboard (minutage)

| Scène | Temps | Contenu |
|---|---|---|
| 1 | 0 → 4 s | Logo beelix, reflet lumineux, remontée |
| 2 | 4 → 9 s | « Une plateforme UNIQUE » / « pour retrouver tous les liens utiles », icônes en orbite qui convergent |
| 3 | 9 → 14 s | « Beelix présente » → « LE HUB » (zoom + flash), page d'accueil du hub, clic sur « Accéder à mes outils » |
| 4 | 14 → 21 s | Mail tapé à rh@beelix.fr, tampon « FINI ! », Leeto « CSE → en 1 clic » |
| 5 | 21 → 26 s | Page du hub : header, grille de 9 applications (5 + 4) en cascade |
| 6 | 26 → 32 s | Aspiration des icônes, explosion (flash, ondes de choc, étincelles, secousse), « LE HUB / disponible dès aujourd’hui / https://hub.beelix.fr », image figée de 30 à 32 s |
