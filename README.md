# RE.SOURCE — Calculateur d'irradiance PBM

Application web statique (HTML, CSS, JavaScript), sans dépendance, pour simuler l'irradiance et la fluence du MERICAN ZEN PLUS 26 040 LED.

## Charte et polices
Titres Montserrat ExtraBold, textes Inter (charte graphique RE.SOURCE v1.0). Les polices sont **hébergées dans `fonts/`** : aucun appel à un service externe. Le logo est `logo.webp`.

## Fonctionnalités
- Sélection individuelle ou multiple des longueurs d'onde **630, 660, 810, 850 et 940 nm**.
- Réglage de puissance relative de 0 à 100 % (hypothèse de linéarité **non confirmée**).
- Durée de 1 à 60 minutes et raccourcis 5/10/15/20/30 min.
- Irradiance théorique totale, détail rouge/NIR, fluence en J/cm², comparaison à l'annonce de 109 mW/cm².
- Copie des résultats dans le presse-papiers.
- Interface responsive, utilisable sur mobile et ordinateur.

## Installation locale
Ouvrir `index.html` avec un navigateur moderne. Aucune installation ni compilation requise.

## Publier sur GitHub Pages
1. Créer un dépôt public sur GitHub, par exemple `calculateur-pbm`.
2. Ajouter **tout le contenu de ce dossier à la racine du dépôt**, y compris le dossier `fonts/`, `logo.webp` et les icônes `icon-*.png`.
3. Dans GitHub : **Settings > Pages > Build and deployment**.
4. Choisir **Deploy from a branch**, puis **main** et **/(root)**, et enregistrer.
5. L'adresse sera de la forme `https://VOTRE-IDENTIFIANT.github.io/calculateur-pbm/` après publication.

Une fois publiée sur HTTPS, l'application peut également être ajoutée à l'écran d'accueil de nombreux smartphones grâce au manifeste web. Elle n'utilise aucun service externe.

## Calcul et valeurs sources
Les valeurs d'origine sont en W/m², converties en mW/cm² :

| nm | W/m² | mW/cm² |
|---:|---:|---:|
| 630 | 134,8203 | 13,48203 |
| 660 | 191,6997 | 19,16997 |
| 810 | 120,3299 | 12,03299 |
| 850 | 150,4495 | 15,04495 |
| 940 | 157,9912 | 15,79912 |

`irradiance simulée = somme des irradiances des bandes sélectionnées × puissance_relative / 100`

`fluence (J/cm²) = irradiance simulée (mW/cm²) × durée (minutes) × 60 / 1000`

**Limite essentielle** : l'addition suppose des mesures au **même emplacement, à la même distance, dans des conditions comparables**, puis une émission simultanée. Ce n'est pas démontré par le dossier du fournisseur. Les valeurs ne doivent donc pas être présentées comme des irradiances cliniques mesurées. La puissance relative est supposée linéaire, et la dose calculée n'est pas une dose absorbée par les tissus. Aucune recommandation thérapeutique n'est fournie.

## Modifier les valeurs
Éditer `WAVES` au début de `app.js` après obtention de mesures fiables. Le chiffre vendeur de comparaison (109 mW/cm², non vérifié) est la constante `VENDOR_CLAIM` en haut de `app.js`.

## Structure
- `index.html` : interface
- `styles.css` : apparence
- `app.js` : calculs et interactions
- `manifest.webmanifest` : métadonnées pour installation sur écran d'accueil
- `fonts/` : Montserrat et Inter (licence OFL)
- `logo.webp` : logo RE.SOURCE
- `favicon.svg`, `icon-192.png`, `icon-512.png` : icônes génériques (dégradé aux couleurs de la charte, ne reproduisent pas le logo)

## Licence
Usage interne. Le logo RE.SOURCE est la propriété de VITALYS SARL ; les polices Montserrat et Inter sont sous licence SIL OFL.

La page contient `noindex` pour éviter l'indexation par les moteurs de recherche, mais un dépôt GitHub public reste lisible par tous (valeurs vendeur incluses).
