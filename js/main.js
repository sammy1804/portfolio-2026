// ====================================
//  SAMRIDHI PORTFOLIO — Main JS
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initDock();
    initHeroScroll();
    initHeroMeta();
    initHobbies();
    initWorkFilters();
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

    const handleScroll = () => {
        const rect = hero.getBoundingClientRect();
        const scrolled = -rect.top;
        const vh = window.innerHeight;
        const vw = window.innerWidth;

        // Progress: 0 → 1 over 1.5× viewport height
        const progress = Math.max(0, Math.min(1, scrolled / (vh * 1.5)));

        // ── FRAME: shrink from fullscreen to ~456×314 centered, shifted up 84px ──
        const targetW = Math.min(456, vw * 0.32);
        const targetH = 314;

        const frameW = vw - progress * (vw - targetW);
        const frameH = vh - progress * (vh - targetH);

        // Border radius: 0 → 24px
        const radius = progress * 24;

        // Shift upward by 84px at full scroll
        const offsetY = progress * -84;

        frame.style.width = `${frameW}px`;
        frame.style.height = `${frameH}px`;
        frame.style.borderRadius = `${radius}px`;
        frame.style.marginTop = `${offsetY}px`;

        // ── SILHOUETTE: scale down as frame shrinks, fade out near end ──
        if (photo) {
            const photoScale = 1 - progress * 0.2;
            photo.style.transform = `translateX(-50%) scale(${photoScale})`;
            photo.style.opacity = Math.max(0, 1 - progress * 2.5);
        }

        // ── PORTRAIT WRAP: fade in as card forms (progress 0.65 → 1) ──
        if (portraitWrap) {
            portraitWrap.style.opacity = Math.max(0, Math.min(1, (progress - 0.65) / 0.35));
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

        // ── 4 FLOATING CARDS: slide in after 30% progress ──
        const cardStart = 0.3;
        const cardProgress = Math.max(0, Math.min(1, (progress - cardStart) / (1 - cardStart)));

        floatCards.forEach((card, i) => {
            const stagger = i * 0.07;
            const cp = Math.max(0, Math.min(1, (cardProgress - stagger) / (1 - stagger)));
            const eased = 1 - Math.pow(1 - cp, 3);

            card.style.opacity = eased;

            // Final resting tilts (cards settle at a slight angle)
            const restTilt = [-3.5, 3, -2.5, 2.5];

            switch (i) {
                case 0: // Status — from left, rests at -3.5deg
                    card.style.transform = `translateX(${-260 * (1 - eased)}px) rotate(${-7 * (1 - eased) + restTilt[0] * eased}deg)`;
                    break;
                case 1: // Craft — from right, rests at +3deg
                    card.style.transform = `translateX(${260 * (1 - eased)}px) rotate(${6 * (1 - eased) + restTilt[1] * eased}deg)`;
                    break;
                case 2: // Numbers — from bottom-left, rests at -2.5deg
                    card.style.transform = `translate(${-220 * (1 - eased)}px, ${160 * (1 - eased)}px) rotate(${-5 * (1 - eased) + restTilt[2] * eased}deg)`;
                    break;
                case 3: // Ask Me — from bottom-right, rests at +2.5deg
                    card.style.transform = `translate(${220 * (1 - eased)}px, ${120 * (1 - eased)}px) rotate(${5 * (1 - eased) + restTilt[3] * eased}deg)`;
                    break;
            }
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

// ====================================
//  HERO META — live time display
// ====================================
function initHeroMeta() {
    const timeEl = document.getElementById('hero-time');
    if (!timeEl) return;

    function updateTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const mm = minutes < 10 ? '0' + minutes : minutes;
        const hh = hours < 10 ? '0' + hours : hours;
        timeEl.textContent = hh + ':' + mm + ' ' + ampm;
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
    if (overlay) {
        overlay.classList.add('active');
        document.getElementById('chatbot-input')?.focus();
    }
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
    const canvas = document.getElementById('fg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const overlay  = document.getElementById('fg-overlay');
    const scoreEl  = document.getElementById('fg-score');
    const timerEl  = document.getElementById('fg-timer');
    const bestEl   = document.getElementById('fg-best');
    const olScore  = document.getElementById('fg-ol-score');
    const playBtn  = document.getElementById('fg-play-btn');

    let score = 0, best = 0, timeLeft = 30;
    let gameActive = false;
    let shapes = [], animId, countdownId;
    let spawnTimer = 0, spawnInterval = 1200;
    let lastTs = 0;

    // Responsive canvas height
    function resize() {
        const w = canvas.parentElement.offsetWidth;
        canvas.width  = w;
        canvas.height = parseInt(getComputedStyle(canvas).height) || 280;
    }
    resize();
    window.addEventListener('resize', resize);

    // ── Shape class ──────────────────────────────
    class Shape {
        constructor() {
            const m = 48;
            this.x   = m + Math.random() * (canvas.width  - m * 2);
            this.y   = m + Math.random() * (canvas.height - m * 2);
            this.r   = 20 + Math.random() * 16;
            this.rot = (Math.random() - 0.5) * 0.7;
            this.kind = Math.random() > 0.45 ? 'circle' : 'rect';
            this.life  = 1300 + Math.random() * 500;
            this.age   = 0;
            this.hit   = false;
            this.hitAge = 0;
        }

        get alive() {
            return this.hit ? this.hitAge < 260 : this.age < this.life;
        }

        get alpha() {
            if (this.hit) return Math.max(0, 1 - this.hitAge / 200);
            const t = this.age / this.life;
            if (t < 0.15) return t / 0.15;
            if (t > 0.72) return 1 - (t - 0.72) / 0.28;
            return 1;
        }

        update(dt) {
            this.age += dt;
            if (this.hit) this.hitAge += dt;
        }

        draw() {
            const a = Math.max(0, this.alpha);
            ctx.save();
            ctx.globalAlpha = a;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rot);

            if (this.hit) {
                // Burst ring on hit
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                const sr = this.r + this.hitAge * 0.12;
                ctx.beginPath(); ctx.arc(0, 0, sr, 0, Math.PI * 2); ctx.stroke();
                ctx.fillStyle = 'rgba(255,255,255,0.3)';
                ctx.beginPath(); ctx.arc(0, 0, this.r * 0.6, 0, Math.PI * 2); ctx.fill();
            } else {
                ctx.fillStyle = '#E63226';
                if (this.kind === 'circle') {
                    ctx.beginPath(); ctx.arc(0, 0, this.r, 0, Math.PI * 2); ctx.fill();
                } else {
                    ctx.beginPath();
                    const w = this.r * 2, h = this.r * 1.1;
                    ctx.roundRect(-w / 2, -h / 2, w, h, 4);
                    ctx.fill();
                }
            }
            ctx.restore();
        }

        contains(mx, my) {
            return Math.hypot(mx - this.x, my - this.y) < this.r * 1.5;
        }
    }

    // ── Draw idle screen ──────────────────────────
    function drawIdle() {
        ctx.fillStyle = '#0d0d0d';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    drawIdle();

    // ── Game loop ─────────────────────────────────
    function loop(ts) {
        if (!gameActive) return;
        const dt = Math.min(ts - lastTs, 60);
        lastTs = ts;
        spawnTimer += dt;

        if (spawnTimer >= spawnInterval) {
            shapes.push(new Shape());
            spawnTimer = 0;
            spawnInterval = Math.max(450, spawnInterval - 12);
        }

        ctx.fillStyle = '#0d0d0d';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Subtle grid lines
        ctx.strokeStyle = 'rgba(255,255,255,0.025)';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 40) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 40) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
        }

        shapes = shapes.filter(s => s.alive);
        shapes.forEach(s => { s.update(dt); s.draw(); });

        animId = requestAnimationFrame(loop);
    }

    // ── Start game ────────────────────────────────
    function start() {
        score = 0; timeLeft = 30; gameActive = true;
        shapes = []; spawnTimer = 0; spawnInterval = 1200;
        scoreEl.textContent = 0;
        timerEl.textContent = '0:30';
        overlay.style.display = 'none';
        lastTs = performance.now();
        animId = requestAnimationFrame(loop);

        countdownId = setInterval(() => {
            timeLeft--;
            const s = timeLeft.toString().padStart(2, '0');
            timerEl.textContent = `0:${s}`;
            if (timeLeft <= 0) end();
        }, 1000);
    }

    // ── End game ──────────────────────────────────
    function end() {
        gameActive = false;
        cancelAnimationFrame(animId);
        clearInterval(countdownId);

        const isNew = score > best;
        if (isNew) { best = score; bestEl.textContent = best; }

        olScore.textContent = `${score} pts`;
        playBtn.textContent = 'Play Again →';
        document.getElementById('fg-ol-hint').textContent =
            isNew ? '🔥 New best score!' : `Best: ${best}`;
        overlay.style.display = 'flex';

        drawIdle();
    }

    // ── Click / tap to catch ──────────────────────
    function onHit(e) {
        if (!gameActive) return;
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const src  = e.touches ? e.touches[0] : e;
        const mx = (src.clientX - rect.left) * (canvas.width  / rect.width);
        const my = (src.clientY - rect.top)  * (canvas.height / rect.height);

        for (let i = shapes.length - 1; i >= 0; i--) {
            const s = shapes[i];
            if (!s.hit && s.contains(mx, my)) {
                s.hit = true;
                score++;
                scoreEl.textContent = score;
                break;
            }
        }
    }

    canvas.addEventListener('click', onHit);
    canvas.addEventListener('touchstart', onHit, { passive: false });
    playBtn.addEventListener('click', start);
}
