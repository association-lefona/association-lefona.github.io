# 📖 Guide de l'équipe contenu — Site de l'Association Lefona

Bienvenue ! Ce site est un **squelette** : toute la structure, le design et
les animations sont prêts. Votre mission : remplacer les textes et images
provisoires par le vrai contenu de l'association. **Aucune compétence en
programmation n'est nécessaire** — ce guide vous explique tout, pas à pas.

---

## 🗂 1. Comment le site est organisé

```
site internet association lefona/
├── index.html              → page d'accueil
├── apropos.html            → page « À propos »
├── publications.html       → page « Articles & Études »
├── article-template.html   → MODÈLE d'article (à dupliquer, ne pas modifier)
├── galerie.html            → page « Galerie »
├── contact.html            → page « Contact »
├── css/style.css           → toute la mise en forme (couleurs, tailles…)
├── js/main.js              → les animations et comportements (ne pas toucher)
├── images/                 → déposez ici toutes vos photos
└── GUIDE-EQUIPE.md         → ce guide
```

**Pour voir le site** : double-cliquez sur `index.html`, il s'ouvre dans
votre navigateur. Après chaque modification, enregistrez le fichier et
rechargez la page du navigateur (touche F5, ou Cmd+R sur Mac).

**Pour modifier un fichier** : ouvrez-le avec un éditeur de texte gratuit
comme [Visual Studio Code](https://code.visualstudio.com/) (recommandé)
ou, à défaut, le Bloc-notes / TextEdit (en mode texte brut).

---

## ✏️ 2. Remplacer les textes provisoires

Tous les textes à remplacer sont **entre [crochets]**, par exemple :
`[Slogan de l'association à compléter]`.

De plus, des commentaires vous guident directement dans les fichiers :

```html
<!-- À COMPLÉTER PAR L'ÉQUIPE CONTENU : ... -->
```

👉 **Méthode** : ouvrez le fichier HTML de la page, utilisez la recherche
(Ctrl+F ou Cmd+F) avec le mot **« COMPLÉTER »** ou le caractère **« [ »**,
et remplacez chaque texte entre crochets par le vôtre (en supprimant les
crochets). Ne touchez pas aux balises comme `<p>`, `<h2>`, `</div>` :
modifiez uniquement le texte entre elles.

⚠️ L'en-tête (menu) et le pied de page sont **répétés dans chaque fichier
HTML**. Si vous modifiez par exemple l'adresse dans le pied de page,
faites-le dans les 6 fichiers HTML.

---

## 🖼 3. Ajouter des photos

1. **Préparez la photo** : format `.jpg` ou `.png`, pas trop lourde
   (idéalement moins de 500 Ko — vous pouvez la compresser sur
   [tinypng.com](https://tinypng.com)). Renommez le fichier **en minuscules,
   sans espaces ni accents** : `atelier-riz-2026.jpg` ✅, `Atelier Riz.JPG` ❌.
2. **Déposez-la** dans le dossier `images/`.
3. **Remplacez le bloc provisoire** dans la page HTML. Les emplacements
   d'images ressemblent à ceci :

   ```html
   <div class="img-placeholder ratio-16-9">📷 [Image de l'actualité 1]</div>
   ```

   Supprimez toute cette ligne et mettez à la place :

   ```html
   <img src="images/atelier-riz-2026.jpg" alt="Description courte de la photo">
   ```

   Le texte `alt` décrit la photo (important pour l'accessibilité et Google).

### Cas particulier : la galerie

Dans `galerie.html`, chaque photo est dans un bloc `<figure>` :

- Remplacez le `<div class="img-placeholder">…</div>` par votre `<img …>`
  comme ci-dessus.
- Mettez la légende dans l'attribut `data-legende="…"` du `<figure>` :
  c'est elle qui s'affiche quand on clique sur la photo pour l'agrandir.
- Pour **ajouter** une photo : copiez un bloc `<figure>…</figure>` entier
  et collez-le dans la grille. La classe `haut` rend le bloc plus grand
  (effet mosaïque) — utilisez-la environ une fois sur trois.

### Cas particulier : les photos de l'équipe (apropos.html)

Remplacez le placeholder rond par :

```html
<img src="images/equipe-nom.jpg" alt="Nom Prénom" class="rond"
     style="width:100%;height:100%;object-fit:cover;">
```

---

## 📰 4. Publier un nouvel article ou une nouvelle étude

**Étape A — Créer la page de l'article**

1. Dans le dossier du site, copiez le fichier `article-template.html`
   et renommez la copie, par exemple `article-riziculture-2026.html`
   (minuscules, sans espaces ni accents).
2. Ouvrez votre copie et remplacez : le `<title>` en haut du fichier,
   le badge (Article ou Étude), le titre, la date, l'auteur, l'image de
   couverture et le corps du texte. Tous les endroits sont signalés par
   des commentaires « À COMPLÉTER ».

**Étape B — Ajouter la carte dans la liste des publications**

1. Ouvrez `publications.html` et repérez le grand commentaire
   « COMMENT AJOUTER UNE PUBLICATION » : il rappelle la marche à suivre.
2. Copiez un bloc entier de `<article class="carte carte-publication …">`
   jusqu'à `</article>` et collez-le en premier dans la grille.
3. Dans votre copie, adaptez :
   - `data-categorie="article"` **ou** `data-categorie="etude"`
     (sans accent — c'est ce qui fait fonctionner les filtres) ;
   - le badge correspondant (`badge-article` ou `badge-etude`) ;
   - l'image, le titre, la date, le résumé ;
   - le lien : `href="article-riziculture-2026.html"` (le nom de VOTRE fichier).

**Étape C (facultatif)** — Mettre l'article en avant sur la page d'accueil :
dans `index.html`, section « Nos dernières actualités », mettez à jour une
des 3 cartes de la même façon.

---

## 🔢 5. Mettre à jour les chiffres clés (accueil)

Dans `index.html`, section « CHIFFRES CLÉS » :

- Le nombre animé se règle avec l'attribut `data-cible` :
  `data-cible="30"` → le compteur monte jusqu'à 30.
- `data-suffixe="+"` ajoute un « + » après le nombre (facultatif).
- Modifiez aussi le libellé en dessous (ex. `[XX] membres` → `Membres actifs`).

---

## 📍 6. Page Contact

- **Coordonnées** : remplacez les textes entre crochets (adresse,
  téléphone, e-mail) dans `contact.html` **et** dans le pied de page de
  chaque fichier HTML.
- **Carte Google Maps** : sur Google Maps, cherchez votre adresse →
  « Partager » → « Intégrer une carte » → copiez le code `<iframe …>`.
  Dans `contact.html`, un commentaire indique exactement où le coller.
- **Formulaire** : il vérifie déjà les champs, mais **n'envoie encore
  aucun message** (il affiche « Formulaire à connecter »). Pour l'activer,
  il faudra un service d'envoi (par exemple [Formspree](https://formspree.io),
  gratuit pour un petit volume) — demandez à une personne technique de
  faire cette connexion dans `js/main.js`.

---

## 🎨 7. Logo et couleurs

- **Logo** : le logo officiel de l'association (cornes de zébu, lance,
  écu tissé) est intégré en version vectorielle dans l'en-tête et le pied
  de page de chaque page — il s'adapte automatiquement aux fonds clairs
  et sombres. La version complète du logo (avec les rameaux et le nom)
  se trouve dans `images/logo-lefona.svg` : vous pouvez l'utiliser pour
  vos documents, affiches et réseaux sociaux.
- **Couleurs** : toutes les couleurs du site sont définies au même
  endroit, tout en haut de `css/style.css` (section « 1. VARIABLES »).
  Changer une valeur là-bas change la couleur sur tout le site.

---

## ✅ 8. Liste de contrôle avant mise en ligne

- [ ] Plus aucun texte entre `[crochets]` sur aucune page
- [ ] Plus aucun bloc « 📷 [Image à insérer] »
- [ ] Les liens des réseaux sociaux ne pointent plus vers `#`
- [ ] Les boutons « Lire » pointent vers de vraies pages d'article
- [ ] Les coordonnées sont à jour dans `contact.html` ET dans le pied
      de page des 6 fichiers
- [ ] La carte Google Maps est insérée
- [ ] Le formulaire de contact est connecté à un service d'envoi
- [ ] Les descriptions `meta name="description"` sont remplies dans
      chaque page (important pour Google)

Bon courage ! 🚀
