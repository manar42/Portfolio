/* ============================================================
   PORTFOLIO SCRIPT — Manar Salah
   Role Switcher | Trio Stage | Filters | Lightbox | 
   Scroll Reveal | Counter Animations | Header Scroll
   ============================================================ */

'use strict';

// ============================================================
// ROLE SWITCHER — ecosystem card tabs
// ============================================================
document.querySelectorAll('.role-switcher').forEach(switcher => {
  switcher.addEventListener('click', e => {
    const tab = e.target.closest('.role-tab');
    if (!tab) return;

    const card = switcher.closest('.ecosystem-card');
    const role = tab.dataset.role;

    // Update active tab
    switcher.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Update active panel
    card.querySelectorAll('.role-panel').forEach(p => p.classList.remove('active'));
    const target = card.querySelector(`.role-panel[data-role="${role}"]`);
    if (target) target.classList.add('active');
  });
});





// ============================================================
// LIGHTBOX MODAL
// ============================================================
const lightboxModal   = document.getElementById('lightboxModal');
const lightboxImg     = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose   = document.getElementById('lightboxClose');

function openLightbox(src, caption) {
  if (!lightboxModal) return;
  lightboxImg.src            = src;
  lightboxCaption.textContent = caption;
  lightboxModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightboxModal) return;
  lightboxModal.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { if (lightboxImg) lightboxImg.src = ''; }, 300);
}

// Attach lightbox to phone & web mockups
document.querySelectorAll('.phone-mockup, .web-mockup').forEach(mockup => {
  mockup.addEventListener('click', () => {
    const img     = mockup.querySelector('.phone-screen img, .web-screen img');
    const caption = mockup.dataset.caption || '';
    if (img) openLightbox(img.src, caption);
  });
});



if (lightboxClose)   lightboxClose.addEventListener('click', closeLightbox);
if (lightboxModal)   lightboxModal.addEventListener('click', e => { if (e.target === lightboxModal) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ============================================================
// SCROLL REVEAL — Intersection Observer
// ============================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.07,
  rootMargin: '0px 0px -30px 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ============================================================
// COUNTER ANIMATIONS — metric numbers
// ============================================================
function animateCounter(el, target, duration) {
  duration = duration || 1800;
  const startTime = performance.now();

  const update = (currentTime) => {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.target, 10);
      if (!isNaN(target)) animateCounter(entry.target, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.count-up').forEach(el => counterObserver.observe(el));

// ============================================================
// STICKY HEADER — scroll depth styling
// ============================================================
const siteHeader = document.querySelector('.site-header');

if (siteHeader) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      siteHeader.style.background      = 'rgba(7, 4, 6, 0.97)';
      siteHeader.style.borderBottomColor = 'rgba(184, 51, 80, 0.28)';
      siteHeader.style.boxShadow        = '0 4px 30px rgba(0,0,0,0.5)';
    } else {
      siteHeader.style.background      = 'rgba(13, 7, 10, 0.85)';
      siteHeader.style.borderBottomColor = 'rgba(184, 51, 80, 0.16)';
      siteHeader.style.boxShadow        = 'none';
    }
  }, { passive: true });
}

// ============================================================
// SMOOTH ACTIVE NAV LINK — highlight current section
// ============================================================
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = document.querySelectorAll('section[id]');

if (navLinks.length && sections.length) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${entry.target.id}`
            ? 'var(--text-primary)'
            : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => navObserver.observe(s));
}

// ============================================================
// SCROLL PROGRESS BAR
// ============================================================
const progressBar = document.getElementById('scroll-progress');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (totalScroll > 0) {
      const scrollPercent = (window.scrollY / totalScroll) * 100;
      progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
    }
  }, { passive: true });
}

// ============================================================
// MOUSE SPOTLIGHT ON CARDS (THROTTLED VIA RAF)
// ============================================================
const interactiveCards = document.querySelectorAll('.ecosystem-card, .skill-module-card, .skill-card');
interactiveCards.forEach(card => {
  let rafId = null;
  card.addEventListener('mousemove', e => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      rafId = null;
    });
  }, { passive: true });
});

// ============================================================
// COPY EMAIL TO CLIPBOARD
// ============================================================
const copyEmailBtn = document.getElementById('copyEmailBtn');
if (copyEmailBtn) {
  copyEmailBtn.addEventListener('click', async () => {
    const email = copyEmailBtn.dataset.email || 'manarsalah3200@gmail.com';
    const textSpan = copyEmailBtn.querySelector('.copy-text');
    try {
      await navigator.clipboard.writeText(email);
      copyEmailBtn.classList.add('copied');
      if (textSpan) textSpan.textContent = 'Copied!';
      setTimeout(() => {
        copyEmailBtn.classList.remove('copied');
        if (textSpan) textSpan.textContent = 'Copy';
      }, 2200);
    } catch (err) {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = email;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      copyEmailBtn.classList.add('copied');
      if (textSpan) textSpan.textContent = 'Copied!';
      setTimeout(() => {
        copyEmailBtn.classList.remove('copied');
        if (textSpan) textSpan.textContent = 'Copy';
      }, 2200);
    }
  });
}

