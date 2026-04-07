/* =====================================================
   Artist detail pages — JS
   ===================================================== */

// ── Language toggle ──────────────────────────────────
const LANG_KEY = 'af-lang';

function applyLang(lang) {
  document.querySelectorAll('[data-es]').forEach(el => {
    el.textContent = lang === 'en' ? el.dataset.en : el.dataset.es;
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  localStorage.setItem(LANG_KEY, lang);
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});

// Apply saved language on load
applyLang(localStorage.getItem(LANG_KEY) || 'es');

// ── Header scroll style ───────────────────────────────
// Header already has class "scrolled" in HTML; nothing to do.
// But keep scroll listener in case markup changes:
const header = document.getElementById('site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

// ── GSAP fade-in ─────────────────────────────────────
window.addEventListener('load', () => {
  if (typeof gsap === 'undefined') return;

  gsap.fromTo('.artist-header',
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.1 }
  );
  gsap.fromTo('.artist-bio p',
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.12, delay: 0.35 }
  );
});
