/*
 * ============================================================
 *  ETHAN POPPLE — PERSONAL AVIATION WEBSITE
 *  script.js
 * ============================================================
 *
 *  WHAT THIS FILE DOES
 *  -------------------
 *  1. Sticky nav — adds a background when the user scrolls down
 *  2. Mobile hamburger — opens/closes the nav on small screens
 *  3. Smooth scroll — scrolls to sections when nav links are clicked
 *  4. Active nav highlight — gold-colours the current section's link
 *  5. Scroll-reveal — fades content up as the user scrolls into it
 *  6. Stat counters — animates the numbers in the About section
 *  7. Star-field canvas — animated stars in the hero background
 *
 *  You generally won't need to edit this file unless you add
 *  new sections (add the section id to the SECTIONS array near
 *  the bottom of the file) or change the nav link structure.
 *
 * ============================================================
 */


/* ── 1. STICKY NAV ─────────────────────────────────────────── */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });


/* ── 2. MOBILE HAMBURGER ───────────────────────────────────── */
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

navToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  // Animate the hamburger bars into an X
  navToggle.querySelectorAll('span')[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,5px)' : '';
  navToggle.querySelectorAll('span')[1].style.opacity  = isOpen ? '0' : '';
  navToggle.querySelectorAll('span')[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
});

// Close nav when any link is clicked
navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle?.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});


/* ── 3. SMOOTH SCROLL ──────────────────────────────────────── */
// Offset accounts for the 64px fixed nav bar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ── 4. ACTIVE NAV HIGHLIGHT ──────────────────────────────── */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navAnchors.forEach(a => {
      const matches = a.getAttribute('href') === `#${entry.target.id}`;
      // Don't override the gold hire pill styling
      if (!a.classList.contains('nav-hire')) {
        a.style.color = matches ? 'var(--text)' : '';
      }
    });
  });
}, {
  rootMargin: '-45% 0px -45% 0px',
  threshold: 0,
});

sections.forEach(s => sectionObserver.observe(s));


/* ── 5. SCROLL-REVEAL ─────────────────────────────────────── */
// Any element with class="reveal" fades up when it enters the viewport.
// Add class="reveal delay-1" through "delay-6" for staggered entrance.
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target); // only animate once
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px',
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ── 6. ANIMATED STAT COUNTERS ────────────────────────────── */
// Elements with data-count="200" data-suffix="+" will count up to their value.
function animateCounter(el) {
  const target   = parseFloat(el.dataset.count);
  const suffix   = el.dataset.suffix || '';
  const duration = 1500; // ms
  const start    = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(target * eased) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));


/* ── 7. STAR-FIELD CANVAS ─────────────────────────────────── */
// Draws slowly drifting stars in the hero section background.
(function initStarField() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let stars  = [];
  let animId;

  function resize() {
    canvas.width  = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    buildStars();
  }

  function buildStars() {
    const density = Math.floor((canvas.width * canvas.height) / 4800);
    stars = Array.from({ length: density }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     Math.random() * 1.15 + 0.2,
      alpha: Math.random(),
      dA:    (Math.random() - 0.5) * 0.007, // twinkle speed
      vy:    Math.random() * 0.012 + 0.004,  // drift upward
    }));
  }

  function drawFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const s of stars) {
      // Twinkle
      s.alpha += s.dA;
      if (s.alpha > 1 || s.alpha < 0) s.dA *= -1;

      // Drift upward, wrap around
      s.y -= s.vy;
      if (s.y < 0) {
        s.y = canvas.height;
        s.x = Math.random() * canvas.width;
      }

      // Occasional gold star
      const isGold = Math.random() > 0.985;
      const colour = isGold ? `rgba(200,169,110,${s.alpha * 0.65})` : `rgba(180,200,235,${s.alpha * 0.5})`;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = colour;
      ctx.fill();
    }

    animId = requestAnimationFrame(drawFrame);
  }

  // Use ResizeObserver to keep canvas in sync with hero size
  new ResizeObserver(() => {
    cancelAnimationFrame(animId);
    resize();
    drawFrame();
  }).observe(canvas.parentElement);

  resize();
  drawFrame();
}());


/* ── 8. DYNAMIC AGE ───────────────────────────────────────── */
// Calculates Ethan's current age from his date of birth (19 May 2006).
// Updates automatically each year — no manual changes needed.
function calculateAge() {
  const dob = new Date(2006, 4, 19);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  document.getElementById('ethan-age').textContent = age;
}

document.addEventListener('DOMContentLoaded', calculateAge);
