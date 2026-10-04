# Site HABEK — mode d'emploi

Site statique (HTML/CSS/JS, aucune dépendance). Les pages du site sont **générées** à partir de gabarits :

```
src/partials/   en-tête, pied de page, éléments communs du <head>
src/pages/      une page par fichier (en-tête « --- » + contenu)
site.config.json  numéro WhatsApp, e-mail, Facebook, domaines (origin / shareOrigin)
build.mjs       générateur (Node 18+, aucune installation)
brand/logo/     logos sources (non publiés)
```

## Modifier le site
1. Modifier un fichier dans `src/` (jamais directement `index.html`, `scolo.html`… : ils sont écrasés).
2. Lancer :
   ```
   node build.mjs
   ```
   Cela régénère les pages, `sitemap.xml` et `robots.txt`.
3. `node build.mjs --check` vérifie que les fichiers générés sont à jour.
4. Déployer sur Vercel (les fichiers générés à la racine sont ceux qui sont publiés).

## Changer de domaine
Dans `site.config.json`, remplacer `shareOrigin` (aujourd'hui `https://habek.vercel.app`) par `https://habek.cc`, puis relancer `node build.mjs`.

## Variables des gabarits
`{{root}}` (préfixe des liens locaux), `{{home}}` (accueil), `{{site.xxx}}` (valeurs de `site.config.json`), `{{year}}`, `{{> nom}}` (inclusion d'un partiel).
Front matter d'une page : `title`, `description`, `canonical`, `robots`, `scripts`, `nav`, `updated`, `order`.

Sur Vercel, `src/`, `brand/`, `build.mjs`, etc. sont exclus par `.vercelignore` (déploiement via la CLI). En déploiement Git, ils restent dans le dépôt.

## Brochure PDF
Source : `brand/brochure/brochure-scolo.html` (non publiée). PDF publié : `assets/brochure-scolo.pdf`.
Régénérer (Edge ou Chrome installé) :
```
msedge --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf=assets/brochure-scolo.pdf file:///…/brand/brochure/brochure-scolo.html
```
La brochure ne contient aucun prix (décision du brief). Vérifier les numéros et l'e-mail avant de la régénérer.

## Témoignage (preuve sociale)
Désactivé par défaut. Dans `site.config.json`, bloc `proof` : renseigner `quote`, `author`, `role`, `school`, `results` (chiffres **réels**), puis `consent: true` et `consentDate` (accord écrit de l'école) et `enabled: true`. Sans accord, `node build.mjs` refuse de construire le site.

## Mesure d'audience (Vercel Web Analytics)
Activée dans `site.config.json` (`analytics.enabled`). Le générateur ajoute le script Vercel, `assets/track.js` (évènements : `whatsapp_click`, `call_click`, `email_click`, `brochure_download`, `scolo_app_click`, `demo_request` — aucune donnée personnelle) et adapte la politique de confidentialité.
**À faire une fois** : dans le tableau de bord Vercel du projet → *Analytics* → *Enable*, puis redéployer. Tant que ce n'est pas activé, le script renvoie une erreur 404 sans conséquence.
Les évènements personnalisés dépendent du plan Vercel (à vérifier) ; les pages vues sont incluses.
Pour désactiver : `"enabled": false` puis `node build.mjs` (la politique revient au texte « aucune mesure d'audience »).

## Démo interactive (`demo/`)
Page autonome issue du prototype de l'application Scolo, avec **données fictives** (établissement et numéros anonymisés), servie sans aucune ressource externe (Alpine.js, CSS Tailwind compilé et polices sont locaux). Elle s'affiche dans un cadre sur `scolo.html` (chargé au clic) et en plein écran sur `/demo/`.
- Cette page a une politique de sécurité plus souple que le reste du site (`vercel.json`, règle `/demo`) car Alpine.js a besoin de `'unsafe-eval'`. Elle ne charge rien d'extérieur, n'envoie aucune donnée et n'utilise aucun cookie.
- Régénérer le CSS après une modification de `demo/index.html` (depuis un dossier où Tailwind 3 est installé) :
  `npx tailwindcss -c brand/demo/tailwind.config.cjs -i brand/demo/tailwind.input.css -o demo/demo.css --minify` (puis remettre les deux `@font-face` en tête de `demo/demo.css`).
- Modifier les données : bloc `<script>` de `demo/index.html` (fonction `scoloApp`). Ne mettre que des données fictives.

## Captures du produit (`assets/shots/`)
`scolo-tableau-de-bord.webp` et `scolo-relances-mobile.webp` sont des captures de la démo (`/demo/`, données fictives), utilisées dans le hero de la page Scolo et la carte de l'accueil (partiel `src/partials/scolo-shots.html`). Pour les refaire : ouvrir `/demo/` (bureau 1100×690 puis mobile 375×760, écran « Relances »), masquer le bandeau doré, exporter en WebP (≈ 1100 px et 450 px de large).

## Prévisualiser en local
Ouvrir `index.html` directement fonctionne à peu près, mais certains navigateurs bloquent les polices en `file://`. Pour un aperçu fidèle : `python -m http.server 8000` dans ce dossier, puis http://localhost:8000.

## Pages produit
`scolo.html` (Scolo, en phase pilote) et `immo-suite.html` (Immo Suite, **en développement** : pas de démo ni de prix). Le lien vers l'application Scolo est `scoloApp` dans `site.config.json`. Les formulaires (`form[data-wa]`) sont gérés par `assets/demo.js` : `data-intro` = première ligne du message WhatsApp, `data-label` sur un champ = libellé de la ligne ; `data-event` = évènement d'analytics.

## Identité légale
`site.config.json` contient `legalName`, `legalForm`, `capital`, `rccm`, `ifu`, `manager` : ils alimentent les mentions légales, le pied de page et les données structurées (schema.org). Modifier là, puis `node build.mjs`.

## Image de partage de la page Scolo
`assets/og-scolo.png` (1200×630) est générée depuis `brand/og/og-scolo.html` (commande dans le fichier). L'accueil et les autres pages utilisent `assets/og-image.png`.
