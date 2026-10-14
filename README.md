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

## Publication et installation
L'application est publiée avec GitHub Pages (branche `main`, dossier racine) :
https://jbpruvot.github.io/calculateur-pbm/

Installation comme application :
- Chrome ou Edge sur PC : icône d'installation dans la barre d'adresse, ou menu > « Installer ».
- Tablette Android (Chrome) : menu > « Installer l'application ».
- iPad (Safari) : Partager > « Sur l'écran d'accueil ».

Le service worker (`sw.js`) garde une copie locale : après une première ouverture, l'application fonctionne sans connexion et se met à jour dès qu'une connexion est disponible.

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
- `sw.js` : mode hors ligne
- `fonts/` : Montserrat et Inter (licence OFL)
- `logo.webp` : logo RE.SOURCE
- `favicon.svg`, `icon-192.png`, `icon-512.png` : icônes génériques (dégradé aux couleurs de la charte, ne reproduisent pas le logo)

## Licence
Usage interne. Le logo RE.SOURCE est la propriété de VITALYS SARL ; les polices Montserrat et Inter sont sous licence SIL OFL.

Le dépôt est public : le code, les mesures du vendeur et le nom du lit sont lisibles par tous. La page contient `noindex` pour limiter l'indexation par les moteurs de recherche, sans l'empêcher totalement.
