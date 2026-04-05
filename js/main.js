// ====================================
//  SAMRIDHI PORTFOLIO — Main JS
// ====================================

// Pretext — text measurement (via esm.sh CDN)
let pretextPrepare = null, pretextLayout = null;
if (window.innerWidth < 768) {
    import('https://esm.sh/@chenglou/pretext').then(mod => {
        pretextPrepare = mod.prepare;
        pretextLayout  = mod.layout;
    }).catch(() => {}); // graceful fallback if CDN unavailable
}

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initDock();
    initHeroGrid();
    initHeroScroll();
    initHeroMeta();
    initHobbies();
    initWorkFilters();
    initNhQuoteReveal();   // CDG word reveal on "I design experiences..."
    initWorkFloat();
    initQuoteSticky();
    initJourneyHovers();
    initScrollReveal();
    initSkillsClone();
    initSkillsGlow();
    initWorkScroll();
    initChatbot();
    initChatFloat();
    initFooterGame();
    initDraggableCards();
    initIdCardDrag();
    initMobileJourneyReveal();
});

// ====================================
//  BOTTOM DOCK NAV
// ====================================
function initDock() {
    const toggle = document.getElementById('dock-toggle');
    const bento = document.getElementById('bento-nav');
    const logo = document.getElementById('dock-logo');
    if (!toggle || !bento) return;

    toggle.addEventListener('click', () => {
        // Close chatbot if open before toggling menu
        const chatOverlay = document.getElementById('chatbot-overlay');
        if (chatOverlay?.classList.contains('active')) {
            window.closeChatbot();
        }
        const isOpen = bento.classList.toggle('is-open');
        toggle.classList.toggle('is-open', isOpen);
    });

    // Close on clicking a nav link
    bento.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            bento.classList.remove('is-open');
            toggle.classList.remove('is-open');
        });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            bento.classList.remove('is-open');
            toggle.classList.remove('is-open');
        }
    });

    // Match bento width to dock width
    const dock = document.getElementById('dock');
    const bentoEl = document.getElementById('bento-nav');
    function syncWidth() {
        if (dock && bentoEl) {
            bentoEl.style.setProperty('--dock-width', dock.offsetWidth + 'px');
        }
    }
    syncWidth();
    window.addEventListener('resize', syncWidth);

    // Logo scrolls to top
    if (logo) {
        logo.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// ====================================
//  HAMBURGER MENU (legacy)
// ====================================
function initHamburger() {
    const nav = document.getElementById('nav');
    const hamburger = document.getElementById('nav-hamburger');
    if (!nav || !hamburger) return;

    // Clone nav__right links into nav__left for the mobile overlay
    const navLeft = nav.querySelector('.nav__left');
    const navRight = nav.querySelector('.nav__right');
    if (navLeft && navRight) {
        const rightLinks = navRight.querySelectorAll('a');
        rightLinks.forEach(link => {
            const clone = link.cloneNode(true);
            clone.classList.add('mobile-only-link');
            navLeft.appendChild(clone);
        });
    }

    hamburger.addEventListener('click', () => {
        nav.classList.toggle('open');
        // Prevent body scroll when menu is open
        document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when a nav link is clicked
    if (navLeft) {
        navLeft.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }
}

// ====================================
//  LOADER
// ====================================
function initLoader() {
    const loader = document.getElementById('loader');
    const letterS = document.getElementById('loader-s');
    const letterA = document.getElementById('loader-a');
    const bar = document.getElementById('loader-bar');
    const fill = document.getElementById('loader-fill');
    if (!loader || !letterS || !letterA || !bar || !fill) return;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    function unlockScroll() {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
    }

    function dismissLoader() {
        loader.classList.add('loaded');
        setTimeout(unlockScroll, 600);
    }

    // Phase 1: Hold "SA" together for 600ms
    // Phase 2: Split to corners (800ms CSS transition)
    // Phase 3: Bar appears and fills (1800ms)

    // Phase 1 → 2: Split
    setTimeout(() => {
        letterS.classList.add('is-split');
        letterA.classList.add('is-split');

        // Phase 2 → 3: Show bar after split completes
        setTimeout(() => {
            bar.classList.add('is-visible');

            // Phase 3: Fill the bar
            setTimeout(() => {
                const DURATION = 1800;
                const startTime = performance.now();

                function tick(now) {
                    const elapsed = now - startTime;
                    const t = Math.min(elapsed / DURATION, 1);
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - t, 3);
                    fill.style.width = `${eased * 100}%`;

                    if (t < 1) {
                        requestAnimationFrame(tick);
                    } else {
                        fill.style.width = '100%';
                        setTimeout(dismissLoader, 300);
                    }
                }

                requestAnimationFrame(tick);
            }, 200);
        }, 850);
    }, 600);
}

// ====================================
//  NAV — scroll → pill shape
// ====================================
function initNavScroll() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > window.innerHeight * 0.35) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });
}

// ====================================
//  NAV TOGGLE (Show/Hide Sections)
// ====================================
function initNavToggle() {
    const workLink = document.getElementById('nav-work-link');
    const logoLink = document.getElementById('nav-logo-link');

    // Elements only on index.html
    const heroSection = document.getElementById('hero');
    const skillsSection = document.getElementById('skills');
    // Elements on both pages
    const journeySection = document.getElementById('journey');
    const workSection = document.getElementById('work');

    if (!workLink || !logoLink) return;

    // Check if we are currently on the index.html page
    // workSection only exists on index.html
    const isHomePage = !!workSection;

    // Click "Work"
    workLink.addEventListener('click', (e) => {
        if (!isHomePage) {
            // Let the standard link navigate to index.html#work
            return;
        }

        e.preventDefault();

        // Hide other sections on home page
        if (heroSection) heroSection.style.display = 'none';
        if (journeySection) journeySection.style.display = 'none';
        if (skillsSection) skillsSection.style.display = 'none';

        if (workSection) {
            workSection.style.display = 'block';
            workSection.scrollIntoView({ behavior: 'smooth' });
        }

        // Update URL hash without causing a jump
        history.pushState(null, null, '#work');
    });

    // Click "Samridhi aggarwal"
    logoLink.addEventListener('click', (e) => {
        e.preventDefault();

        if (!isHomePage) {
            // If on about page, go to index.html
            window.location.href = 'index.html';
            return;
        }

        // Only on home page, reveal everything
        if (heroSection) heroSection.style.display = '';
        if (journeySection) journeySection.style.display = '';
        if (skillsSection) skillsSection.style.display = '';
        if (workSection) workSection.style.display = '';

        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Remove hash from URL
        history.pushState(null, null, window.location.pathname);
    });
}

// ====================================
// ====================================
//  HERO GRID PATTERN
// ====================================
function initHeroGrid() {
  const grid = document.getElementById('hero-grid');
  if (!grid) return;
  grid.innerHTML = '';

  // opts: { text, size:'lg'|'md', pos:'top'|'bottom', hl:bool }
  function makeCell(opts) {
    opts = opts || {};
    const el = document.createElement('div');
    el.className = 'grid-cell' + (opts.hl ? ' grid-cell--hl' : '');
    if (opts.text) {
      const sz  = opts.size || 'md';
      const bot = opts.pos === 'bottom' ? ' grid-cell__label--b' : '';
      el.innerHTML = '<span class="grid-cell__label grid-cell__label--' + sz + bot + '">'
        + opts.text.replace(/\n/g, '<br>') + '</span>';
    }
    return el;
  }

  const e  = function()            { return makeCell(); };
  const h  = function()            { return makeCell({ hl: true }); };
  const tT = function(txt, sz)     { return makeCell({ text: txt, size: sz || 'md', pos: 'top' }); };
  const tB = function(txt, sz)     { return makeCell({ text: txt, size: sz || 'md', pos: 'bottom' }); };

  // 9 cols × 4 rows — matches reference layout
  const rows = [
    // Row 0: PRODUCT col0 | DESIGNER col2 | DETAIL bottom-aligned col7 (second-last)
    [ tT('PRODUCT',  'lg'), e(), tT('DESIGNER', 'lg'), e(), e(), e(), e(), tB('DETAIL', 'lg'), e() ],

    // Row 1: TURN IDEAS col2
    [ e(), e(), tT('TURN IDEAS\nINTO\nINTERFACES\nPEOPLE\nACTUALLY\nUSE', 'md'), e(), e(), e(), e(), e(), e() ],

    // Row 2: CLARITY col0 | GOOD IS NOT col3
    [ tB('CLARITY\nIS\nTHE GOAL', 'md'), e(), e(), tT("GOOD IS NOT\nWHERE WE STOP.\nIT'S WHERE\nWE BEGIN.", 'md'), e(), e(), e(), e(), e() ],

    // Row 3: all empty
    [ e(), e(), e(), e(), e(), e(), e(), e(), e() ],
  ];

  rows.forEach(function(row) { row.forEach(function(el) { grid.appendChild(el); }); });
}

//  HERO SCROLL
//   - Frame (fullscreen → shrink to ~500×356 card)
//   - Photo scales to 0.75×
//   - Title & scroll hint fade out
//   - 5 floating cards slide in from edges
// ====================================
function initHeroScroll() {
    const hero = document.querySelector('.hero');
    const frame = document.getElementById('hero-frame');
    const photo = document.querySelector('.hero__photo');
    const portraitWrap = document.getElementById('hero-portrait-wrap');
    const heroText = document.querySelector('.hero__text');
    const heroMeta = document.getElementById('hero-meta');
    const floatCards = document.querySelectorAll('.hero__float-card');

    if (!hero || !frame) return;

    let rafPending = false;
    const handleScroll = () => {
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(() => {
            rafPending = false;
            runScroll();
        });
    };

    const runScroll = () => {
        const rect = hero.getBoundingClientRect();
        const scrolled = -rect.top;
        const vh = window.innerHeight;
        const vw = window.innerWidth;
        const isMobile = vw < 768;

        // Mobile: complete animation over 1× vh (faster feel); desktop: 1.5×
        const scrollDist = isMobile ? vh * 1.0 : vh * 1.5;
        const progress = Math.max(0, Math.min(1, scrolled / scrollDist));

        // ── FRAME: shrink to landscape card on mobile, portrait card on desktop ──
        const targetW = isMobile ? Math.min(vw - 40, 360) : Math.min(456, vw * 0.32);
        const targetH = isMobile ? 450 : 314;

        const frameW = vw - progress * (vw - targetW);
        const frameH = vh - progress * (vh - targetH);

        // Border radius: 0 → 24px
        const radius = progress * 24;

        // Shift upward: less on mobile
        const offsetY = progress * (isMobile ? -60 : -84);

        frame.style.width = `${frameW}px`;
        frame.style.height = `${frameH}px`;
        frame.style.borderRadius = `${radius}px`;
        frame.style.marginTop = `${offsetY}px`;

        // ── SILHOUETTE: scale down as frame shrinks, fade out near end ──
        if (photo) {
            const photoScale = 1 - progress * 0.2;
            photo.style.transform = `scale(${photoScale})`;
            photo.style.opacity = Math.max(0, 1 - progress * 2.5);
        }

        // ── PORTRAIT WRAP: fade in as card forms (progress 0.65 → 1) ──
        if (portraitWrap) {
            const op = Math.max(0, Math.min(1, (progress - 0.65) / 0.35));
            portraitWrap.style.opacity = op;
            portraitWrap.style.pointerEvents = op > 0.05 ? 'auto' : 'none';
        }

        // ── FRAME: add glass border class at card state ──
        if (progress > 0.85) {
            frame.classList.add('is-card');
        } else {
            frame.classList.remove('is-card');
        }

        // ── TITLE, META & SCROLL HINT: fade out quickly ──
        if (heroText) {
            heroText.style.opacity = Math.max(0, 1 - progress * 3);
        }
        if (heroMeta) {
            heroMeta.style.opacity = Math.max(0, 0.6 - progress * 2);
        }

        // ── 4 FLOATING CARDS ──
        if (isMobile) {
            // Show cards only when frame has nearly finished shrinking (progress > 0.85)
            const cardFade = Math.max(0, Math.min(1, (progress - 0.85) / 0.15));
            floatCards.forEach(card => {
                card.style.opacity = cardFade;
                card.style.transform = '';
            });
        } else {
            // Desktop: slide in from edges after 30% progress
            const cardStart = 0.3;
            const cardProgress = Math.max(0, Math.min(1, (progress - cardStart) / (1 - cardStart)));
            const restTilt = [-3.5, 3, -2.5, 2.5];

            floatCards.forEach((card, i) => {
                const stagger = i * 0.07;
                const cp = Math.max(0, Math.min(1, (cardProgress - stagger) / (1 - stagger)));
                const eased = 1 - Math.pow(1 - cp, 3);

                card.style.opacity = eased;

                // Cards fade in from near their resting position — no off-screen travel
                switch (i) {
                    case 0: card.style.transform = `translateX(${-50 * (1 - eased)}px) rotate(${restTilt[0] * eased}deg)`; break;
                    case 1: card.style.transform = `translateX(${50 * (1 - eased)}px) rotate(${restTilt[1] * eased}deg)`; break;
                    case 2: card.style.transform = `translate(${-50 * (1 - eased)}px, ${30 * (1 - eased)}px) rotate(${restTilt[2] * eased}deg)`; break;
                    case 3: card.style.transform = `translate(${50 * (1 - eased)}px, ${30 * (1 - eased)}px) rotate(${restTilt[3] * eased}deg)`; break;
                }
            });
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    runScroll();
}

// ====================================
//  HERO META — live time display
// ====================================
function initHeroMeta() {
    const timeEl     = document.getElementById('hero-time');
    const dockTimeEl = document.getElementById('dock-time');

    function updateTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const mm = minutes < 10 ? '0' + minutes : minutes;
        const hh = hours < 10 ? '0' + hours : hours;
        const timeStr = hh + ':' + mm + ' ' + ampm;
        if (timeEl)     timeEl.textContent     = timeStr;
        if (dockTimeEl) dockTimeEl.textContent = timeStr;
    }

    updateTime();
    setInterval(updateTime, 1000);
}

// ====================================
//  HOBBIES section (scroll-driven)
// ====================================
function initHobbies() {
    const section = document.querySelector('.hobbies');
    const slides = document.querySelectorAll('.hobbies__slide');
    const faces = document.querySelectorAll('.hobbies__flip-face');
    const glow = document.querySelector('.hobbies__glow');

    if (!section || slides.length === 0) return;

    const numSlides = slides.length;
    let activeIndex = 0;

    const handleScroll = () => {
        const rect = section.getBoundingClientRect();
        const sectionHeight = section.offsetHeight;
        const vh = window.innerHeight;
        const scrolled = -rect.top;

        const totalScroll = sectionHeight - vh;
        const progress = Math.max(0, Math.min(1, scrolled / totalScroll));

        // Determine which slide is active
        const newIndex = Math.min(numSlides - 1, Math.floor(progress * numSlides));

        if (newIndex !== activeIndex) {
            // Icon slides
            slides[activeIndex]?.classList.remove('is-active');
            slides[newIndex]?.classList.add('is-active');

            // Text flipper — flip out old face, flip in new
            const oldFace = faces[activeIndex];
            const newFace = faces[newIndex];
            if (oldFace) {
                oldFace.classList.remove('is-active');
                oldFace.classList.add('is-exiting');
                setTimeout(() => oldFace.classList.remove('is-exiting'), 600);
            }
            if (newFace) {
                newFace.classList.add('is-active');
            }

            activeIndex = newIndex;
        }

        // Parallax on active slide's icons
        const slideProgress = (progress * numSlides) - newIndex;
        const activeSlide = slides[newIndex];
        if (activeSlide) {
            const icons = activeSlide.querySelectorAll('.hobbies__icon');
            icons.forEach((icon, i) => {
                const speed = i === 0 ? 0.3 : 0.2;
                const yOffset = slideProgress * speed * vh * 0.3;
                icon.style.transform = `translateY(${-yOffset}px)`;
            });
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ── Red glow follows mouse anywhere in section ──
    section.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
}

// ====================================
//  WORK FILTERS
// ====================================
function initWorkFilters() {
    const filters = document.querySelectorAll('.work__filter');
    const items = document.querySelectorAll('.work__item');

    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(f => f.classList.remove('work__filter--active'));
            btn.classList.add('work__filter--active');
            const filter = btn.dataset.filter;

            items.forEach((item, index) => {
                const categories = item.dataset.category || '';
                if (filter === 'all' || categories.includes(filter)) {
                    item.classList.remove('hidden');
                    item.style.animation = `fadeInUp 0.5s ${index * 0.08}s ease forwards`;
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
}

// ====================================
//  JOURNEY HOVER CARDS
// ====================================
// ====================================
//  MOBILE JOURNEY REVEAL (pretext-measured, IntersectionObserver-triggered)
// ====================================
function initMobileJourneyReveal() {
    if (window.innerWidth >= 768) return;

    const blocks = document.querySelectorAll('.journey__block');
    if (!blocks.length) return;

    // Pre-style all blocks as hidden
    blocks.forEach(block => {
        block.style.opacity = '0';
        block.style.transform = 'translateY(28px)';
        block.style.transition = 'opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)';
        block.style.willChange = 'opacity, transform';
    });

    // Reveal function — optionally uses pretext to ensure text fits before showing
    function revealBlock(block) {
        const textEl = block.querySelector('.journey__block-text');
        const w = block.getBoundingClientRect().width || window.innerWidth - 32;

        const doReveal = () => {
            block.style.opacity = '1';
            block.style.transform = 'translateY(0)';
        };

        if (pretextPrepare && pretextLayout && textEl) {
            // Measure text — if it overflows the container, expand min-height to fit
            const text = textEl.innerText || '';
            const fontSize = parseFloat(getComputedStyle(textEl).fontSize) || 15;
            const lineHeight = parseFloat(getComputedStyle(textEl).lineHeight) || fontSize * 1.7;
            const font = `${fontSize}px Open Runde, ui-rounded, sans-serif`;
            try {
                const prepared = pretextPrepare(text, font);
                const { height } = pretextLayout(prepared, w, lineHeight);
                if (height > 0) textEl.style.minHeight = `${height}px`;
            } catch (_) {}
        }
        doReveal();
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                revealBlock(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    blocks.forEach(block => observer.observe(block));
}

// ====================================
//  JOURNEY HOVERS (Wabi.ai Style)
// ====================================
function initJourneyHovers() {
    const blocks = document.querySelectorAll('.journey__block');
    const hoverGlass = document.getElementById('journey-hover-glass');
    const journeySection = document.getElementById('journey');

    if (!blocks.length || !hoverGlass || !journeySection) return;

    let activeImages = [];
    let targetX = 0, targetY = 0;
    let smoothX = 0, smoothY = 0;
    let isTracking = false;
    let currentActiveBlock = null;

    // Smooth lerping for the floating effect
    function animate() {
        if (!isTracking && !activeImages.length) return;

        smoothX += (targetX - smoothX) * 0.1;
        smoothY += (targetY - smoothY) * 0.1;

        activeImages.forEach((img, i) => {
            const speed = 0.04 + (i * 0.02);
            const dirX = i % 2 === 0 ? 1 : -1;
            const dirY = i % 2 === 0 ? -1 : 1;
            img.style.transform = `translate(${smoothX * speed * dirX}px, ${smoothY * speed * dirY}px) scale(1)`;
        });

        requestAnimationFrame(animate);
    }

    function activateBlock(block, mouseX, mouseY) {
        if (currentActiveBlock === block) return;
        currentActiveBlock = block;

        const highlights = block.querySelectorAll('.journey__highlight');
        let imgIds = Array.from(highlights).map(h => h.dataset.hover).filter(Boolean);

        // Hide previous
        activeImages.forEach(img => img.classList.remove('visible'));

        if (!imgIds.length) {
            activeImages = [];
            journeySection.classList.remove('is-hovering', 'is-dark-theme');
            journeySection.removeAttribute('data-active-hover');
            return;
        }

        // Gather all matching images for this block
        const imgs = [];
        imgIds.forEach(id => {
            const foundImgs = hoverGlass.querySelectorAll(`.journey__hover-img[data-img="${id}"]`);
            foundImgs.forEach(img => imgs.push(img));
        });

        activeImages = Array.from(new Set(imgs)); // unique

        if (!activeImages.length) {
            journeySection.classList.remove('is-hovering', 'is-dark-theme');
            journeySection.removeAttribute('data-active-hover');
            return;
        }

        const rect = hoverGlass.getBoundingClientRect();
        targetX = mouseX !== undefined ? mouseX - rect.width / 2 : 0;
        targetY = mouseY !== undefined ? mouseY - rect.height / 2 : 0;

        if (!isTracking) {
            smoothX = targetX;
            smoothY = targetY;
            journeySection.classList.add('is-hovering');
        } else {
            journeySection.classList.add('is-hovering');
        }

        const darkTriggers = ['shifting-scale'];
        const isDark = imgIds.some(id => darkTriggers.includes(id));
        if (isDark) journeySection.classList.add('is-dark-theme');
        else journeySection.classList.remove('is-dark-theme');

        journeySection.setAttribute('data-active-hover', imgIds.join(' '));

        activeImages.forEach((img, i) => {
            img.classList.add('visible');
            const speed = 0.04 + (i * 0.02);
            const dirX = i % 2 === 0 ? 1 : -1;
            const dirY = i % 2 === 0 ? -1 : 1;
            img.style.transform = `translate(${smoothX * speed * dirX}px, ${smoothY * speed * dirY}px) scale(1)`;
        });

        // Toggle highlights
        document.querySelectorAll('.journey__highlight').forEach(h => h.classList.remove('is-active'));
        highlights.forEach(h => h.classList.add('is-active'));

        if (!isTracking) {
            isTracking = true;
            animate();
        }
    }

    function deactivateAll() {
        currentActiveBlock = null;
        document.querySelectorAll('.journey__highlight').forEach(h => h.classList.remove('is-active'));
        activeImages.forEach(img => img.classList.remove('visible'));
        activeImages = [];
        isTracking = false;
        journeySection.classList.remove('is-hovering', 'is-dark-theme');
        journeySection.removeAttribute('data-active-hover');
    }

    blocks.forEach(block => {
        // Activate on mouseenter (hover)
        block.addEventListener('mouseenter', (e) => {
            activateBlock(block, e.clientX, e.clientY);
        });
    });

    document.addEventListener('mousemove', (e) => {
        if (!isTracking) return;
        const rect = hoverGlass.getBoundingClientRect();
        targetX = e.clientX - rect.width / 2;
        targetY = e.clientY - rect.height / 2;
    });

    // Deactivate when mouse fully leaves the entire journey section
    journeySection.addEventListener('mouseleave', () => {
        deactivateAll();
    });

    // Dim text logic for scribbles
    const scribbles = document.querySelectorAll('.journey__scribble');
    scribbles.forEach(scribble => {
        scribble.addEventListener('mouseenter', () => {
            if (journeySection) journeySection.classList.add('is-hovering');
            scribble.classList.add('is-active');
        });
        scribble.addEventListener('mouseleave', () => {
            if (journeySection && !isTracking) journeySection.classList.remove('is-hovering');
            scribble.classList.remove('is-active');
        });
    });

    // Scroll Logic
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -40% 0px', // triggers when the block enters the center part of the viewport
        threshold: 0.1
    };
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If the user's mouse is not actively inside the journey section controlling things,
                // let the scroll seamlessly activate the in-view block.
                if (!journeySection.matches(':hover')) {
                    activateBlock(entry.target);
                }
            }
        });
    }, observerOptions);

    blocks.forEach(block => scrollObserver.observe(block));

    // Cleanup when journey section is entirely scrolled out of view
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                deactivateAll();
            }
        });
    }, { threshold: 0 });
    sectionObserver.observe(journeySection);
}

// ====================================
//  SCROLL REVEAL
// ====================================
function initScrollReveal() {
    const targets = document.querySelectorAll(
        '.about__heading, .about__bio, .about__tags, ' +
        '.work__header, .work__filters, .work__item, ' +
        '.skills__header, ' +
        '.journey__header, .journey__text p, ' +
        '.bento__item, ' +
        '.footer__heading, .footer__subtext, .footer__cta'
    );
    targets.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    targets.forEach(el => observer.observe(el));
}

// ====================================
//  SKILLS CLONE
// ====================================
function initSkillsClone() {
    const reel = document.querySelector('.skills__reel');
    if (!reel) return;
    const frames = reel.querySelectorAll('.skills__frame');
    frames.forEach(frame => reel.appendChild(frame.cloneNode(true)));
}

// ====================================
//  SKILLS BACKGROUND GLOW
// ====================================
function initSkillsGlow() {
    const skillsSection = document.getElementById('skills');
    const glow = document.querySelector('.skills__bg-glow');

    if (!skillsSection || !glow) return;

    skillsSection.addEventListener('mousemove', (e) => {
        // Since glow is inside a sticky full-viewport container,
        // we can directly map window clientX/Y to the element
        const x = e.clientX;
        const y = e.clientY;

        // Update CSS variables on the glow element
        glow.style.setProperty('--mouse-x', `${x}px`);
        glow.style.setProperty('--mouse-y', `${y}px`);
    });
}

// ====================================
//  UTILITY
// ====================================
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

// ====================================
//  WORK SCROLL (FLAT)
// ====================================
function initWorkScroll() {
    const cards = document.querySelectorAll('.work__card');
    const sidebarTags = document.getElementById('work-sidebar-tags');
    const sidebarDesc = document.getElementById('work-sidebar-desc');
    const sidebarNote = document.getElementById('work-sidebar-note');
    const sidebarTitle = document.getElementById('work-sidebar-title');
    const viewBtn = document.getElementById('work-view-btn');
    const leftSidebar = document.querySelector('.work__sidebar-left');
    const rightSidebar = document.querySelector('.work__sidebar-right');

    if (cards.length === 0 || !sidebarTags || !leftSidebar || !rightSidebar) return;

    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px', // Triggers when element is precisely in the middle 20% of height
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;

                // Fade out text first
                leftSidebar.style.opacity = '0';
                rightSidebar.style.opacity = '0';

                // Wait for fade out, then swap text and fade back in
                setTimeout(() => {
                    if (card.dataset.tags) sidebarTags.innerHTML = card.dataset.tags;
                    if (card.dataset.desc) sidebarDesc.innerHTML = card.dataset.desc;
                    if (card.dataset.rightText) sidebarNote.innerHTML = card.dataset.rightText;
                    if (card.dataset.title) sidebarTitle.innerHTML = card.dataset.title;
                    // Update View Project button
                    if (viewBtn && card.dataset.url) {
                        const isExternal = card.dataset.urlExternal === 'true';
                        viewBtn.href = card.dataset.url;
                        viewBtn.target = isExternal ? '_blank' : '_self';
                        viewBtn.style.pointerEvents = 'auto';
                        viewBtn.style.opacity = '1';
                    }

                    leftSidebar.style.opacity = '1';
                    rightSidebar.style.opacity = '1';
                }, 300); // matches the 0.5s fade, but swaps text just before it's fully gone/visible
            }
        });
    }, observerOptions);

    cards.forEach(card => observer.observe(card));
}

// ====================================
//  ID CARD DRAG (lanyard badge physics)
// ====================================
function initIdCardDrag() {
    const card = document.getElementById('hero-id-card');
    const lanyard = document.getElementById('hero-lanyard');
    const thread = lanyard ? lanyard.querySelector('.hero__lanyard-thread') : null;
    if (!card || !lanyard || !thread) return;

    let isDragging = false;
    let startX, startY;
    let currentX = 0, currentY = 0;
    let velX = 0, velY = 0;
    let lastX = 0, lastY = 0;
    let lastTime = 0;
    let momentumRaf = null;
    let springRaf = null;
    let rotation = 0;

    // Store the card's resting center for lanyard calculations
    const restTop = card.offsetTop;

    function updateLanyard(dx, dy) {
        // The thread connects from top-center of frame to top-center of card
        // As the card moves, the thread stretches and angles
        const cardHoleX = dx; // horizontal offset from center
        const cardHoleY = dy; // vertical offset from rest

        // Thread length (from top of frame to card hole)
        const baseLen = restTop; // default thread + clip height
        const newLen = Math.sqrt(cardHoleX * cardHoleX + (baseLen + cardHoleY) * (baseLen + cardHoleY));

        // Angle of the thread
        const angle = Math.atan2(cardHoleX, baseLen + cardHoleY) * (180 / Math.PI);

        thread.style.height = `${newLen}px`;
        lanyard.style.transform = `translateX(-50%) rotate(${angle}deg)`;
        lanyard.style.transformOrigin = 'top center';
    }

    function onPointerDown(e) {
        if (e.target.closest('a, button, input')) return;
        isDragging = true;
        if (momentumRaf) cancelAnimationFrame(momentumRaf);
        if (springRaf) cancelAnimationFrame(springRaf);

        startX = e.clientX - currentX;
        startY = e.clientY - currentY;
        lastX = e.clientX;
        lastY = e.clientY;
        lastTime = performance.now();
        velX = 0;
        velY = 0;

        card.style.cursor = 'grabbing';
        card.style.transition = 'none';
        thread.style.transition = 'none';
        lanyard.style.transition = 'none';
        e.preventDefault();
    }

    function onPointerMove(e) {
        if (!isDragging) return;
        const now = performance.now();
        const dt = Math.max(now - lastTime, 1);

        currentX = e.clientX - startX;
        currentY = e.clientY - startY;

        // Track velocity (smoothed)
        velX = 0.7 * velX + 0.3 * ((e.clientX - lastX) / dt * 16);
        velY = 0.7 * velY + 0.3 * ((e.clientY - lastY) / dt * 16);

        lastX = e.clientX;
        lastY = e.clientY;
        lastTime = now;

        // Tilt based on horizontal velocity (max +/-12deg)
        rotation = Math.max(-12, Math.min(12, velX * 0.6));

        card.style.transform = `translateX(calc(-50% + ${currentX}px)) translateY(${currentY}px) rotate(${rotation}deg)`;
        updateLanyard(currentX, currentY);
    }

    function onPointerUp() {
        if (!isDragging) return;
        isDragging = false;
        card.style.cursor = 'grab';

        // Phase 1: Momentum with friction
        const friction = 0.92;
        const rotFriction = 0.88;

        function momentumStep() {
            velX *= friction;
            velY *= friction;
            rotation *= rotFriction;

            currentX += velX;
            currentY += velY;

            card.style.transform = `translateX(calc(-50% + ${currentX}px)) translateY(${currentY}px) rotate(${rotation}deg)`;
            updateLanyard(currentX, currentY);

            if (Math.abs(velX) > 0.5 || Math.abs(velY) > 0.5 || Math.abs(rotation) > 0.3) {
                momentumRaf = requestAnimationFrame(momentumStep);
            } else {
                // Phase 2: Spring back to center
                springBack();
            }
        }

        function springBack() {
            const stiffness = 0.08;
            const damping = 0.75;

            function springStep() {
                // Spring force towards origin
                const forceX = -currentX * stiffness;
                const forceY = -currentY * stiffness;

                velX = (velX + forceX) * damping;
                velY = (velY + forceY) * damping;
                rotation *= 0.85;

                currentX += velX;
                currentY += velY;

                card.style.transform = `translateX(calc(-50% + ${currentX}px)) translateY(${currentY}px) rotate(${rotation}deg)`;
                updateLanyard(currentX, currentY);

                if (Math.abs(currentX) > 0.5 || Math.abs(currentY) > 0.5 || Math.abs(velX) > 0.1 || Math.abs(velY) > 0.1) {
                    springRaf = requestAnimationFrame(springStep);
                } else {
                    // Snap to rest
                    currentX = 0;
                    currentY = 0;
                    rotation = 0;
                    card.style.transform = 'translateX(-50%)';
                    thread.style.height = '';
                    lanyard.style.transform = 'translateX(-50%)';
                    lanyard.style.transformOrigin = '';
                }
            }

            springRaf = requestAnimationFrame(springStep);
        }

        momentumRaf = requestAnimationFrame(momentumStep);
    }

    card.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
}

// ====================================
//  DRAGGABLE FLOAT CARDS
// ====================================
function initDraggableCards() {
    if (window.innerWidth <= 768) return; // horizontal scroll on mobile, no drag
    const cards = document.querySelectorAll('.hero__float-card');
    if (!cards.length) return;

    cards.forEach((card, idx) => {
        let isDragging = false;
        let startX, startY, origX, origY;
        let currentX = 0, currentY = 0;
        let velX = 0, velY = 0;
        let lastX = 0, lastY = 0;
        let lastTime = 0;
        let baseTransform = '';
        let physicsRaf = null;
        let rotation = 0;
        let scale = 1;
        let targetScale = 1;

        // Idle breathing — each card has its own phase offset
        let idleRaf = null;
        const idlePhase = idx * 1.7;
        let idleActive = true;

        function idleFloat(time) {
            if (isDragging || !idleActive) return;
            const t = time * 0.001 + idlePhase;
            const floatX = Math.sin(t * 0.7) * 3;
            const floatY = Math.cos(t * 0.5) * 2.5;
            const floatRot = Math.sin(t * 0.3) * 1.2;

            if (currentX === 0 && currentY === 0) {
                card.style.transform = `${baseTransform} translate(${floatX}px, ${floatY}px) rotate(${floatRot}deg)`;
            }
            idleRaf = requestAnimationFrame(idleFloat);
        }

        // Start idle after cards settle in
        setTimeout(() => {
            baseTransform = card.style.transform || '';
            baseTransform = baseTransform.replace(/translate\([^)]+\)\s*rotate\([^)]+\)\s*$/, '').trim();
            idleRaf = requestAnimationFrame(idleFloat);
        }, 3000 + idx * 200);

        function onPointerDown(e) {
            if (e.target.closest('a, button, input')) return;
            isDragging = true;
            idleActive = false;
            if (physicsRaf) cancelAnimationFrame(physicsRaf);
            if (idleRaf) cancelAnimationFrame(idleRaf);

            startX = e.clientX;
            startY = e.clientY;
            lastX = e.clientX;
            lastY = e.clientY;
            lastTime = performance.now();
            baseTransform = card.style.transform || '';
            baseTransform = baseTransform.replace(/translate\([^)]+\)\s*rotate\([^)]+\)\s*$/, '').trim();
            origX = currentX;
            origY = currentY;
            velX = 0;
            velY = 0;

            // Scale up on grab — feels like picking it up
            targetScale = 1.06;
            scale = 1.06;

            card.style.cursor = 'grabbing';
            card.style.zIndex = '20';
            card.style.transition = 'none';
            card.style.filter = 'drop-shadow(0 16px 32px rgba(0,0,0,0.35))';
            e.preventDefault();
        }

        function onPointerMove(e) {
            if (!isDragging) return;
            const now = performance.now();
            const dt = Math.max(now - lastTime, 1);

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            // Smoothed velocity
            velX = 0.6 * velX + 0.4 * ((e.clientX - lastX) / dt * 16);
            velY = 0.6 * velY + 0.4 * ((e.clientY - lastY) / dt * 16);

            lastX = e.clientX;
            lastY = e.clientY;
            lastTime = now;

            currentX = origX + dx;
            currentY = origY + dy;

            // Tilt based on horizontal velocity — more responsive
            rotation = Math.max(-20, Math.min(20, velX * 1.2));

            // Slight skew for liveliness
            const skew = Math.max(-4, Math.min(4, velX * 0.15));

            card.style.transform = `${baseTransform} translate(${currentX}px, ${currentY}px) rotate(${rotation}deg) scale(${scale}) skewX(${skew}deg)`;
        }

        function onPointerUp() {
            if (!isDragging) return;
            isDragging = false;
            card.style.cursor = 'grab';
            card.style.zIndex = '';
            card.style.filter = '';
            targetScale = 1;

            // Spring physics — momentum with elastic return
            const friction = 0.93;
            const rotFriction = 0.85;
            const springStrength = 0.04;
            const springDamping = 0.82;

            function animate() {
                // Apply momentum
                velX *= friction;
                velY *= friction;
                rotation *= rotFriction;

                // Spring pull back toward origin (0,0)
                const springX = -currentX * springStrength;
                const springY = -currentY * springStrength;
                velX += springX;
                velY += springY;

                currentX += velX;
                currentY += velY;

                // Scale spring back
                scale += (targetScale - scale) * 0.12;

                // Skew decay
                const skew = Math.max(-4, Math.min(4, velX * 0.15));

                card.style.transform = `${baseTransform} translate(${currentX}px, ${currentY}px) rotate(${rotation}deg) scale(${scale}) skewX(${skew}deg)`;

                const totalMotion = Math.abs(velX) + Math.abs(velY) + Math.abs(rotation) + Math.abs(currentX) + Math.abs(currentY);

                if (totalMotion > 0.5) {
                    physicsRaf = requestAnimationFrame(animate);
                } else {
                    // Snap to rest
                    currentX = 0;
                    currentY = 0;
                    rotation = 0;
                    scale = 1;
                    card.style.transform = `${baseTransform} translate(0px, 0px) rotate(0deg) scale(1)`;

                    // Resume idle breathing
                    idleActive = true;
                    idleRaf = requestAnimationFrame(idleFloat);
                }
            }

            physicsRaf = requestAnimationFrame(animate);
        }

        card.style.cursor = 'grab';
        card.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
    });
}

// ====================================
//  AI CHATBOT
// ====================================
// ====================================
//  STICKY CHAT FLOAT
// ====================================
function initChatFloat() {
    const btn = document.getElementById('chat-float');
    if (!btn) return;

    const hero = document.querySelector('.hero');

    window.addEventListener('scroll', () => {
        const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
        if (heroBottom < window.innerHeight * 0.5) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });
}

window.openChatbot = function () {
    const overlay = document.getElementById('chatbot-overlay');
    if (!overlay) return;
    // Close menu if open before opening chat
    const bento = document.getElementById('bento-nav');
    const toggle = document.getElementById('dock-toggle');
    bento?.classList.remove('is-open');
    toggle?.classList.remove('is-open');
    // Match dock width exactly
    const dock = document.getElementById('dock');
    if (dock) overlay.style.width = dock.offsetWidth + 'px';
    overlay.classList.add('active');
    document.getElementById('chatbot-input')?.focus();
};

window.closeChatbot = function () {
    const overlay = document.getElementById('chatbot-overlay');
    const modal = overlay?.querySelector('.chatbot-modal');
    const floatBtn = document.getElementById('chat-float');

    if (!overlay || !modal) return;

    // Morph close: shrink modal toward the chat float button
    if (floatBtn) {
        const btnRect = floatBtn.getBoundingClientRect();
        const modalRect = modal.getBoundingClientRect();

        const tx = btnRect.left + btnRect.width / 2 - (modalRect.left + modalRect.width / 2);
        const ty = btnRect.top + btnRect.height / 2 - (modalRect.top + modalRect.height / 2);
        const scale = btnRect.width / modalRect.width;

        modal.style.transition = 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease-out, border-radius 0.45s cubic-bezier(0.4, 0, 0.2, 1)';
        modal.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
        modal.style.opacity = '0';
        modal.style.borderRadius = '50%';

        setTimeout(() => {
            overlay.classList.remove('active');
            modal.style.transition = '';
            modal.style.transform = '';
            modal.style.opacity = '';
            modal.style.borderRadius = '';
        }, 460);
    } else {
        overlay.classList.remove('active');
    }
};

function initChatbot() {
    const input = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send');
    const messagesEl = document.getElementById('chatbot-messages');
    const overlay = document.getElementById('chatbot-overlay');

    if (!input || !sendBtn || !messagesEl) return;

    const history = [];

    // Keep width in sync with dock on resize
    window.addEventListener('resize', () => {
        const dock = document.getElementById('dock');
        if (dock && overlay?.classList.contains('active')) {
            overlay.style.width = dock.offsetWidth + 'px';
        }
    });

    // Close on overlay backdrop click
    overlay?.addEventListener('click', (e) => {
        if (e.target === overlay) window.closeChatbot();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') window.closeChatbot();
    });

    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        // User message in UI
        appendMsg(text, 'user');
        input.value = '';
        history.push({ role: 'user', content: text });

        // Typing indicator — wave pulse
        const typingEl = document.createElement('div');
        typingEl.className = 'chatbot-msg chatbot-msg--bot chatbot-typing';
        typingEl.innerHTML = '<div class="typing-wave"><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>';
        messagesEl.appendChild(typingEl);
        scrollToBottom();

        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 15000);

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: history }),
                signal: controller.signal,
            });

            clearTimeout(timeout);

            typingEl.remove();

            if (!res.ok) throw new Error('API error');

            const data = await res.json();
            const reply = data.reply || "Sorry, something went wrong on my end!";

            appendMsg(reply, 'bot');
            history.push({ role: 'assistant', content: reply });
        } catch {
            typingEl.remove();
            appendMsg("Hmm, something went wrong. Reach out at samridhi28.19@gmail.com!", 'bot');
        }
    }

    function appendMsg(text, type) {
        const div = document.createElement('div');
        div.className = `chatbot-msg chatbot-msg--${type}`;
        messagesEl.appendChild(div);

        if (type === 'bot') {
            typeMessage(div, text);
        } else {
            div.textContent = text;
            scrollToBottom();
        }
    }

    function typeMessage(el, text) {
        let i = 0;
        const total = text.length;

        function next() {
            if (i >= total) return;
            el.textContent = text.slice(0, ++i);
            scrollToBottom();
            // ease-out: faster at start, slower near end
            const progress = i / total;
            const delay = 8 + progress * 28; // 8ms → 36ms
            setTimeout(next, delay);
        }

        next();
    }

    function scrollToBottom() {
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

// ====================================
//  FOOTER MINI GAME — Shape Catcher
// ====================================
function initFooterGame() {
    const canvas  = document.getElementById('fg-canvas');
    if (!canvas) return;

    const ctx     = canvas.getContext('2d');
    const overlay = document.getElementById('fg-overlay');
    const scoreEl = document.getElementById('fg-score');
    const speedEl = document.getElementById('fg-timer');
    const bestEl  = document.getElementById('fg-best');
    const olScore = document.getElementById('fg-ol-score');
    const olHint  = document.getElementById('fg-ol-hint');
    const playBtn = document.getElementById('fg-play-btn');

    // ── Constants ─────────────────────────────────
    const GRAVITY      = 0.38;
    const FLAP_V       = -7.2;
    const PIPE_W       = 48;
    const PIPE_GAP     = 130;
    const BASE_SPEED   = 2.6;
    const BASE_INTERVAL= 1700; // ms between pipes

    let bird, pipes, score, best = 0;
    let pipeSpeed, pipeInterval, pipeTimer;
    let gameActive = false, animId = null, lastTs = 0;

    // ── Audio (Web Audio API — no files needed) ────
    let audioCtx = null;
    function getAudio() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        return audioCtx;
    }
    function beep(freq, type, duration, gain, freqEnd) {
        try {
            const ac = getAudio();
            const play = () => {
                const osc = ac.createOscillator();
                const env = ac.createGain();
                osc.connect(env); env.connect(ac.destination);
                osc.type = type || 'sine';
                osc.frequency.setValueAtTime(freq, ac.currentTime);
                if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, ac.currentTime + duration);
                env.gain.setValueAtTime(gain || 0.18, ac.currentTime);
                env.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
                osc.start(ac.currentTime);
                osc.stop(ac.currentTime + duration);
            };
            if (ac.state === 'suspended') ac.resume().then(play);
            else play();
        } catch (_) {}
    }
    const sfx = {
        flap:  () => beep(520, 'square', 0.08, 0.12, 680),
        score: () => { beep(660, 'sine', 0.1, 0.15, 880); setTimeout(() => beep(880, 'sine', 0.12, 0.12), 80); },
        die:   () => { beep(320, 'sawtooth', 0.08, 0.2, 160); setTimeout(() => beep(160, 'sawtooth', 0.25, 0.18, 80), 90); },
    };

    // ── Responsive canvas ─────────────────────────
    function resize() {
        canvas.width  = canvas.parentElement.offsetWidth;
        canvas.height = parseInt(getComputedStyle(canvas).height) || 280;
    }
    resize();
    window.addEventListener('resize', () => { resize(); if (!gameActive) drawIdle(); });

    // ── Bird ──────────────────────────────────────
    function makeBird() {
        return { x: Math.floor(canvas.width * 0.2), y: canvas.height / 2,
                 vy: 0, w: 30, h: 30 };
    }

    // ── Pipe factory ──────────────────────────────
    function makePipe() {
        const margin = 36;
        const topH   = margin + Math.random() * (canvas.height - PIPE_GAP - margin * 2);
        return { x: canvas.width + PIPE_W + 4, topH, bottomY: topH + PIPE_GAP, passed: false };
    }

    // ── Drawing helpers ───────────────────────────
    function drawGrid() {
        ctx.strokeStyle = 'rgba(255,255,255,0.025)';
        ctx.lineWidth   = 1;
        for (let x = 0; x < canvas.width;  x += 40) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 40) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
        }
    }

    function drawPipe(p) {
        const R = 6; // corner radius on pipe caps

        // ── Top pipe body ──
        ctx.fillStyle = '#1c1c1c';
        ctx.fillRect(p.x, 0, PIPE_W, p.topH - R);

        // Top pipe cap (wider, rounded bottom corners)
        ctx.beginPath();
        ctx.roundRect(p.x - 4, p.topH - 20, PIPE_W + 8, 20, [0, 0, R, R]);
        ctx.fill();

        // Red accent line at cap bottom
        ctx.fillStyle = '#E50914';
        ctx.fillRect(p.x - 4, p.topH - 3, PIPE_W + 8, 3);

        // ── Bottom pipe body ──
        ctx.fillStyle = '#1c1c1c';
        ctx.fillRect(p.x, p.bottomY + R, PIPE_W, canvas.height - p.bottomY);

        // Bottom pipe cap (wider, rounded top corners)
        ctx.beginPath();
        ctx.roundRect(p.x - 4, p.bottomY, PIPE_W + 8, 20, [R, R, 0, 0]);
        ctx.fill();

        // Red accent line at cap top
        ctx.fillStyle = '#E50914';
        ctx.fillRect(p.x - 4, p.bottomY, PIPE_W + 8, 3);
    }

    function drawBird(b) {
        ctx.save();
        ctx.translate(b.x + b.w / 2, b.y + b.h / 2);
        const tilt = Math.max(-0.45, Math.min(0.9, b.vy * 0.045));
        ctx.rotate(tilt);

        // Shadow
        ctx.fillStyle = 'rgba(229,9,20,0.22)';
        ctx.beginPath();
        ctx.ellipse(2, b.h / 2 + 2, b.w * 0.45, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body — red rounded square
        ctx.fillStyle = '#E50914';
        ctx.beginPath();
        ctx.roundRect(-b.w / 2, -b.h / 2, b.w, b.h, 8);
        ctx.fill();

        // Inner highlight
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.beginPath();
        ctx.roundRect(-b.w / 2 + 3, -b.h / 2 + 3, b.w - 6, b.h / 2 - 2, [5, 5, 0, 0]);
        ctx.fill();

        // "S" letter
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px "Reenie Beanie", cursive';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('S', 0, 1);

        ctx.restore();
    }

    function drawScore() {
        ctx.font         = 'bold 28px "JetBrains Mono", monospace';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle    = 'rgba(255,255,255,0.12)';
        ctx.fillText(score, canvas.width / 2 + 1, 17);
        ctx.fillStyle    = '#ffffff';
        ctx.fillText(score, canvas.width / 2, 16);
    }

    function drawIdle() {
        ctx.fillStyle = '#0d0d0d';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawGrid();
        // Draw a static centered bird preview
        const b = { x: canvas.width * 0.2 - 15, y: canvas.height / 2 - 15, w: 30, h: 30, vy: 0 };
        drawBird(b);
    }

    // ── Collision ─────────────────────────────────
    function hits(b, p) {
        const pad = 3;
        if (b.x + b.w - pad < p.x - 4 || b.x + pad > p.x + PIPE_W + 4) return false;
        return (b.y + pad < p.topH) || (b.y + b.h - pad > p.bottomY);
    }

    // ── Speed up every 5 points ───────────────────
    function updateSpeed() {
        const level = 1 + Math.floor(score / 5) * 0.12;
        pipeSpeed    = BASE_SPEED   * level;
        pipeInterval = Math.max(900, BASE_INTERVAL / level);
        speedEl.textContent = `×${(pipeSpeed / BASE_SPEED).toFixed(1)}`;
    }

    // ── Game loop ─────────────────────────────────
    function loop(ts) {
        if (!gameActive) return;
        const dt = Math.min(ts - lastTs, 50);
        lastTs = ts;

        // Physics
        bird.vy += GRAVITY;
        bird.y  += bird.vy;

        // Spawn pipes
        pipeTimer += dt;
        if (pipeTimer >= pipeInterval) {
            pipes.push(makePipe());
            pipeTimer = 0;
        }

        // Move & cull pipes
        for (const p of pipes) p.x -= pipeSpeed;
        pipes = pipes.filter(p => p.x + PIPE_W + 4 > -10);

        // Score
        for (const p of pipes) {
            if (!p.passed && bird.x > p.x + PIPE_W) {
                p.passed = true;
                score++;
                scoreEl.textContent = score;
                sfx.score();
                updateSpeed();
            }
        }

        // Death check
        if (bird.y + bird.h > canvas.height || bird.y < 0 || pipes.some(p => hits(bird, p))) {
            sfx.die();
            end(); return;
        }

        // Draw frame
        ctx.fillStyle = '#0d0d0d';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawGrid();
        pipes.forEach(drawPipe);
        drawBird(bird);
        drawScore();

        animId = requestAnimationFrame(loop);
    }

    // ── Start ─────────────────────────────────────
    function start() {
        bird = makeBird();
        pipes = [];
        score = 0;
        pipeTimer = 0;
        pipeSpeed    = BASE_SPEED;
        pipeInterval = BASE_INTERVAL;
        gameActive   = true;
        scoreEl.textContent = 0;
        speedEl.textContent = '×1.0';
        overlay.style.display = 'none';
        lastTs = performance.now();
        animId = requestAnimationFrame(loop);
    }

    // ── End ───────────────────────────────────────
    function end() {
        gameActive = false;
        cancelAnimationFrame(animId); animId = null;
        const isNew = score > best;
        if (isNew) { best = score; bestEl.textContent = best; }
        olScore.textContent   = score > 0 ? `${score} pts` : 'DEAD';
        playBtn.textContent   = 'Try Again →';
        olHint.textContent    = isNew ? '🔥 New best!' : `Best: ${best}`;
        overlay.style.display = 'flex';
        drawIdle();
    }

    // ── Controls ──────────────────────────────────
    function flap(e) {
        if (e) e.preventDefault();
        if (!gameActive) { start(); return; }
        bird.vy = FLAP_V;
        sfx.flap();
    }

    canvas.addEventListener('click', flap);
    canvas.addEventListener('touchstart', flap, { passive: false });
    playBtn.addEventListener('click', start);

    // Space bar — only when canvas is on screen
    document.addEventListener('keydown', e => {
        if (e.code !== 'Space') return;
        const rect = canvas.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            e.preventDefault();
            flap();
        }
    });

    drawIdle();

    // ── Mobile: floating trigger opens game as full-screen modal ──
    const mobileBtn = document.getElementById('fg-mobile-trigger');
    const closeBtn  = document.getElementById('fg-close-btn');
    const gameEl    = document.getElementById('footer-game');

    if (mobileBtn && gameEl) {
        mobileBtn.addEventListener('click', () => {
            gameEl.classList.add('fg-open');
            document.body.style.overflow = 'hidden';
            // Re-measure canvas after modal paint
            requestAnimationFrame(() => { resize(); if (!gameActive) drawIdle(); });
        });
    }

    if (closeBtn && gameEl) {
        closeBtn.addEventListener('click', () => {
            gameEl.classList.remove('fg-open');
            document.body.style.overflow = '';
            if (gameActive) {
                gameActive = false;
                cancelAnimationFrame(animId);
                animId = null;
            }
        });
    }
}

// ====================================
//  INTRO QUOTE — CDG WORD REVEAL
//  "I design experiences across space
//   and interface."
//  Like CDG's "We build what can't be
//  ignored." — pure opacity per word.
// ====================================
function initNhQuoteReveal() {
    const quote = document.querySelector('.nh-quote--reveal');
    if (!quote) return;

    const words = Array.from(quote.querySelectorAll('.nh-word'));
    if (!words.length) return;

    // All words start dim
    words.forEach(w => w.style.setProperty('--nh-reveal', '0'));

    const N = words.length;
    const windowSize = 0.22;
    const totalSpread = 0.65;

    function getRevealForWord(i, progress) {
        const start = (i / Math.max(N - 1, 1)) * totalSpread;
        const end   = start + windowSize;
        return Math.max(0, Math.min(1, (progress - start) / (end - start)));
    }

    const section = quote.closest('section') || document.querySelector('.nh');
    if (!section) return;

    let active = false;
    let rafId  = null;

    function getProgress() {
        const rect = section.getBoundingClientRect();
        const total = section.offsetHeight + window.innerHeight;
        return Math.max(0, Math.min(1, (window.innerHeight - rect.top) / total));
    }

    function tick() {
        const p = getProgress();
        words.forEach((word, i) => {
            word.style.setProperty('--nh-reveal', getRevealForWord(i, p).toFixed(3));
        });
        if (active) rafId = requestAnimationFrame(tick);
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                active = true;
                if (!rafId) rafId = requestAnimationFrame(tick);
            } else {
                active = false;
                if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
                if (getProgress() >= 0.9) {
                    words.forEach(w => w.style.setProperty('--nh-reveal', '1'));
                }
            }
        });
    }, { threshold: 0 });

    observer.observe(section);
}

// ====================================
//  WORK SECTION — CARDENAS SCROLL
//  220vh container | 1.5× scaled scene
//  Cards rise upward on scroll.
//  Text words reveal sequentially like CDG.
// ====================================
function initWorkFloat() {
    const container = document.querySelector('.wf-scroll-container');
    const section   = document.querySelector('.wf-section');
    const scene     = document.getElementById('wf-scene');
    if (!container || !section || !scene) return;

    const cards = Array.from(scene.querySelectorAll('.wf-card'));
    const words = []; // headline removed — no wf-words
    const isMobile = () => window.innerWidth <= 768;

    /* Mouse parallax — gentle nudge only (separate from scroll) */
    let mouseX = 0, mouseY = 0;
    let curMouseX = 0, curMouseY = 0;
    const MOUSE_STRENGTH = 18; // px max offset in scene-space

    /* Scroll progress 0 → 1 */
    function getScrollProgress() {
        const top = container.getBoundingClientRect().top;
        const travel = container.offsetHeight - window.innerHeight;
        return travel > 0 ? Math.max(0, Math.min(1, -top / travel)) : 0;
    }

    /* Parse CSS percentage or px to a scene-relative value */
    function getInitialTop(card) {
        // --wf-y is set as a percentage like "60%"
        const raw = card.style.getPropertyValue('--wf-y') || '50%';
        const pct = parseFloat(raw) / 100;
        // scene inset is 0, but because of 1.5× scale the visual area
        // is smaller — use section height as reference
        return pct * section.offsetHeight;
    }

    /* Total upward travel — snappy with 220vh container */
    const TRAVEL = 1.8;

    let rafId = null;

    function lerp(a, b, t) { return a + (b - a) * t; }

    const cta = document.getElementById('wf-cta');

    function updateOverlays(progress) {
        // CTA fades in at progress 0.55 → 0.75
        if (cta) {
            const cOp = Math.max(0, Math.min(1, (progress - 0.55) / 0.20));
            cta.style.opacity    = cOp.toFixed(3);
            cta.style.visibility = cOp > 0.01 ? 'visible' : 'hidden';
        }
    }

    function tick() {
        if (isMobile()) { rafId = null; return; }

        curMouseX = lerp(curMouseX, mouseX, 0.06);
        curMouseY = lerp(curMouseY, mouseY, 0.06);

        const progress = getScrollProgress();
        const sectionH = section.offsetHeight;

        /* Overlay reveals driven by scroll */
        updateOverlays(progress);

        /* Cards scrolling upward */
        cards.forEach(card => {
            const speed = parseFloat(card.dataset.speed || 1);
            const rot   = card.style.getPropertyValue('--wf-rot') || '0deg';
            const initTop = getInitialTop(card);
            const scrollOffset = progress * TRAVEL * sectionH * speed;
            const mx = curMouseX * MOUSE_STRENGTH * (speed * 0.4);
            const my = curMouseY * MOUSE_STRENGTH * 0.25;
            card.style.top = `${initTop}px`;
            card.style.transform = `rotate(${rot}) translateY(${-scrollOffset + my}px) translateX(${mx}px)`;
        });

        rafId = requestAnimationFrame(tick);
    }

    /* Mouse tracking (normalised –1…+1) */
    section.addEventListener('mousemove', e => {
        if (isMobile()) return;
        const r = section.getBoundingClientRect();
        mouseX = ((e.clientX - r.left) / r.width  - 0.5) * 2;
        mouseY = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    }, { passive: true });

    section.addEventListener('mouseleave', () => { mouseX = 0; mouseY = 0; });

    /* Initialise words to dim state */
    words.forEach(w => w.style.setProperty('--wf-reveal', '0'));

    /* RAF via IntersectionObserver */
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!rafId) rafId = requestAnimationFrame(tick);
            } else {
                if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
                if (cta) { cta.style.opacity = '0'; cta.style.visibility = 'hidden'; }
                if (isMobile()) {
                    cards.forEach(c => { c.style.transform = ''; c.style.top = ''; });
                    words.forEach(w => w.style.setProperty('--wf-reveal', '1'));
                }
            }
        });
    }, { threshold: 0 });

    observer.observe(container);

    /* Mobile cleanup on resize */
    window.addEventListener('resize', () => {
        if (isMobile()) {
            mouseX = 0; mouseY = 0;
            cards.forEach(c => { c.style.transform = ''; c.style.top = ''; });
            words.forEach(w => w.style.setProperty('--wf-reveal', '1'));
        }
    });
}


// ====================================
//  QUOTE STICKY — single element FLIP:
//  scrolls in flow → snaps fixed at
//  current pos → transitions to centre
//  → hides before journey section
// ====================================
function initQuoteSticky() {
    const quote   = document.getElementById('nh-quote-inline');
    const journey = document.getElementById('journey');
    if (!quote) return;

    const isMobile = () => window.innerWidth <= 768;

    // Mobile: no sticky — text scrolls normally
    if (isMobile()) return;

    // ── DESKTOP: FLIP to viewport centre, hide before journey ─────
    let snapped     = false;
    let hidden      = false;
    let placeholder = null;

    function snapToCenter() {
        const rect = quote.getBoundingClientRect();

        // Placeholder keeps layout stable
        placeholder = document.createElement('div');
        placeholder.style.width      = rect.width  + 'px';
        placeholder.style.height     = rect.height + 'px';
        placeholder.style.flexShrink = '0';
        quote.parentNode.insertBefore(placeholder, quote);

        // Fix at EXACT current pixel position — zero visual jump
        quote.style.position   = 'fixed';
        quote.style.top        = rect.top  + 'px';
        quote.style.left       = rect.left + 'px';
        quote.style.width      = rect.width + 'px';
        quote.style.margin     = '0';
        quote.style.zIndex     = '20';
        quote.style.transform  = 'translate(0, 0)';
        quote.style.transition = 'none';

        // Delta to viewport centre
        const dx = window.innerWidth  / 2 - rect.left - rect.width  / 2;
        const dy = window.innerHeight / 2 - rect.top  - rect.height / 2;

        // Two rAFs: paint fixed-at-current-pos first, then animate
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                quote.style.transition = 'transform 0.6s cubic-bezier(0.22,1,0.36,1)';
                quote.style.transform  = `translate(${dx}px, ${dy}px)`;
            });
        });

        snapped = true;
    }

    function unsnap() {
        ['position','top','left','width','margin','zIndex','transition','transform','opacity','visibility']
            .forEach(p => { quote.style[p] = ''; });
        if (placeholder && placeholder.parentNode) {
            placeholder.parentNode.removeChild(placeholder);
            placeholder = null;
        }
        snapped = false;
        hidden  = false;
    }

    function hideQuote() {
        if (hidden) return;
        hidden = true;
        quote.style.transition = 'opacity 0.4s ease, visibility 0.4s';
        quote.style.opacity    = '0';
        quote.style.visibility = 'hidden';
    }

    function update() {
        // Handle runtime resize to mobile
        if (isMobile()) { if (snapped) unsnap(); return; }

        // Hide before journey section
        if (journey) {
            const jTop = journey.getBoundingClientRect().top;
            if (jTop < window.innerHeight + 300) {
                if (snapped) hideQuote();
                return;
            }
            if (hidden) unsnap();
        }

        const rect      = snapped ? placeholder.getBoundingClientRect() : quote.getBoundingClientRect();
        const elCenterY = rect.top + rect.height / 2;
        const vpCenterY = window.innerHeight / 2;

        if (!snapped && elCenterY <= vpCenterY) {
            snapToCenter();
        } else if (snapped && !hidden && placeholder) {
            const pRect = placeholder.getBoundingClientRect();
            if (pRect.top + pRect.height / 2 > vpCenterY) unsnap();
        }
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', () => { if (isMobile() && snapped) unsnap(); }, { passive: true });
    update();
}
