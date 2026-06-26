'use strict';

const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => scope.querySelectorAll(selector);

(function initStickyNav() {
    const header = qs('#site-header');
    if (!header) return;

    const THRESHOLD = 60;

    function updateHeader() {
        if (window.scrollY > THRESHOLD) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
})();

(function initHamburger() {
    const burger     = qs('#burger-btn');
    const navLinks   = qs('#nav-links');
    const navItems   = qsa('.nav__link', navLinks);

    if (!burger || !navLinks) return;

    function openMenu() {
        burger.classList.add('active');
        navLinks.classList.add('is-open');
        burger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        burger.classList.remove('active');
        navLinks.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    burger.addEventListener('click', () => {
        const isOpen = navLinks.classList.contains('is-open');
        isOpen ? closeMenu() : openMenu();
    });

    navItems.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
            closeMenu();
            burger.focus();
        }
    });
})();

(function initSmoothScroll() {
    const NAV_HEIGHT = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '76',
        10
    );

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        const targetId = link.getAttribute('href').slice(1);
        if (!targetId) return;

        const target = document.getElementById(targetId);
        if (!target) return;

        e.preventDefault();

        const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;

        window.scrollTo({ top, behavior: 'smooth' });
    });
})();

(function initRevealAnimations() {
    const revealEls = qsa('.reveal-up, .reveal-right');
    if (!revealEls.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        revealEls.forEach(el => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        }
    );

    revealEls.forEach(el => observer.observe(el));
})();

(function initHeroParallax() {
    const heroImg = qs('.hero__bg-img');
    if (!heroImg) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let rafId = null;
    let currentY = 0;
    let targetY = 0;

    function updateParallax() {
        const scrollY   = window.scrollY;
        const heroHeight = heroImg.closest('.hero').offsetHeight;

        if (scrollY > heroHeight) {
            rafId = null;
            return;
        }

        targetY = scrollY * 0.35;
        currentY += (targetY - currentY) * 0.08;

        heroImg.style.transform = `translateY(${currentY}px) scale(1.1)`;
        rafId = requestAnimationFrame(updateParallax);
    }

    window.addEventListener('scroll', () => {
        if (!rafId) {
            rafId = requestAnimationFrame(updateParallax);
        }
    }, { passive: true });
})();

(function initScrollspy() {
    const sections  = qsa('main section[id]');
    const navLinks  = qsa('.nav__link:not(.nav__link--cta)');

    if (!sections.length || !navLinks.length) return;

    const NAV_HEIGHT = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '76',
        10
    );

    function getActiveSection() {
        let active = null;

        sections.forEach(section => {
            const top = section.getBoundingClientRect().top;
            if (top <= NAV_HEIGHT + 60) {
                active = section.id;
            }
        });

        return active;
    }

    function updateActiveLink() {
        const activeId = getActiveSection();

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${activeId}`) {
                link.style.color = '';
                link.classList.add('nav__link--active');
            } else {
                link.classList.remove('nav__link--active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
})();

(function initBackToTop() {
    const btn = qs('#back-to-top');
    if (!btn) return;

    const SHOW_AFTER = 400;

    function toggleBtn() {
        if (window.scrollY > SHOW_AFTER) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', toggleBtn, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    toggleBtn();
})();

(function initCtaPills() {
    const pills = qsa('.cta-pill');
    pills.forEach((pill, i) => {
        pill.style.transitionDelay = `${i * 0.06}s`;
    });
})();

(function addActiveLinkStyles() {
    const style = document.createElement('style');
    style.textContent = `
    .nav__link--active::after {
      transform: scaleX(1) !important;
    }
    .site-header.scrolled .nav__link--active {
      color: var(--clr-garnet) !important;
    }
  `;
    document.head.appendChild(style);
})();

console.log('%c🇨🇿 Česká republika — Srdce Evropy', 'color:#6B1E3A; font-size:14px; font-weight:bold;');