# Guide de l'équipe — Site de l'ONG LEFONA

Ce guide explique comment modifier le site **sans être développeur**.
Adresse du site : **https://association-lefona.github.io**

> Le site est rédigé **en anglais**. Un sélecteur de langue (en haut à droite)
> traduit automatiquement la page dans une quarantaine de langues.
> Vous écrivez donc toujours vos textes **en anglais**.

---

## 1. Les fichiers du site

```
index.html               Page d'accueil
expertise.html           Nos domaines de travail
projects.html            Projets + galerie photos de terrain
publications.html        Liste des publications
team.html                Conseil d'administration, équipe, gouvernance
contact.html             Formulaire, coordonnées, carte
legal.html               Mentions légales
article-template.html    MODÈLE d'article (à dupliquer, ne pas modifier)
404.html                 Page affichée si une adresse n'existe pas
css/style.css            Mise en forme (couleurs, tailles)
js/main.js               Comportements (menu, filtres, langues)
images/                  Toutes les photos et le logo
sitemap.xml, robots.txt  Fichiers techniques pour Google
```

---

## 2. Modifier un texte (méthode recommandée)

Tout se fait dans le navigateur, sans rien installer :

1. Allez sur **github.com/association-lefona/association-lefona.github.io**
   et connectez-vous.
2. Cliquez sur le fichier à modifier (ex. `team.html`).
3. Cliquez sur le **crayon ✏️** en haut à droite du fichier.
4. Modifiez uniquement le texte, **jamais les balises** (`<p>`, `<h2>`, `</div>`…).
5. Cliquez sur le bouton vert **« Commit changes »**, puis confirmez.

Le site en ligne se met à jour tout seul en 1 à 2 minutes.

En cas d'erreur, l'onglet **History** de chaque fichier permet de revenir à
une version précédente.

---

## 3. Ajouter une photo

1. Nommez le fichier **en minuscules, sans espaces ni accents**
   (ex. `toliara-menage-2026.jpg`) et compressez-le si besoin sur
   [tinypng.com](https://tinypng.com) — visez moins de 400 Ko.
2. Sur GitHub, ouvrez le dossier `images`, puis
   **Add file → Upload files**, glissez la photo et validez.
3. Dans la page concernée, remplacez le bloc d'emplacement :

   ```html
   <div class="ph r-16-9">Photo — Toliara II</div>
   ```

   par votre image :

   ```html
   <img src="images/toliara-menage-2026.jpg" alt="Household survey in Toliara II">
   ```

Le texte `alt` décrit la photo en anglais (important pour Google et pour les
personnes malvoyantes).

**Galerie de terrain** (`projects.html`) : même principe. La légende affichée
quand on agrandit la photo se trouve dans l'attribut `data-caption`.

**Photos de l'équipe** (`team.html`) : remplacez le contenu du bloc
`<div class="person__avatar">…</div>` par `<img src="images/nom.jpg" alt="">`.

---

## 4. Ajouter un projet

Dans `projects.html`, copiez un bloc entier de `<article class="card">`
jusqu'à `</article>`, collez-le dans la grille et modifiez :

- `card__place` : le lieu (ex. `Fianarantsoa · Haute Matsiatra`)
- le titre `<h3>` et le paragraphe de description
- `card__foot` : le bailleur et l'année
- l'image

---

## 5. Ajouter une publication

Dans `publications.html`, copiez un bloc `<article class="pub">` … `</article>`,
collez-le **en haut** de la liste (la plus récente en premier) et modifiez :

- `data-category` : `study` ou `article` (c'est ce qui fait fonctionner les filtres)
- l'année (dans `<time datetime="2026">2026</time>`)
- le titre, les auteurs et la source

**Pour créer la page complète d'un article** : dupliquez
`article-template.html`, renommez la copie (ex. `article-heat-economics.html`),
remplacez les textes entre `[crochets]`, puis faites pointer la publication
vers ce fichier.

---

## 6. Modifier l'équipe

Dans `team.html` :

- **Conseil d'administration** : deux blocs `<article class="person">`.
  Le second est marqué « Seat to be confirmed » — remplacez le nom quand la
  personne sera désignée et retirez `person--vacant` de la classe.
- **Équipe exécutive** : un bloc par personne, à copier pour en ajouter.

⚠️ Les noms de personnes sont entourés de
`<span translate="no" class="notranslate">…</span>` : **gardez toujours cette
balise**. C'est elle qui empêche la traduction automatique de déformer les
noms — sans elle, « Rojo » deviendrait « Rouge » en français.

---

## 7. Le sélecteur de langue

- Le site est écrit en **anglais**.
- Les menus et boutons sont traduits à la main en **français** et en
  **malgache** (dictionnaire au début de `js/main.js`).
- Les autres langues sont assurées par la traduction automatique Google.
- Tout ce qui ne doit jamais être traduit (noms, lieux, LEFONA, e-mail) porte
  l'attribut `translate="no"`.

---

## 8. Formulaire de contact

Le formulaire vérifie les champs mais **n'envoie encore aucun message** : il
affiche un avis invitant à écrire à `ngolefona@gmail.com`.

Pour l'activer gratuitement avec [Formspree](https://formspree.io) : créez un
compte, récupérez votre identifiant de formulaire, puis demandez à une
personne technique de l'ajouter dans `js/main.js`.

---

## 9. Avant chaque mise en ligne — vérifications

- [ ] Plus aucun texte entre `[crochets]`
- [ ] Plus aucun bloc gris « Photo — … » sur les pages publiées
- [ ] Le lien LinkedIn du pied de page pointe vers la vraie page de l'ONG
- [ ] Les textes ajoutés sont bien **en anglais**
- [ ] Les noms de personnes gardent leur balise `translate="no"`
- [ ] La description `<meta name="description">` de la page est à jour

---

## 10. Ce qu'il ne faut pas toucher

`css/style.css`, `js/main.js`, `sitemap.xml`, `robots.txt` et le contenu de
`<head>` (hors titre et description) font fonctionner le site.
En cas de besoin, demandez à une personne technique.
