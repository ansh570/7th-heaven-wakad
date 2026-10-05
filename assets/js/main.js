/**
 * 7th Heaven Wakad - Main Application Script
 * Animations, Navigation, Transitions, Counters, Shortcuts & Toasts
 * Location: Austin Plaza, Mhatoba Chowk, Kaspate Wasti, Wakad
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNavbar();
  initMobileMenu();
  initOwnerMobileAccess();
  initScrollAnimations();
  initCounters();
  initHeroParallax();
  initOwnerShortcut();
  renderDynamicElements();
});

/**
 * 1. Bakery Preloader Screen
 */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => preloader.remove(), 600);
      }, 350);
    });
    // Fallback timer if load event already fired or delayed
    setTimeout(() => {
      if (document.getElementById('preloader')) {
        preloader.classList.add('fade-out');
        setTimeout(() => preloader.remove(), 600);
      }
    }, 1200);
  }
}

/**
 * 2. Sticky Navbar Blur & Shrink on Scroll
 */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * 3. Mobile Hamburger Navigation
 */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = toggleBtn.classList.toggle('open');
    navMenu.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close when clicking a nav link
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.classList.remove('open');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/**
 * 4. Intersection Observer for Scroll Animations
 */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!revealElements.length) return;

  // Check prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealElements.forEach(el => el.classList.add('active'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  });

  revealElements.forEach(el => observer.observe(el));
}

/**
 * 5. Animated Number Counters
 */
function initCounters() {
  const counterEls = document.querySelectorAll('.counter-val');
  if (!counterEls.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target') || 0);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1600;
        const start = performance.now();

        const animate = (time) => {
          const progress = Math.min((time - start) / duration, 1);
          // EaseOutQuad
          const easeProgress = 1 - (1 - progress) * (1 - progress);
          const current = Math.floor(easeProgress * target);
          el.innerText = (target % 1 !== 0 ? (easeProgress * target).toFixed(1) : current.toLocaleString('en-IN')) + suffix;
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            el.innerText = target.toLocaleString('en-IN') + suffix;
          }
        };

        requestAnimationFrame(animate);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => observer.observe(el));
}

/**
 * 6. Subtle Parallax for Hero Visual
 */
function initHeroParallax() {
  const heroCard = document.querySelector('.hero-cake-card');
  if (!heroCard) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 992) return;

  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 16;
    const y = (e.clientY / window.innerHeight - 0.5) * 16;
    heroCard.style.transform = `translateY(${y * -0.5}px) rotateX(${y * -0.5}deg) rotateY(${x * 0.5}deg)`;
  }, { passive: true });
}

/**
 * 7. ALT + H Owner Dashboard Shortcut
 */
function initOwnerShortcut() {
  document.addEventListener('keydown', (e) => {
    if (e.altKey && (e.key === 'h' || e.key === 'H')) {
      e.preventDefault();
      showToast('Opening 7th Heaven Owner Portal...', 'info');
      setTimeout(() => {
        window.location.href = 'admin.html';
      }, 500);
    }
  });
}

/**
 * 8. Toast Notifications
 */
function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 25px;
      right: 25px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bg = type === 'success' ? '#25D366' : (type === 'error' ? '#d6334d' : 'var(--bg-elevated)');
  const color = type === 'success' ? '#fff' : '#fff';

  toast.style.cssText = `
    background: ${bg};
    color: ${color};
    padding: 12px 20px;
    border-radius: 12px;
    border: 1px solid rgba(223, 168, 95, 0.3);
    box-shadow: 0 10px 30px rgba(0,0,0,0.6);
    font-size: 0.92rem;
    font-weight: 600;
    max-width: 360px;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: auto;
  `;
  toast.innerText = message;
  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    setTimeout(() => toast.remove(), 350);
  }, 3500);
}

window.showToast = showToast;

/**
 * 9. Render Dynamic Footer & Info from Config
 */
function renderDynamicElements() {
  const cfg = window.BUSINESS_CONFIG;
  if (!cfg) return;

  // Insert dynamic phone / whatsapp into any marked elements
  document.querySelectorAll('[data-business-phone]').forEach(el => {
    el.innerText = cfg.phoneDisplay;
  });
  document.querySelectorAll('[data-business-address]').forEach(el => {
    el.innerText = cfg.address.full;
  });
  document.querySelectorAll('[data-business-hours]').forEach(el => {
    el.innerText = cfg.openingHours.display;
  });
}

/**
 * 10. Owner Mobile & Desktop Quick Login Access
 */
function initOwnerMobileAccess() {
  // If we are already on admin.html, don't inject
  if (window.location.pathname.endsWith('admin.html')) return;

  // 1. Inject or ensure .btn-owner-nav is in .nav-actions
  const navActions = document.querySelector('.nav-actions');
  if (navActions && !navActions.querySelector('.btn-owner-nav')) {
    const ownerNavBtn = document.createElement('a');
    ownerNavBtn.href = 'admin.html';
    ownerNavBtn.className = 'btn-owner-nav';
    ownerNavBtn.title = 'Owner Login Portal';
    ownerNavBtn.setAttribute('aria-label', 'Owner Login');
    ownerNavBtn.innerHTML = '<span class="owner-icon">🔐</span><span class="owner-text">Owner</span>';
    const orderBtn = document.getElementById('nav-order-btn') || navActions.firstElementChild;
    navActions.insertBefore(ownerNavBtn, orderBtn);
  }

  // 2. Inject or ensure Owner card inside mobile drawer .nav-menu
  const navMenu = document.getElementById('nav-menu');
  if (navMenu && !navMenu.querySelector('.nav-mobile-owner-item')) {
    const ownerLi = document.createElement('li');
    ownerLi.className = 'nav-mobile-owner-item';
    ownerLi.innerHTML = `
      <a href="admin.html" class="nav-mobile-owner-card">
        <span class="nav-mobile-owner-icon">🔐</span>
        <div class="nav-mobile-owner-info">
          <span class="nav-mobile-owner-title">Owner Login Portal</span>
          <span class="nav-mobile-owner-desc">Manage Cakes, Prices & Offers</span>
        </div>
      </a>
    `;
    navMenu.appendChild(ownerLi);
  }

  // 3. Floating Quick Login Pill for Mobile screens
  if (!document.getElementById('mobile-floating-owner')) {
    const floatBtn = document.createElement('a');
    floatBtn.id = 'mobile-floating-owner';
    floatBtn.href = 'admin.html';
    floatBtn.className = 'mobile-floating-owner';
    floatBtn.title = 'Owner Login';
    floatBtn.setAttribute('aria-label', 'Owner Login');
    floatBtn.innerHTML = '<span>🔐</span><span>Owner Login</span>';
    document.body.appendChild(floatBtn);
  }
}

