/* =====================================================
   El diario de Ana Frank — Dossier Digital
   ===================================================== */
(function () {
  'use strict';

  // ── Language ──────────────────────────────────────
  let lang = localStorage.getItem('dossier-lang') || 'es';

  function applyLang(l) {
    lang = l;
    localStorage.setItem('dossier-lang', l);
    document.documentElement.lang = l;

    document.querySelectorAll('[data-es]').forEach(el => {
      const txt = el.getAttribute('data-' + l);
      if (txt !== null) el.textContent = txt;
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === l);
    });
  }

  document.querySelectorAll('.lang-btn').forEach(btn =>
    btn.addEventListener('click', () => applyLang(btn.dataset.lang))
  );

  applyLang(lang);

  // ── Mobile menu ──────────────────────────────────
  const menuBtn   = document.getElementById('menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  if (menuBtn && mobileNav) {
    function closeMenu() {
      menuBtn.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      menuBtn.classList.toggle('open', isOpen);
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      mobileNav.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) closeMenu();
    });
  }

  // ── Header scroll ────────────────────────────────
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ── Obra tabs ────────────────────────────────────
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      document.querySelectorAll('.tab-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.tab === target)
      );
      document.querySelectorAll('.tab-panel').forEach(p =>
        p.classList.toggle('active', p.dataset.panel === target)
      );
    });
  });

  // ── Lightbox ─────────────────────────────────────
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightbox-img');
  const lbClose      = document.getElementById('lightbox-close');
  const lbPrev       = document.getElementById('lightbox-prev');
  const lbNext       = document.getElementById('lightbox-next');

  const galleryImgs = Array.from(
    document.querySelectorAll('.gallery-item img')
  );
  let lbIndex = 0;

  function openLightbox(index) {
    lbIndex = index;
    lightboxImg.src = galleryImgs[lbIndex].src;
    lightboxImg.alt = galleryImgs[lbIndex].alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showPrev() {
    lbIndex = (lbIndex - 1 + galleryImgs.length) % galleryImgs.length;
    lightboxImg.src = galleryImgs[lbIndex].src;
  }

  function showNext() {
    lbIndex = (lbIndex + 1) % galleryImgs.length;
    lightboxImg.src = galleryImgs[lbIndex].src;
  }

  galleryImgs.forEach((img, i) =>
    img.closest('.gallery-item').addEventListener('click', () => openLightbox(i))
  );

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  lbPrev.addEventListener('click', e => { e.stopPropagation(); showPrev(); });
  lbNext.addEventListener('click', e => { e.stopPropagation(); showNext(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  // ── Smooth scroll for nav links ──────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── GSAP animations ──────────────────────────────
  if (typeof gsap === 'undefined') return;

  document.documentElement.classList.add('js-ready');
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance
  const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.2 });

  heroTL
    .to('.hero-eyebrow',  { opacity: 1, duration: 0.8, ease: 'power2.out' })
    .to('.hero-title',    { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, '-=0.4')
    .to('.hero-composer', { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.4')
    .to('.hero-cast',     { opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.5')
    .to('.scroll-cue',    { opacity: 1, duration: 0.9 }, '-=0.3');

  // Hero parallax
  gsap.to('.hero-img', {
    yPercent: 18,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

  // Section reveals
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 86%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Section rules draw in
  gsap.utils.toArray('.section-rule').forEach(rule => {
    gsap.from(rule, {
      scaleX: 0,
      transformOrigin: 'left center',
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: rule, start: 'top 88%' },
    });
  });

  // Team cards stagger
  gsap.from('.team-card', {
    opacity: 0,
    y: 36,
    duration: 0.75,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.team-grid',
      start: 'top 82%',
      toggleActions: 'play none none none',
    },
  });

  // Gallery items stagger
  gsap.from('.gallery-item', {
    opacity: 0,
    scale: 0.97,
    duration: 0.7,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.gallery-grid',
      start: 'top 84%',
      toggleActions: 'play none none none',
    },
  });

  // Ficha table rows
  gsap.from('.ficha-table tr', {
    opacity: 0,
    x: -16,
    duration: 0.55,
    stagger: 0.08,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.ficha-table',
      start: 'top 82%',
      toggleActions: 'play none none none',
    },
  });

  // Cache card pulse in
  gsap.from('.cache-card', {
    opacity: 0,
    scale: 0.94,
    duration: 0.8,
    ease: 'back.out(1.5)',
    scrollTrigger: { trigger: '.cache-card', start: 'top 85%' },
  });

})();
