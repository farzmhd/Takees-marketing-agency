/**
 * TAKEES MARKETING - MAIN JAVASCRIPT
 * Vanilla JS logic for interactions, navigation, accordions, and form validation
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavigation();
  initFaqAccordion();
  initFormValidation();
  initSmoothScroll();
  initBlogFilter();

  // Premium Marketing Agency Motion Suite
  initHeroHeadlineReveal();
  initHeroBackgroundAccents();
  initHeroImageMotion();
  initHeroBannerParallax();
  initNumberCounters();
  initScrollReveals();
  initParallaxEffects();
});

/**
 * Persistent color theme toggle with direction-aware navbar visibility.
 */
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  const root = document.documentElement;
  let transitionTimer;
  let previousScrollY = window.scrollY;
  let scrollDirection = 0;
  let directionDistance = 0;
  let scrollFrame = 0;

  const applyTheme = (theme, save = true) => {
    const isDark = theme === 'dark';
    root.classList.add('theme-transition');

    if (isDark) {
      root.dataset.theme = 'dark';
    } else {
      delete root.dataset.theme;
    }

    toggle.setAttribute('aria-pressed', String(isDark));
    toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');

    if (save) {
      try {
        localStorage.setItem('takees-theme', isDark ? 'dark' : 'light');
      } catch {
        // Keep the current-page theme when storage is unavailable.
      }
    }

    window.clearTimeout(transitionTimer);
    transitionTimer = window.setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 420);
  };

  applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light', false);

  toggle.addEventListener('click', () => {
    applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  toggle.addEventListener('keydown', event => {
    if (event.key === 'Escape') toggle.blur();
  });

  window.addEventListener('scroll', () => {
    if (scrollFrame) return;

    scrollFrame = window.requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - previousScrollY;
      previousScrollY = currentScrollY;

      if (currentScrollY <= 32) {
        toggle.classList.remove('is-scroll-hidden');
        scrollDirection = 0;
        directionDistance = 0;
      } else if (Math.abs(delta) >= 2) {
        const nextDirection = Math.sign(delta);

        if (nextDirection !== scrollDirection) {
          scrollDirection = nextDirection;
          directionDistance = delta;
        } else {
          directionDistance += delta;
        }

        if (directionDistance >= 12) {
          toggle.classList.add('is-scroll-hidden');
        } else if (directionDistance <= -12) {
          toggle.classList.remove('is-scroll-hidden');
        }
      }

      scrollFrame = 0;
    });
  }, { passive: true });
}

/**
 * Blog Category Filter
 */
function initBlogFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const blogCards = document.querySelectorAll('.blog-card');

  if (!filterBtns.length || !blogCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      blogCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Navigation & Mobile Drawer
 */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile drawer toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      menuToggle.classList.toggle('is-active', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile menu when clicking any link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('is-open')) {
          navMenu.classList.remove('is-open');
          menuToggle.classList.remove('is-active');
          menuToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('is-open') && 
          !navMenu.contains(e.target) && 
          !menuToggle.contains(e.target)) {
        navMenu.classList.remove('is-open');
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // Active state highlighting based on current page
  highlightActiveNav();
}

function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * FAQ Accordion
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other accordion items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('active', !isActive);
      questionBtn.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
    });
  });
}

/**
 * Front-end Contact Form Validation
 */
function initFormValidation() {
  const forms = document.querySelectorAll('.contact-form, #heroForm, #contactPageForm');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('input[name="name"], #fullName, #name');
      const phoneInput = form.querySelector('input[name="phone"], #phone');
      const emailInput = form.querySelector('input[name="email"], #email');
      const feedbackEl = form.querySelector('.form-feedback') || createFeedbackEl(form);

      let isValid = true;
      let errorMessage = '';

      // Validate Name
      if (nameInput && !nameInput.value.trim()) {
        isValid = false;
        errorMessage = 'Please enter your full name.';
        nameInput.focus();
      }
      // Validate Phone (at least 8 digits)
      else if (phoneInput && !validatePhone(phoneInput.value.trim())) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number (min 8 digits).';
        phoneInput.focus();
      }
      // Validate Email (if present)
      else if (emailInput && !validateEmail(emailInput.value.trim())) {
        isValid = false;
        errorMessage = 'Please enter a valid email address.';
        emailInput.focus();
      }

      if (!isValid) {
        feedbackEl.className = 'form-feedback error';
        feedbackEl.textContent = errorMessage;
        feedbackEl.style.display = 'block';
        return;
      }

      // Success simulation with user feedback
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : 'Submit';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
        feedbackEl.className = 'form-feedback success';
        feedbackEl.textContent = 'Thank you! Your message has been received. Our team will contact you shortly.';
        feedbackEl.style.display = 'block';
        form.reset();

        setTimeout(() => {
          feedbackEl.style.display = 'none';
        }, 6000);
      }, 700);
    });
  });
}

function createFeedbackEl(form) {
  const div = document.createElement('div');
  div.className = 'form-feedback';
  form.appendChild(div);
  return div;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  // Allow optional +, digits, spaces, hyphens, min 8 digits
  const clean = phone.replace(/[\s\-\(\)]/g, '');
  return /^\+?[0-9]{8,15}$/.test(clean);
}

/**
 * Smooth scrolling
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/**
 * ==========================================================================
 * PREMIUM MARKETING AGENCY MOTION SUITE
 * ==========================================================================
 */

/**
 * 1. Hero Headline Word-by-Word Reveal & Upward Fade
 */
function initHeroHeadlineReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const heroHeadings = Array.from(document.querySelectorAll('.hero-heading, .dark-hero .section-title'))
    .filter(heading => !heading.closest('.home-hero'));
  if (!heroHeadings.length) return;

  heroHeadings.forEach(heading => {
    if (heading.dataset.wordWrapped) return;
    heading.dataset.wordWrapped = 'true';

    // Preserve child elements or split text cleanly
    const nodes = Array.from(heading.childNodes);
    let wordCounter = 0;
    const fragment = document.createDocumentFragment();

    nodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = node.textContent.split(/(\s+)/);
        words.forEach(word => {
          if (word.trim().length === 0) {
            fragment.appendChild(document.createTextNode(word));
          } else {
            const wrap = document.createElement('span');
            wrap.className = 'word-wrap';
            const inner = document.createElement('span');
            inner.className = 'word-inner';
            inner.style.setProperty('--word-idx', wordCounter++);
            inner.textContent = word;
            wrap.appendChild(inner);
            fragment.appendChild(wrap);
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
        fragment.appendChild(node.cloneNode(true));
      } else {
        const wrap = document.createElement('span');
        wrap.className = 'word-wrap';
        const inner = document.createElement('span');
        inner.className = 'word-inner';
        inner.style.setProperty('--word-idx', wordCounter++);
        inner.innerHTML = node.outerHTML;
        wrap.appendChild(inner);
        fragment.appendChild(wrap);
      }
    });

    heading.innerHTML = '';
    heading.appendChild(fragment);

    requestAnimationFrame(() => {
      heading.classList.add('is-revealed');
    });
  });
}

/**
 * 2. Hero Background Glow
 */
function initHeroBackgroundAccents() {
  const heroes = document.querySelectorAll('.home-hero, .dark-hero');
  if (!heroes.length) return;

  heroes.forEach(hero => {
    // Subtle animated radial purple glow orb (kept on all hero sections)
    if (!hero.querySelector('.hero-bg-glow')) {
      const glow = document.createElement('div');
      glow.className = 'hero-bg-glow';
      glow.setAttribute('aria-hidden', 'true');
      hero.prepend(glow);
    }
  });
}

/**
 * 3. Count-up Animation for Statistics & Achievements
 */
function initNumberCounters() {
  const statCards = document.querySelectorAll('.stat-card, .achievement-card, .counter-item, .stat-number');
  if (!statCards.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const numEl = card.classList.contains('stat-number') ? card : card.querySelector('.stat-number, .achievement-number, .counter-number');
        if (numEl && !numEl.dataset.counted) {
          numEl.dataset.counted = 'true';
          animateCountUp(numEl);
        }
        obs.unobserve(card);
      }
    });
  }, { threshold: 0.15 });

  statCards.forEach(card => observer.observe(card));
}

function animateCountUp(el) {
  const originalText = el.textContent.trim();
  const match = originalText.match(/^([^\d]*)([\d,.]+)([^\d]*)$/);
  if (!match) return;

  const prefix = match[1] || '';
  const rawNumber = parseFloat(match[2].replace(/,/g, ''));
  const suffix = match[3] || '';
  const isDecimal = match[2].includes('.');

  if (isNaN(rawNumber)) return;

  const duration = 1300;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const currentValue = rawNumber * easeProgress;

    const formattedValue = isDecimal ? currentValue.toFixed(1) : Math.floor(currentValue).toLocaleString();
    el.textContent = `${prefix}${formattedValue}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = originalText;
    }
  }

  requestAnimationFrame(update);
}

/**
 * 4. Staggered Scroll Entrance Animations for Cards & Headings
 */
function initScrollReveals() {
  const revealElements = document.querySelectorAll(`
    .feature-card,
    .service-card,
    .service-detail-card,
    .service-item-box,
    .blog-card,
    .team-card,
    .stat-card,
    .achievement-card,
    .discipline-item,
    .ai-directory-card,
    .founder-wrap,
    .contact-card,
    .section-title-wrap,
    .why-takees-header,
    .disciplines-header,
    .prompt-col-title,
    .ai-prompt-studio-card,
    .contact-benefit-card,
    .clients-title,
    .client-logo
  `);

  if (!revealElements.length) return;

  // Compute staggered delay index per grid container
  const gridContainers = document.querySelectorAll('.cards-grid-4, .team-grid, .stats-grid-5, .disciplines-row, .ai-catalog-grid, .blog-grid, .services-grid, .services-grid-8, .contact-benefits-grid-4, .blogs-grid-3, .bangalore-process-grid, .clients-logo-row');
  gridContainers.forEach(container => {
    Array.from(container.children).forEach((child, idx) => {
      child.style.setProperty('--stagger-index', container.classList.contains('clients-logo-row') ? idx : idx % 6);
    });
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/**
 * 5. Parallax Scroll Movement for Visual Cards & Images
 */
function initParallaxEffects() {
  const parallaxEls = document.querySelectorAll('.founder-img-box, .prompt-image-container, .achievement-img-box');
  if (!parallaxEls.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const winHeight = window.innerHeight;
        parallaxEls.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.top < winHeight && rect.bottom > 0) {
            const centerY = rect.top + rect.height / 2;
            const offset = (centerY - winHeight / 2) * -0.04;
            el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
          }
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

function initHeroImageMotion() {
  const hero = document.querySelector('.home-hero');
  if (!hero) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heading = hero.querySelector('.hero-heading');
  if (!reducedMotion && heading) {
    const updateHeadingLines = () => {
      const lineCount = wrapHomeHeroHeadingByLine(heading);
      const headingDelay = 800;
      const lineStagger = 120;
      const transitionDuration = 800;
      const descriptionDelay = headingDelay + (lineCount - 1) * lineStagger + transitionDuration + 80;

      hero.style.setProperty('--hero-description-delay', `${descriptionDelay}ms`);
      hero.style.setProperty('--hero-button-delay', `${descriptionDelay + transitionDuration + 120}ms`);
    };

    updateHeadingLines();
    let resizeFrame = 0;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(updateHeadingLines);
    }, { passive: true });
  }

  const revealHero = () => {
    hero.classList.remove('is-hero-reveal-pending');
    hero.classList.add('is-hero-revealed');
  };

  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealHero();
  } else {
    hero.classList.add('is-hero-reveal-pending');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          revealHero();
          obs.unobserve(hero);
        }
      });
    }, { threshold: 0.12 });
    observer.observe(hero);
  }
}

function initHeroBannerParallax() {
  const banner = document.querySelector('#homeHero .hero-brand-card');
  const image = banner?.querySelector('.hero-brand-image');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!banner || !image || !finePointer || reducedMotion) return;

  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;

  banner.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;

    pointerX = event.clientX;
    pointerY = event.clientY;
    if (frame) return;

    frame = requestAnimationFrame(() => {
      frame = 0;
      const bounds = banner.getBoundingClientRect();
      const offsetX = ((pointerX - bounds.left) / bounds.width - 0.5) * 10;
      const offsetY = ((pointerY - bounds.top) / bounds.height - 0.5) * 10;
      image.style.setProperty('--hero-parallax-x', `${offsetX.toFixed(2)}px`);
      image.style.setProperty('--hero-parallax-y', `${offsetY.toFixed(2)}px`);
    });
  });

  banner.addEventListener('pointerleave', () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    image.style.setProperty('--hero-parallax-x', '0px');
    image.style.setProperty('--hero-parallax-y', '0px');
  });
}

function wrapHomeHeroHeadingByLine(heading) {
  const text = heading.textContent;
  const words = Array.from(text.matchAll(/\S+/g));
  if (!words.length) return 1;

  const measurement = document.createDocumentFragment();
  const wordElements = words.map((word, index) => {
    const previousEnd = index === 0 ? 0 : words[index - 1].index + words[index - 1][0].length;
    measurement.appendChild(document.createTextNode(text.slice(previousEnd, word.index)));

    const wordElement = document.createElement('span');
    wordElement.style.cssText = 'display: inline-block; white-space: nowrap;';
    wordElement.textContent = word[0];
    measurement.appendChild(wordElement);
    return wordElement;
  });

  const lastWord = words[words.length - 1];
  measurement.appendChild(document.createTextNode(text.slice(lastWord.index + lastWord[0].length)));
  heading.replaceChildren(measurement);

  const lineHeight = parseFloat(getComputedStyle(heading).lineHeight) || 1;
  const lineGroups = [];
  wordElements.forEach((wordElement, index) => {
    const top = wordElement.getBoundingClientRect().top;
    const currentLine = lineGroups[lineGroups.length - 1];

    if (!currentLine || top - currentLine.top >= lineHeight * 0.5) {
      lineGroups.push({ start: words[index].index, top });
    }
  });

  const lines = lineGroups.map((line, index) => {
    const end = index + 1 < lineGroups.length ? lineGroups[index + 1].start : text.length;
    const lineWrap = document.createElement('span');
    const lineInner = document.createElement('span');
    lineWrap.className = 'hero-heading-line';
    lineInner.className = 'hero-heading-line-inner';
    lineInner.style.setProperty('--hero-line-delay', `${800 + index * 120}ms`);
    lineInner.textContent = text.slice(line.start, end);
    lineWrap.appendChild(lineInner);
    return lineWrap;
  });

  heading.replaceChildren(...lines);
  return lines.length;
}

/**
 * 6. Hero Supporting Brand Visual Motion
 * Subtle smooth entrance & gentle parallax hover on supporting brand card
 */
/**
 * 6. Ultra-Realistic Animated Purple Aurora & Liquid Wave Background
 * WebGL / High-Precision Fluid Mesh Renderer inspired by reference design.
 */
function initPurpleAuroraWave() {
  const card = document.getElementById('heroAuroraCard');
  const canvas = document.getElementById('auroraCanvas');
  if (!card || !canvas) return;

  // Try WebGL for GPU-accelerated realistic fluid simulation
  let gl = null;
  try {
    gl = canvas.getContext('webgl', { alpha: true, antialias: true }) ||
         canvas.getContext('experimental-webgl');
  } catch (e) {
    gl = null;
  }

  if (gl) {
    initWebGLAurora(card, canvas, gl);
  } else {
    initCanvas2DAurora(card, canvas);
  }
}

function initWebGLAurora(card, canvas, gl) {
  let width = 0;
  let height = 0;
  let dpr = 1;
  let isVisible = true;
  let animId = null;

  const vsSource = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  // GLSL Shader reproducing the new electric blue liquid silk wave ribbon artwork!
  const fsSource = `
    precision highp float;
    uniform vec2 u_resolution;
    uniform float u_time;

    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                         -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m;
      m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 st = gl_FragCoord.xy / u_resolution.xy;
      st.y = 1.0 - st.y; // Top to bottom

      float t = u_time * 0.32;

      // 1. Midnight Dark Base (#020108 -> #05030e)
      vec3 bg = mix(vec3(0.008, 0.004, 0.015), vec3(0.02, 0.01, 0.04), st.y);

      // 2. MAIN DIAGONAL SWEEPING LIQUID SILK RIBBON (PRESERVED EXACT SHAPE & SPEED)
      float ribbonNoise1 = snoise(vec2(st.x * 2.0 + t * 0.4, st.y * 1.8 - t * 0.3)) * 0.08;
      float ribbonNoise2 = snoise(vec2(st.x * 4.2 - t * 0.6, st.y * 3.5 + t * 0.5)) * 0.03;
      
      // Primary S-curve path flowing diagonally from bottom-left to top-right
      float targetX = 0.15 + (1.0 - st.y) * 0.55 + sin((1.0 - st.y) * 3.14159 * 1.2 + t * 0.8) * 0.14 + ribbonNoise1 + ribbonNoise2;
      float distToRibbon = abs(st.x - targetX);
      float ribbonIntensity = exp(-distToRibbon * distToRibbon * 45.0);

      // Secondary Splitting Silk Crest (Branching top-right ribbon curve)
      float targetX2 = 0.25 + (1.0 - st.y) * 0.70 + cos((1.0 - st.y) * 2.5 + t * 0.6) * 0.12 + ribbonNoise1;
      float distToRibbon2 = abs(st.x - targetX2);
      float ribbonIntensity2 = exp(-distToRibbon2 * distToRibbon2 * 65.0) * smoothstep(0.7, 0.1, st.y);

      // 3. TAKEEES PRIMARY PURPLE #502895 COLOR PALETTE & LIGHTER VARIATIONS
      // Primary Purple #502895 (rgb: 0.314, 0.157, 0.584)
      float verticalProg = 1.0 - st.y;
      vec3 mainPurple = vec3(0.314, 0.157, 0.584); // Takees Primary Purple #502895
      vec3 brightPurple = vec3(0.580, 0.350, 0.880); // Lighter variation derived from #502895
      
      vec3 ribbonColor = mix(mainPurple, brightPurple, verticalProg);
      
      vec3 color = mix(bg, ribbonColor, ribbonIntensity * 0.88);
      color += vec3(0.667, 0.494, 0.910) * ribbonIntensity2 * 0.72;

      // 4. SOFT PURPLE SILK SHEEN EDGE HIGHLIGHTS (#d6bdff)
      float sheenEdge = exp(-pow(distToRibbon - 0.02, 2.0) * 380.0) * 0.85;
      vec3 sheenColor = vec3(0.839, 0.741, 1.000);
      color += sheenColor * sheenEdge;

      // 5. INTENSE PURPLE-WHITE BASE LIGHT BLOOM AT BOTTOM-LEFT
      vec2 baseHotspot = vec2(0.12 + sin(t * 0.4) * 0.04, 0.92 + cos(t * 0.5) * 0.03);
      float dBase = length((st - baseHotspot) * vec2(1.0, 1.3));
      float baseGlow = exp(-dBase * dBase * 12.0);
      
      vec3 coreLight = mix(vec3(0.780, 0.620, 0.980), vec3(0.961, 0.933, 1.000), smoothstep(0.4, 0.0, dBase));
      color = mix(color, coreLight, baseGlow * 0.95);

      // Soft ambient purple volume fill
      float amb = exp(-abs(st.x - targetX) * 3.5);
      color += mainPurple * amb * 0.45;

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vertShader || !fragShader) {
    initCanvas2DAurora(card, canvas);
    return;
  }

  const program = gl.createProgram();
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    initCanvas2DAurora(card, canvas);
    return;
  }

  gl.useProgram(program);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
    -1,  1,
     1, -1,
     1,  1,
  ]), gl.STATIC_DRAW);

  const posLocation = gl.getAttribLocation(program, 'a_position');
  const resLocation = gl.getUniformLocation(program, 'u_resolution');
  const timeLocation = gl.getUniformLocation(program, 'u_time');

  gl.enableVertexAttribArray(posLocation);
  gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0, 0);

  function resize() {
    const rect = card.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animId) {
          lastTime = performance.now();
          loop(lastTime);
        }
      });
    }, { threshold: 0.05 });
    observer.observe(card);
  }

  let t = 0;
  let lastTime = performance.now();

  function loop(now) {
    if (!isVisible) {
      animId = null;
      return;
    }

    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;
    t += dt;

    gl.uniform2f(resLocation, canvas.width, canvas.height);
    gl.uniform1f(timeLocation, t);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    animId = requestAnimationFrame(loop);
  }

  lastTime = performance.now();
  loop(lastTime);
}

function initCanvas2DAurora(card, canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let isVisible = true;
  let animId = null;

  function resize() {
    const rect = card.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animId) {
          lastTime = performance.now();
          loop(lastTime);
        }
      });
    }, { threshold: 0.05 });
    observer.observe(card);
  }

  let t = 0;
  let lastTime = performance.now();

  function loop(now) {
    if (!isVisible) {
      animId = null;
      return;
    }

    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;
    t += dt * 0.6;

    render();
    animId = requestAnimationFrame(loop);
  }

  function render() {
    if (width === 0 || height === 0) return;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Dark Midnight Base
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#020108');
    bgGrad.addColorStop(0.5, '#060310');
    bgGrad.addColorStop(1, '#030109');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Diagonal Sweeping Purple Silk Ribbon
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.beginPath();
    
    const startX = width * (0.05 + Math.sin(t * 0.5) * 0.03);
    ctx.moveTo(startX, height + 10);

    const cp1x = width * (0.35 + Math.sin(t * 0.8) * 0.06);
    const cp1y = height * (0.65 + Math.cos(t * 0.6) * 0.04);
    const cp2x = width * (0.55 + Math.cos(t * 0.7) * 0.05);
    const cp2y = height * (0.25 + Math.sin(t * 0.9) * 0.04);
    const endX = width * (0.85 + Math.sin(t * 0.4) * 0.04);

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, -10);
    ctx.lineTo(endX + 160, -10);
    ctx.bezierCurveTo(cp2x + 160, cp2y, cp1x + 160, cp1y, startX + 160, height + 10);
    ctx.closePath();

    const ribbonGrad = ctx.createLinearGradient(0, height, width, 0);
    ribbonGrad.addColorStop(0, 'rgba(80, 40, 149, 0.95)');
    ribbonGrad.addColorStop(0.5, 'rgba(126, 74, 200, 0.9)');
    ribbonGrad.addColorStop(1, 'rgba(80, 40, 149, 0.4)');
    ctx.fillStyle = ribbonGrad;
    ctx.fill();
    ctx.restore();

    // Intense Purple-White Base Bloom at Bottom-Left
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const coreX = width * (0.15 + Math.sin(t * 0.5) * 0.04);
    const coreY = height * (0.92 + Math.cos(t * 0.7) * 0.03);
    const coreRx = width * 0.45;
    const coreRy = height * 0.38;

    const coreGlow = ctx.createRadialGradient(coreX, coreY, 5, coreX, coreY, coreRx);
    coreGlow.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    coreGlow.addColorStop(0.25, 'rgba(243, 235, 255, 0.92)');
    coreGlow.addColorStop(0.55, 'rgba(170, 126, 232, 0.68)');
    coreGlow.addColorStop(1, 'rgba(80, 40, 149, 0)');

    ctx.beginPath();
    ctx.ellipse(coreX, coreY, coreRx, coreRy, 0, 0, Math.PI * 2);
    ctx.fillStyle = coreGlow;
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  lastTime = performance.now();
  loop(lastTime);
}

