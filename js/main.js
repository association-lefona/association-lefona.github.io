/* ==========================================================================
   NGO LEFONA — main.js
   Modules: nav, reveal, counters, filters, lightbox, contact form, i18n.

   Notes for maintainers
   - Proper nouns (people, places, the LEFONA name) carry translate="no" in
     the markup so the machine-translation layer leaves them alone.
   - Interface strings (navigation, buttons) are translated from the
     dictionary below for EN / FR / MG. For any other language the
     translate="no" flag is lifted so Google Translate handles them.
   ========================================================================== */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ========================================================================
     Interface dictionary — hand-written, not machine-translated.
     ======================================================================== */
  var UI = {
    en: {
      'brand.sub': 'Research & public policy analysis',
      'pubs.title': 'Our published research, openly available.',
      'team.board': 'Board of Directors',
      'team.exec': 'Executive team',
      'lbl.field': 'In the field',
      'lbl.glance': 'At a glance',
      'lbl.founded': 'Founded',
      'lbl.focus': 'Focus',
      'lbl.partner': 'Partners',
      'lbl.languages': 'Languages',
      'lbl.legalForm': 'Legal form',
      'lbl.office': 'Registered office',
      'lbl.purpose': 'Statutory purpose',
      'lbl.docs': 'Governing documents',
      'lbl.address': 'Office',
      'lbl.email': 'Email',
      'lbl.workLangs': 'Working languages',
      'lbl.name': 'Name',
      'lbl.subject': 'Subject',
      'lbl.message': 'Message',
      'nav.home': 'Home',
      'nav.expertise': 'Expertise',
      'nav.projects': 'Projects',
      'nav.publications': 'Publications',
      'nav.team': 'Team',
      'nav.contact': 'Contact',
      'cta.contact': 'Contact us',
      'cta.getInTouch': 'Get in touch',
      'ui.menu': 'Menu',
      'ui.language': 'Language',
      'ui.backTo': 'Back to publications',
      'ui.readMore': 'Read more',
      'foot.nav': 'Navigation',
      'foot.contact': 'Contact',
      'foot.follow': 'Follow us'
    },
    fr: {
      'brand.sub': 'Recherche et analyse de politique publique',
      'pubs.title': 'Nos recherches publiées, en libre accès.',
      'team.board': 'Conseil d\'administration',
      'team.exec': 'Équipe de direction',
      'lbl.field': 'Sur le terrain',
      'lbl.glance': 'En bref',
      'lbl.founded': 'Création',
      'lbl.focus': 'Domaine',
      'lbl.partner': 'Partenaires',
      'lbl.languages': 'Langues',
      'lbl.legalForm': 'Forme juridique',
      'lbl.office': 'Siège social',
      'lbl.purpose': 'Objet statutaire',
      'lbl.docs': 'Documents officiels',
      'lbl.address': 'Adresse',
      'lbl.email': 'E-mail',
      'lbl.workLangs': 'Langues de travail',
      'lbl.name': 'Nom',
      'lbl.subject': 'Objet',
      'lbl.message': 'Message',
      'nav.home': 'Accueil',
      'nav.expertise': 'Expertise',
      'nav.projects': 'Projets',
      'nav.publications': 'Publications',
      'nav.team': 'Équipe',
      'nav.contact': 'Contact',
      'cta.contact': 'Nous contacter',
      'cta.getInTouch': 'Nous écrire',
      'ui.menu': 'Menu',
      'ui.language': 'Langue',
      'ui.backTo': 'Retour aux publications',
      'ui.readMore': 'Lire la suite',
      'foot.nav': 'Navigation',
      'foot.contact': 'Contact',
      'foot.follow': 'Suivez-nous'
    },
    mg: {
      'brand.sub': 'Fikarohana sy fandalinana politika ho an\'ny daholobe',
      'pubs.title': 'Ny fikarohanay navoaka, malalaka ho an\'ny rehetra.',
      'team.board': 'Filan-kevi-pitantanana',
      'team.exec': 'Ekipa mpitantana',
      'lbl.field': 'Any an-toerana',
      'lbl.glance': 'Amin\'ny fohiny',
      'lbl.founded': 'Niorina',
      'lbl.focus': 'Sehatra',
      'lbl.partner': 'Mpiara-miasa',
      'lbl.languages': 'Fiteny',
      'lbl.legalForm': 'Endrika ara-dalana',
      'lbl.office': 'Foibe',
      'lbl.purpose': 'Tanjona',
      'lbl.docs': 'Antontan-taratasy',
      'lbl.address': 'Adiresy',
      'lbl.email': 'Mailaka',
      'lbl.workLangs': 'Fiteny ampiasaina',
      'lbl.name': 'Anarana',
      'lbl.subject': 'Lohahevitra',
      'lbl.message': 'Hafatra',
      'nav.home': 'Fandraisana',
      'nav.expertise': 'Fahaiza-manao',
      'nav.projects': 'Tetikasa',
      'nav.publications': 'Lahatsoratra',
      'nav.team': 'Ekipa',
      'nav.contact': 'Fifandraisana',
      'cta.contact': 'Hifandray aminay',
      'cta.getInTouch': 'Hifandray aminay',
      'ui.menu': 'Menio',
      'ui.language': 'Fiteny',
      'ui.backTo': 'Hiverina amin\'ny lahatsoratra',
      'ui.readMore': 'Hamaky bebe kokoa',
      'foot.nav': 'Fitetezana',
      'foot.contact': 'Fifandraisana',
      'foot.follow': 'Araho izahay'
    }
  };


  /* ========================================================================
     Helpers
     ======================================================================== */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function readCookie(name) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  }

  /* Active language, read from the googtrans cookie (e.g. "/en/fr") */
  function currentLang() {
    var raw = readCookie('googtrans');
    if (raw) {
      var parts = raw.split('/');
      if (parts.length >= 3 && parts[2]) return parts[2];
    }
    return 'en';
  }


  /* ========================================================================
     Mobile navigation
     ======================================================================== */
  function initNav() {
    var burger = $('#burger');
    var nav = $('#nav');
    if (!burger || !nav) return;

    function setOpen(open) {
      nav.setAttribute('data-open', String(open));
      burger.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('is-locked', open);
    }

    burger.addEventListener('click', function () {
      setOpen(nav.getAttribute('data-open') !== 'true');
    });

    $$('a', nav).forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 940) setOpen(false);
    });
  }


  /* ========================================================================
     Reveal on scroll
     ======================================================================== */
  function initReveal() {
    var items = $$('[data-reveal]');
    if (!items.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px' });

    items.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 4, 3) * 70 + 'ms';
      io.observe(el);
    });
  }


  /* ========================================================================
     Animated counters — data-count holds the target value
     ======================================================================== */
  function initCounters() {
    var nodes = $$('[data-count]');
    if (!nodes.length) return;

    function run(el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';

      if (prefersReducedMotion) { el.textContent = target + suffix; return; }

      var started = null;
      function frame(now) {
        if (started === null) started = now;
        var p = Math.min((now - started) / 1200, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    if (!('IntersectionObserver' in window)) { nodes.forEach(run); return; }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        run(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    nodes.forEach(function (el) { io.observe(el); });
  }


  /* ========================================================================
     Publication filters
     ======================================================================== */
  function initFilters() {
    var buttons = $$('[data-filter]');
    var items = $$('[data-category]');
    if (!buttons.length || !items.length) return;

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var value = button.getAttribute('data-filter');

        buttons.forEach(function (b) {
          b.setAttribute('aria-pressed', String(b === button));
        });

        items.forEach(function (item) {
          var match = value === 'all' || item.getAttribute('data-category') === value;
          item.classList.toggle('is-hidden', !match);
        });
      });
    });
  }


  /* ========================================================================
     Lightbox
     ======================================================================== */
  function initLightbox() {
    var box = $('#lightbox');
    var figures = $$('.gallery figure');
    if (!box || !figures.length) return;

    var media = $('#lightbox-media');
    var caption = $('#lightbox-caption');
    var close = $('#lightbox-close');
    var lastFocused = null;

    function open(figure) {
      lastFocused = document.activeElement;
      media.innerHTML = '';

      var img = $('img', figure);
      if (img) {
        var clone = document.createElement('img');
        clone.src = img.src;
        clone.alt = img.alt || '';
        media.appendChild(clone);
      } else {
        var ph = $('.ph', figure);
        if (ph) media.appendChild(ph.cloneNode(true));
      }

      caption.textContent = figure.getAttribute('data-caption') || '';
      box.setAttribute('data-open', 'true');
      box.removeAttribute('hidden');
      document.body.classList.add('is-locked');
      close.focus();
    }

    function shut() {
      box.setAttribute('data-open', 'false');
      document.body.classList.remove('is-locked');
      window.setTimeout(function () { box.setAttribute('hidden', ''); }, 220);
      if (lastFocused) lastFocused.focus();
    }

    figures.forEach(function (figure) {
      figure.addEventListener('click', function () { open(figure); });
      figure.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        open(figure);
      });
    });

    close.addEventListener('click', shut);
    box.addEventListener('click', function (e) { if (e.target === box) shut(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && box.getAttribute('data-open') === 'true') shut();
    });
  }


  /* ========================================================================
     Contact form — client-side validation only.
     No backend yet: the submit handler shows a notice instead of sending.
     ======================================================================== */
  /* ------------------------------------------------------------------
     Contact form

     The site is hosted as static files, so it cannot send mail by itself.
     Two modes:
       - CONTACT_ENDPOINT empty  : the form opens the visitor's mail client
                                   with everything already filled in.
       - CONTACT_ENDPOINT set    : the message is posted straight to the
                                   service (see GUIDE-EQUIPE.md, section 8)
                                   and nothing opens on the visitor's side.
     ------------------------------------------------------------------ */
  var CONTACT_EMAIL = 'ngolefona@gmail.com';
  var CONTACT_ENDPOINT = '';   // e.g. 'https://api.web3forms.com/submit'
  var CONTACT_KEY = '';        // access key supplied by that service

  function initForm() {
    var form = $('#contact-form');
    if (!form) return;

    var status = $('#form-status');

    var rules = {
      name: function (v) { return v.trim().length >= 2 ? '' : 'Please enter your name.'; },
      email: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
          ? '' : 'Please enter a valid email address.';
      },
      subject: function (v) { return v.trim().length >= 3 ? '' : 'Please enter a subject.'; },
      message: function (v) {
        return v.trim().length >= 10 ? '' : 'Please write at least 10 characters.';
      }
    };

    function check(field) {
      var rule = rules[field.name];
      if (!rule) return true;
      var error = rule(field.value);
      var slot = $('#error-' + field.name);
      field.setAttribute('aria-invalid', String(error !== ''));
      if (slot) slot.textContent = error;
      return error === '';
    }

    function say(text) {
      if (!status) return;
      status.textContent = text;
      status.setAttribute('data-visible', 'true');
    }

    $$('input, textarea', form).forEach(function (field) {
      field.addEventListener('blur', function () { check(field); });
      field.addEventListener('input', function () {
        if (field.getAttribute('aria-invalid') === 'true') check(field);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var ok = true;
      $$('input, textarea', form).forEach(function (field) {
        if (!check(field)) ok = false;
      });
      if (!ok) {
        var first = $('[aria-invalid="true"]', form);
        if (first) first.focus();
        return;
      }

      var data = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        subject: form.subject.value.trim(),
        message: form.message.value.trim()
      };

      /* Mode 2: a sending service is configured */
      if (CONTACT_ENDPOINT && CONTACT_KEY) {
        var button = $('button[type="submit"]', form);
        if (button) { button.disabled = true; button.textContent = 'Sending…'; }

        fetch(CONTACT_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: CONTACT_KEY,
            from_name: data.name,
            email: data.email,
            subject: '[lefona.org] ' + data.subject,
            message: data.message
          })
        }).then(function (r) {
          if (!r.ok) throw new Error(r.status);
          form.reset();
          say('Thank you — your message has been sent. We will get back to you shortly.');
        }).catch(function () {
          say('Sorry, the message could not be sent. Please write to ' + CONTACT_EMAIL + '.');
        }).then(function () {
          if (button) { button.disabled = false; button.textContent = 'Send message'; }
        });
        return;
      }

      /* Mode 1: no service yet — hand the message to the mail client */
      var subject = encodeURIComponent('[lefona] ' + data.subject);
      var body = encodeURIComponent(
        data.message + '\n\n--\n' + data.name + '\n' + data.email
      );
      window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + subject + '&body=' + body;
      say('Your email programme is opening with the message ready to send. '
        + 'If nothing happens, write to ' + CONTACT_EMAIL + '.');
    });
  }


  /* ========================================================================
     Language switcher + interface translation
     ======================================================================== */
  function applyInterface(lang) {
    var dict = UI[lang];

    $$('[data-i18n]').forEach(function (el) {
      if (dict) {
        // Hand-written translation available: use it and keep the machine
        // translator away from this element.
        var key = el.getAttribute('data-i18n');
        if (dict[key]) el.textContent = dict[key];
        el.setAttribute('translate', 'no');
        el.classList.add('notranslate');
      } else {
        // No hand-written translation for this language: let Google
        // Translate handle the element.
        el.removeAttribute('translate');
        el.classList.remove('notranslate');
      }
    });
  }

  function initLang() {
    var button = $('#lang-btn');
    var menu = $('#lang-menu');
    if (!button || !menu) return;

    var label = $('.lang__code', button);
    var lang = currentLang();

    function setLang(code) {
      var host = window.location.hostname;
      var value = code === 'en' ? '' : '/en/' + code;
      var scopes = ['', '; domain=' + host, '; domain=.' + host];

      scopes.forEach(function (scope) {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + scope;
      });

      if (value) {
        scopes.forEach(function (scope) {
          document.cookie = 'googtrans=' + value + '; path=/' + scope;
        });
      }

      window.location.reload();
    }

    if (label) label.textContent = lang.toUpperCase();

    $$('button[data-lang]', menu).forEach(function (b) {
      b.setAttribute('aria-current', String(b.getAttribute('data-lang') === lang));
      b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
    });

    button.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = menu.getAttribute('data-open') !== 'true';
      menu.setAttribute('data-open', String(open));
      button.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('click', function (e) {
      if (menu.contains(e.target) || e.target === button) return;
      menu.setAttribute('data-open', 'false');
      button.setAttribute('aria-expanded', 'false');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      menu.setAttribute('data-open', 'false');
      button.setAttribute('aria-expanded', 'false');
    });

    applyInterface(lang);
  }


  /* ========================================================================
     Boot
     ======================================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initReveal();
    initCounters();
    initFilters();
    initLightbox();
    initForm();
    initLang();
  });
}());


/* Called by the Google Translate script loaded at the end of each page. */
function googleTranslateElementInit() {
  /* eslint-disable no-new */
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    autoDisplay: false
  }, 'google-translate');
}
