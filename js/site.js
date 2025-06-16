(function() {
  document.addEventListener('DOMContentLoaded', () => {
    initSectionObserver();
    initMobileMenu();
    highlightCurrentNav();
    initDarkMode();
  });

  function initSectionObserver() {
    if (!('IntersectionObserver' in window)) return;
    const sections = document.querySelectorAll('section');
    if (!sections.length) return;
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    sections.forEach(sec => observer.observe(sec));
  }

  function initMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const menu = document.querySelector('.mobile-menu');
    const closeBtn = document.querySelector('.mobile-menu-close');
    if (!btn || !menu) return;
    const toggle = () => {
      menu.classList.toggle('active');
      document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    };
    btn.addEventListener('click', toggle);
    closeBtn && closeBtn.addEventListener('click', toggle);
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
    document.addEventListener('click', e => {
      if (menu.classList.contains('active') && !menu.contains(e.target) && !btn.contains(e.target)) {
        toggle();
      }
    });
  }

  function highlightCurrentNav() {
    const current = window.location.pathname;
    document.querySelectorAll('.navbar a, .mobile-menu a').forEach(link => {
      const href = link.getAttribute('href');
      if (current.endsWith(href) || (current.endsWith('/') && href === 'index.html')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  function initDarkMode() {
    const toggleBtn = document.getElementById('toggle-dark');
    const icon = document.getElementById('theme-icon');
    const socialIcons = {
      gmail: document.querySelector('a[href*="mailto"] img'),
      github: document.querySelector('a[href*="github"] img'),
      linkedin: document.querySelector('a[href*="linkedin"] img')
    };
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');
    const startDark = storedTheme === 'dark' || (!storedTheme && prefersDark);
    document.body.classList.toggle('dark-mode', startDark);
    updateIcon(startDark);

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateIcon(isDark);
      });
    }

    function updateIcon(isDark) {
      if (icon) {
        icon.innerHTML = isDark
          ? `<circle cx="12" cy="12" r="10"></circle><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"></path>`
          : `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
      }
      Object.values(socialIcons).forEach(img => {
        if (img) {
          const src = img.getAttribute('src');
          img.setAttribute('src', isDark ? src.replace('.black.svg', '.white.svg') : src.replace('.white.svg', '.black.svg'));
        }
      });
    }
  }
})();
