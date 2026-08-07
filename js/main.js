/* ==========================================================================
   ASSOCIATION LEFONA — SCRIPT PRINCIPAL (js/main.js)
   --------------------------------------------------------------------------
   Ce fichier gère tous les comportements interactifs du site.
   Pour l'équipe contenu : vous n'avez normalement PAS besoin de modifier
   ce fichier. Tout le contenu (textes, images) se change dans les
   fichiers HTML — voir GUIDE-EQUIPE.md.

   SOMMAIRE
   1. Menu mobile (bouton burger)
   2. Ombre du header au défilement
   3. Apparition des sections au scroll (classe « reveal »)
   4. Compteurs animés (chiffres clés de l'accueil)
   5. Filtres de la page « Articles & Études »
   6. Lightbox de la galerie
   7. Validation du formulaire de contact
   ========================================================================== */

'use strict';

/* Détecte si l'utilisateur préfère réduire les animations (accessibilité) */
const ANIMATIONS_REDUITES =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* On attend que la page soit chargée avant d'initialiser les comportements */
document.addEventListener('DOMContentLoaded', () => {
  initMenuMobile();
  initHeaderScroll();
  initApparitions();
  initCompteurs();
  initFiltresPublications();
  initLightboxGalerie();
  initFormulaireContact();
});


/* ==========================================================================
   1. MENU MOBILE (BOUTON BURGER)
   Sur mobile, le bouton burger ouvre/ferme le panneau de navigation.
   ========================================================================== */
function initMenuMobile() {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('main-nav');
  if (!burger || !nav) return;

  function basculerMenu(forcerFermeture) {
    const doitOuvrir = forcerFermeture ? false : !nav.classList.contains('ouvert');
    nav.classList.toggle('ouvert', doitOuvrir);
    burger.classList.toggle('ouvert', doitOuvrir);
    burger.setAttribute('aria-expanded', String(doitOuvrir));
    document.body.classList.toggle('nav-ouverte', doitOuvrir);
  }

  burger.addEventListener('click', () => basculerMenu());

  // On ferme le menu quand on clique sur un lien
  nav.querySelectorAll('a').forEach((lien) => {
    lien.addEventListener('click', () => basculerMenu(true));
  });

  // On ferme le menu avec la touche Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') basculerMenu(true);
  });

  // Si on agrandit la fenêtre (passage en mode bureau), on réinitialise
  window.addEventListener('resize', () => {
    if (window.innerWidth > 880) basculerMenu(true);
  });
}


/* ==========================================================================
   2. OMBRE DU HEADER AU DÉFILEMENT
   Dès que l'on fait défiler la page, le header reçoit la classe « reduit »
   qui lui ajoute une ombre et un fond plus opaque (voir le CSS).
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  function mettreAJour() {
    header.classList.toggle('reduit', window.scrollY > 10);
  }

  mettreAJour();
  window.addEventListener('scroll', mettreAJour, { passive: true });
}


/* ==========================================================================
   3. APPARITION DES SECTIONS AU SCROLL
   Tous les éléments portant la classe « reveal » apparaissent en fondu
   quand ils deviennent visibles à l'écran.
   ========================================================================== */
function initApparitions() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  // Si les animations sont réduites ou si le navigateur est trop ancien,
  // on affiche tout immédiatement.
  if (ANIMATIONS_REDUITES || !('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observateur = new IntersectionObserver(
    (entrees) => {
      entrees.forEach((entree) => {
        if (entree.isIntersecting) {
          entree.target.classList.add('visible');
          observateur.unobserve(entree.target); // on n'anime qu'une fois
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach((el) => observateur.observe(el));
}


/* ==========================================================================
   4. COMPTEURS ANIMÉS (CHIFFRES CLÉS)
   Chaque élément « .chiffre-valeur » possède un attribut data-cible
   (le nombre final) et, en option, data-suffixe (ex : « + »).
   Le compteur s'anime de 0 jusqu'à la cible quand il devient visible.

   ⚠️ ÉQUIPE CONTENU : pour changer un chiffre, modifiez l'attribut
   data-cible dans index.html — pas ce fichier.
   ========================================================================== */
function initCompteurs() {
  const compteurs = document.querySelectorAll('.chiffre-valeur');
  if (!compteurs.length) return;

  function animerCompteur(element) {
    const cible = parseInt(element.dataset.cible, 10) || 0;
    const suffixe = element.dataset.suffixe || '';
    const duree = 1600; // durée de l'animation en millisecondes

    if (ANIMATIONS_REDUITES) {
      element.textContent = cible + suffixe;
      return;
    }

    let depart = null;
    function etape(instant) {
      if (depart === null) depart = instant;
      const progression = Math.min((instant - depart) / duree, 1);
      // Courbe « ease-out » : rapide au début, ralentit à la fin
      const facteur = 1 - Math.pow(1 - progression, 3);
      element.textContent = Math.round(cible * facteur) + suffixe;
      if (progression < 1) requestAnimationFrame(etape);
    }
    requestAnimationFrame(etape);
  }

  if (!('IntersectionObserver' in window)) {
    compteurs.forEach(animerCompteur);
    return;
  }

  const observateur = new IntersectionObserver(
    (entrees) => {
      entrees.forEach((entree) => {
        if (entree.isIntersecting) {
          animerCompteur(entree.target);
          observateur.unobserve(entree.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  compteurs.forEach((c) => observateur.observe(c));
}


/* ==========================================================================
   5. FILTRES DE LA PAGE « ARTICLES & ÉTUDES »
   Les boutons portent un attribut data-filtre (« tout », « article »
   ou « etude ») et chaque carte un attribut data-categorie.
   Cliquer sur un bouton masque les cartes qui ne correspondent pas.
   ========================================================================== */
function initFiltresPublications() {
  const boutons = document.querySelectorAll('.filtre-btn');
  const cartes = document.querySelectorAll('.carte-publication');
  if (!boutons.length || !cartes.length) return;

  boutons.forEach((bouton) => {
    bouton.addEventListener('click', () => {
      // Mise en évidence du bouton actif
      boutons.forEach((b) => {
        const estActif = b === bouton;
        b.classList.toggle('actif', estActif);
        b.setAttribute('aria-pressed', String(estActif));
      });

      const filtre = bouton.dataset.filtre;

      cartes.forEach((carte) => {
        const visible = filtre === 'tout' || carte.dataset.categorie === filtre;
        carte.classList.toggle('cachee', !visible);

        // Petite animation d'apparition pour les cartes affichées
        if (visible) {
          carte.classList.remove('apparition');
          void carte.offsetWidth; // force le navigateur à relancer l'animation
          carte.classList.add('apparition');
        }
      });
    });
  });
}


/* ==========================================================================
   6. LIGHTBOX DE LA GALERIE
   Cliquer sur une photo l'affiche en grand dans une fenêtre sombre.
   Fonctionne aussi bien avec les blocs placeholder actuels qu'avec de
   vraies images <img> ajoutées plus tard par l'équipe contenu.
   ========================================================================== */
function initLightboxGalerie() {
  const lightbox = document.getElementById('lightbox');
  const items = document.querySelectorAll('.galerie-item');
  if (!lightbox || !items.length) return;

  const zoneMedia = document.getElementById('lightbox-media');
  const legende = document.getElementById('lightbox-legende');
  const boutonFermer = document.getElementById('lightbox-fermer');

  function ouvrirLightbox(item) {
    zoneMedia.innerHTML = ''; // on vide le contenu précédent

    const image = item.querySelector('img');
    if (image) {
      // Cas d'une vraie photo : on l'affiche en grand
      const grandeImage = document.createElement('img');
      grandeImage.src = image.src;
      grandeImage.alt = image.alt || '';
      zoneMedia.appendChild(grandeImage);
    } else {
      // Cas d'un placeholder : on le recopie en grand
      const placeholder = item.querySelector('.img-placeholder');
      if (placeholder) zoneMedia.appendChild(placeholder.cloneNode(true));
    }

    // Légende : attribut data-legende du bloc cliqué
    legende.textContent = item.dataset.legende || '';

    lightbox.classList.add('ouverte');
    lightbox.removeAttribute('hidden');
    document.body.classList.add('nav-ouverte'); // bloque le défilement
    boutonFermer.focus();
  }

  function fermerLightbox() {
    lightbox.classList.remove('ouverte');
    document.body.classList.remove('nav-ouverte');
    // On attend la fin du fondu avant de masquer complètement
    setTimeout(() => lightbox.setAttribute('hidden', ''), 300);
  }

  items.forEach((item) => {
    item.addEventListener('click', () => ouvrirLightbox(item));
    // Accessibilité : ouverture au clavier (Entrée ou Espace)
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        ouvrirLightbox(item);
      }
    });
  });

  boutonFermer.addEventListener('click', fermerLightbox);

  // Fermer en cliquant sur le fond sombre (mais pas sur la photo)
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) fermerLightbox();
  });

  // Fermer avec la touche Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('ouverte')) {
      fermerLightbox();
    }
  });
}


/* ==========================================================================
   7. VALIDATION DU FORMULAIRE DE CONTACT
   Vérifie que les champs sont correctement remplis AVANT l'envoi.
   ⚠️ Le formulaire n'est PAS encore connecté à un service d'envoi :
   pour l'instant, un message « Formulaire à connecter » s'affiche.
   Voir GUIDE-EQUIPE.md pour connecter un vrai service plus tard.
   ========================================================================== */
function initFormulaireContact() {
  const formulaire = document.getElementById('form-contact');
  if (!formulaire) return;

  const confirmation = document.getElementById('form-confirmation');

  /* Règles de validation : pour chaque champ, une fonction qui renvoie
     un message d'erreur (ou une chaîne vide si tout va bien). */
  const regles = {
    nom: (valeur) =>
      valeur.trim().length < 2 ? 'Veuillez indiquer votre nom.' : '',
    email: (valeur) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valeur.trim())
        ? ''
        : 'Veuillez indiquer une adresse e-mail valide.',
    sujet: (valeur) =>
      valeur.trim().length < 3 ? 'Veuillez indiquer un sujet.' : '',
    message: (valeur) =>
      valeur.trim().length < 10
        ? 'Votre message doit contenir au moins 10 caractères.'
        : '',
  };

  function validerChamp(champ) {
    const regle = regles[champ.name];
    if (!regle) return true;

    const messageErreur = regle(champ.value);
    const zoneErreur = document.getElementById('erreur-' + champ.name);

    champ.classList.toggle('erreur', messageErreur !== '');
    champ.setAttribute('aria-invalid', String(messageErreur !== ''));
    if (zoneErreur) zoneErreur.textContent = messageErreur;

    return messageErreur === '';
  }

  // Validation en direct : l'erreur disparaît dès que l'on corrige
  formulaire.querySelectorAll('input, textarea').forEach((champ) => {
    champ.addEventListener('input', () => {
      if (champ.classList.contains('erreur')) validerChamp(champ);
    });
  });

  formulaire.addEventListener('submit', (e) => {
    e.preventDefault(); // pas de backend pour l'instant : on bloque l'envoi

    let toutEstValide = true;
    formulaire.querySelectorAll('input, textarea').forEach((champ) => {
      if (!validerChamp(champ)) toutEstValide = false;
    });

    if (!toutEstValide) {
      // On place le curseur sur le premier champ en erreur
      const premierErreur = formulaire.querySelector('.erreur');
      if (premierErreur) premierErreur.focus();
      return;
    }

    // Tout est valide : on affiche le message temporaire.
    // ⚠️ À REMPLACER plus tard par un véritable envoi (service d'e-mail,
    // Formspree, backend, etc.) — voir GUIDE-EQUIPE.md.
    if (confirmation) {
      confirmation.textContent =
        '✅ Formulaire valide ! (Formulaire à connecter : le message ' +
        "n'a pas encore été envoyé — aucun service d'envoi n'est configuré.)";
      confirmation.classList.add('visible');
    }
  });
}
