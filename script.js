const menuButton = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = Array.from(document.querySelectorAll('.site-nav a'));
const sections = Array.from(document.querySelectorAll('main section[id]'));
const revealElements = Array.from(document.querySelectorAll('.reveal'));

if (menuButton && siteNav) {
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    siteNav.classList.toggle('open');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

function showAllReveals() {
  revealElements.forEach((element) => element.classList.add('show'));
}

function setupRevealAnimations() {
  if (!revealElements.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || !('IntersectionObserver' in window)) {
    showAllReveals();
    return;
  }

  revealElements.forEach((element, index) => {
    element.style.setProperty('--reveal-delay', `${Math.min(index * 70, 420)}ms`);
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -8% 0px'
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

setupRevealAnimations();

function setActiveNav() {
  const midpoint = window.scrollY + window.innerHeight * 0.35;

  let current = sections[0]?.id || '';
  for (const section of sections) {
    if (midpoint >= section.offsetTop) {
      current = section.id;
    }
  }

  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${current}`;
    link.classList.toggle('active', isActive);
  });
}

setActiveNav();
window.addEventListener('scroll', setActiveNav, { passive: true });
window.addEventListener('resize', setActiveNav);

document.getElementById('year').textContent = new Date().getFullYear();
