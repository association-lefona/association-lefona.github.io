/* ==========================================================================
   NGO LEFONA — SCRIPT PRINCIPAL (js/main.js)
   --------------------------------------------------------------------------
   Gère tous les comportements interactifs du site.
   Pour l'équipe contenu : vous n'avez normalement PAS besoin de modifier
   ce fichier. Tout le contenu se change dans les fichiers HTML
   (voir GUIDE-EQUIPE.md).

   SOMMAIRE
   1. Menu mobile (bouton burger)
   2. Apparition des sections au défilement
   3. Compteurs animés (chiffres clés)
   4. Filtres des publications
   5. Galerie : agrandissement des photos (lightbox)
   6. Formulaire de contact (validation)
   7. Sélecteur de langue (traduction automatique Google)
   ========================================================================== */

'use strict';

var REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', function () {
  initMobileNav();
  initReveal();
  initCounters();
  initPublicationFilters();
  initLightbox();
  initContactForm();
  initLanguageMenu();
});


/* ==========================================================================
   1. MENU MOBILE
   ========================================================================== */
function initMobileNav() {
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav-links');
  if (!burger || !nav) return;

  function toggle(forceClose) {
    var open = forceClose ? false : !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-open', open);
  }

  burger.addEventListener('click', function () { toggle(); });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { toggle(true); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') toggle(true);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 940) toggle(true);
  });
}


/* ==========================================================================
   2. APPARITION DES SECTIONS AU DÉFILEMENT
   ========================================================================== */
function initReveal() {
  var items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (REDUCED_MOTION || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(function (el) { observer.observe(el); });
}


/* ==========================================================================
   3. COMPTEURS ANIMÉS (chiffres clés)
   Chaque « .stat-value » porte data-target (nombre) et data-suffix
   (ex. « + »). ÉQUIPE CONTENU : modifiez ces attributs dans le HTML.
   ========================================================================== */
function initCounters() {
  var counters = document.querySelectorAll('.stat-value[data-target]');
  if (!counters.length) return;

  function animate(el) {
    var target = parseInt(el.dataset.target, 10) || 0;
    var suffix = el.dataset.suffix || '';
    var duration = 1400;

    if (REDUCED_MOTION) { el.textContent = target + suffix; return; }

    var start = null;
    function step(now) {
      if (start === null) start = now;
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animate);
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(function (el) { observer.observe(el); });
}


/* ==========================================================================
   4. FILTRES DES PUBLICATIONS
   Les boutons portent data-filter, les publications data-category.
   ========================================================================== */
function initPublicationFilters() {
  var buttons = document.querySelectorAll('.filter-btn');
  var items = document.querySelectorAll('.pub-item[data-category]');
  if (!buttons.length || !items.length) return;

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      buttons.forEach(function (b) {
        var isActive = b === button;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-pressed', String(isActive));
      });

      var filter = button.dataset.filter;
      items.forEach(function (item) {
        var show = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('hidden', !show);
      });
    });
  });
}


/* ==========================================================================
   5. GALERIE — AGRANDISSEMENT DES PHOTOS
   ========================================================================== */
function initLightbox() {
  var lightbox = document.getElementById('lightbox');
  var items = document.querySelectorAll('.gallery-item');
  if (!lightbox || !items.length) return;

  var media = document.getElementById('lightbox-media');
  var caption = document.getElementById('lightbox-caption');
  var closeBtn = document.getElementById('lightbox-close');

  function open(item) {
    media.innerHTML = '';
    var img = item.querySelector('img');
    if (img) {
      var big = document.createElement('img');
      big.src = img.src;
      big.alt = img.alt || '';
      media.appendChild(big);
    } else {
      var ph = item.querySelector('.img-placeholder');
      if (ph) media.appendChild(ph.cloneNode(true));
    }
    caption.textContent = item.dataset.caption || '';
    lightbox.classList.add('open');
    lightbox.removeAttribute('hidden');
    document.body.classList.add('nav-open');
    closeBtn.focus();
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.classList.remove('nav-open');
    setTimeout(function () { lightbox.setAttribute('hidden', ''); }, 260);
  }

  items.forEach(function (item) {
    item.addEventListener('click', function () { open(item); });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(item); }
    });
  });

  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) close();
  });
}


/* ==========================================================================
   6. FORMULAIRE DE CONTACT
   Validation côté navigateur. ATTENTION : le formulaire n'est pas encore
   relié à un service d'envoi ; un message d'information s'affiche à la
   place. Voir GUIDE-EQUIPE.md pour le connecter (Formspree, etc.).
   ========================================================================== */
function initContactForm() {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var note = document.getElementById('form-note');

  var rules = {
    name: function (v) { return v.trim().length < 2 ? 'Please enter your name.' : ''; },
    email: function (v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.';
    },
    subject: function (v) { return v.trim().length < 3 ? 'Please enter a subject.' : ''; },
    message: function (v) {
      return v.trim().length < 10 ? 'Your message must be at least 10 characters long.' : '';
    }
  };

  function validate(field) {
    var rule = rules[field.name];
    if (!rule) return true;
    var msg = rule(field.value);
    var box = document.getElementById('error-' + field.name);
    field.classList.toggle('error', msg !== '');
    field.setAttribute('aria-invalid', String(msg !== ''));
    if (box) box.textContent = msg;
    return msg === '';
  }

  form.querySelectorAll('input, textarea').forEach(function (field) {
    field.addEventListener('input', function () {
      if (field.classList.contains('error')) validate(field);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var valid = true;
    form.querySelectorAll('input, textarea').forEach(function (field) {
      if (!validate(field)) valid = false;
    });

    if (!valid) {
      var first = form.querySelector('.error');
      if (first) first.focus();
      return;
    }

    if (note) {
      note.textContent = 'Form not connected yet — your message has not been sent. ' +
        'In the meantime, please write to ngolefona@gmail.com.';
      note.classList.add('visible');
    }
  });
}


/* ==========================================================================
   7. SÉLECTEUR DE LANGUE (traduction automatique)
   Le site est écrit en anglais. Le widget Google Translate traduit la page
   à la volée dans la langue choisie ; le choix est mémorisé d'une page à
   l'autre grâce au cookie « googtrans ».
   ========================================================================== */

/* Appelée automatiquement par le script Google chargé dans chaque page */
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: 'en', autoDisplay: false },
    'google_translate_element'
  );
}

function initLanguageMenu() {
  var button = document.getElementById('lang-btn');
  var menu = document.getElementById('lang-menu');
  if (!button || !menu) return;

  var label = button.querySelector('.lang-current');

  /* Langue active, lue dans le cookie googtrans (ex. « /en/fr ») */
  function currentLang() {
    var m = document.cookie.match(/googtrans=([^;]+)/);
    if (m) {
      var parts = decodeURIComponent(m[1]).split('/');
      if (parts.length >= 3 && parts[2]) return parts[2];
    }
    return 'en';
  }

  /* Applique la langue : pose le cookie puis recharge la page */
  function setLang(code) {
    var host = location.hostname;
    var value = code === 'en' ? '' : '/en/' + code;

    ['', '; domain=.' + host, '; domain=' + host].forEach(function (scope) {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + scope;
    });

    if (value) {
      document.cookie = 'googtrans=' + value + '; path=/';
      document.cookie = 'googtrans=' + value + '; path=/; domain=.' + host;
    }

    try { localStorage.setItem('lefona-lang', code); } catch (err) { /* ignoré */ }
    location.reload();
  }

  /* Met à jour le libellé du bouton et la langue cochée */
  function refresh() {
    var code = currentLang();
    if (label) label.textContent = code.toUpperCase();
    menu.querySelectorAll('button[data-lang]').forEach(function (b) {
      b.setAttribute('aria-current', String(b.dataset.lang === code));
    });
  }

  function closeMenu() {
    menu.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
  }

  button.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    button.setAttribute('aria-expanded', String(open));
  });

  menu.querySelectorAll('button[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.dataset.lang); });
  });

  document.addEventListener('click', function (e) {
    if (!menu.contains(e.target) && e.target !== button) closeMenu();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  refresh();
}
