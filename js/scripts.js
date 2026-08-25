/*!
    Title: Dev Portfolio Template
    Version: 1.3.0
    Last Change: 08/24/2026
    Author: Rajesh Kodaganti
    Description: Portfolio scripts for Rajesh Kodaganti (Vanilla JS)
*/

document.addEventListener('DOMContentLoaded', function () {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const isSmallScreen = window.innerWidth < 768;

    if (isCoarsePointer) {
        document.body.classList.add('is-touch');
    }

    initSplashScreen(prefersReducedMotion);
    initStaticAccessibility();
    initLazyCreativeLab();

    // 1. Load Profile Data from config.js
    if (window.PROFILE_DATA) {
        const data = window.PROFILE_DATA;

        // Social Links (using data-link attribute)
        const socialLinks = {
            'github': data.social.github,
            'linkedin': data.social.linkedin,
            'email': data.social.email,
            'learn': data.social.learn
        };

        // Update all elements with data-link attribute
        for (const [key, url] of Object.entries(socialLinks)) {
            document.querySelectorAll(`[data-link="${key}"]`).forEach(el => {
                el.href = url;
            });
        }
    }

    // Mobile Menu Logic
    const header = document.querySelector('header');
    const mobileMenuOpen = document.getElementById('mobile-menu-open');
    const mobileMenuClose = document.getElementById('mobile-menu-close');

    if (mobileMenuOpen) {
        mobileMenuOpen.addEventListener('click', () => {
            header.classList.add('active');
            document.body.classList.add('active');
        });
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', () => {
            header.classList.remove('active');
            document.body.classList.remove('active');
        });
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('header a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Treat as normal link if no-scroll class
            if (this.classList.contains('no-scroll')) return;

            const targetId = this.getAttribute('href');

            // Only prevent default if it's an anchor link (starts with #)
            if (!targetId.startsWith('#')) return;

            e.preventDefault();
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = getHeaderOffset();
                const scrollDistance = targetElement.offsetTop - headerOffset;

                window.scrollTo({
                    top: scrollDistance,
                    behavior: 'smooth'
                });

                // Hide the menu once clicked if mobile
                if (header.classList.contains('active')) {
                    header.classList.remove('active');
                    document.body.classList.remove('active');
                }
            }
        });
    });

    initTypewriter(prefersReducedMotion);
    initRevealOnScroll(prefersReducedMotion);
    initCursorGlow(prefersReducedMotion, isCoarsePointer);
    initInterestCardTilt(prefersReducedMotion, isCoarsePointer);
    initConsolePulse(prefersReducedMotion, isSmallScreen);
    initHeroCanvas(prefersReducedMotion, isSmallScreen, isCoarsePointer);
    initTerminalCommandCenter();
    initScrollProgress();

    const initDesktopEffects = () => {
        initMagneticButtons(prefersReducedMotion, isCoarsePointer);
        initPointerReactiveGlow(isCoarsePointer);
    };

    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(initDesktopEffects, { timeout: 900 });
    } else {
        setTimeout(initDesktopEffects, 150);
    }

    initLogoEntrance(prefersReducedMotion);
    initNavigationTelemetry();
    initCommandPalette();
    initCardChromeNormalization();
});

function initStaticAccessibility() {
    document.querySelectorAll('[data-current-year]').forEach(element => {
        element.textContent = String(new Date().getFullYear());
    });

    document.querySelectorAll('[data-education-id]').forEach(card => {
        const open = () => openEducationModal(card.dataset.educationId);
        card.addEventListener('click', open);
        card.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                open();
            }
        });
    });
}

function initLazyCreativeLab() {
    loadFeatureOnDemand('gamesButton', 'js/multi-games.js?v=6', 'initMultiGames');
    loadFeatureOnDemand('techGamesButton', 'js/tech-games.js?v=6', 'initTechGames');
}

function loadFeatureOnDemand(buttonId, src, initializerName) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    const load = async event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        button.removeEventListener('click', load, true);
        button.disabled = true;
        button.setAttribute('aria-busy', 'true');

        try {
            await loadScript(src);
            if (typeof window[initializerName] === 'function') window[initializerName]();
        } finally {
            button.disabled = false;
            button.removeAttribute('aria-busy');
        }

        button.click();
    };

    button.addEventListener('click', load, true);
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Unable to load ${src}`));
        document.head.appendChild(script);
    });
}

function initSplashScreen(prefersReducedMotion) {
    const splash = document.getElementById('splash-screen');
    const target = document.getElementById('splash-type-target');
    if (!splash || !target) return;

    const welcomes = [
        'Welcome back, engineer. Compiling ideas...',
        'Hello, visitor. Booting intelligent systems.',
        'Session ready. Let us ship something meaningful.',
        'Initializing portfolio with production mindset.',
        'Terminal online. Exploring Rajesh build logs.'
    ];

    const randomLine = welcomes[Math.floor(Math.random() * welcomes.length)];
    document.body.classList.add('splash-active');

    const hideSplash = () => {
        splash.classList.add('hidden');
        document.body.classList.remove('splash-active');
    };

    if (prefersReducedMotion) {
        target.textContent = randomLine;
        setTimeout(hideSplash, 700);
        return;
    }

    let idx = 0;
    const type = () => {
        if (idx <= randomLine.length) {
            target.textContent = randomLine.slice(0, idx);
            idx += 1;
            setTimeout(type, 40);
            return;
        }
        setTimeout(hideSplash, 850);
    };

    type();
}

function initTypewriter(prefersReducedMotion) {
    const target = document.querySelector('.type-target');
    if (!target) return;

    const text = target.dataset.text || '';
    if (prefersReducedMotion) {
        target.textContent = text;
        return;
    }

    let index = 0;
    const writeNext = () => {
        if (index > text.length) {
            setTimeout(() => {
                index = 0;
                target.textContent = '';
                writeNext();
            }, 1600);
            return;
        }
        target.textContent = text.slice(0, index);
        index += 1;
        setTimeout(writeNext, 80);
    };

    writeNext();
}

function initRevealOnScroll(prefersReducedMotion) {
    // Auto-tag static grid children so homepage sections cascade in like the subpages.
    const autoGridSelectors = ['.experience-grid', '.education-grid', '.interests-grid'];
    autoGridSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(grid => {
            Array.from(grid.children).forEach(child => {
                if (child.nodeType === 1 && !child.classList.contains('reveal')) {
                    child.classList.add('reveal');
                    if (!child.hasAttribute('data-reveal')) child.setAttribute('data-reveal', 'up');
                }
            });
        });
    });

    const revealItems = document.querySelectorAll('.reveal');
    if (!revealItems.length) return;

    // Stagger siblings that share a parent for a cascading entrance.
    const countByParent = new Map();
    revealItems.forEach(item => {
        const parent = item.parentElement;
        const i = countByParent.get(parent) || 0;
        countByParent.set(parent, i + 1);
        item.style.transitionDelay = `${Math.min(i * 55, 330)}ms`;
    });

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        revealItems.forEach(item => {
            item.style.transitionDelay = '0ms';
            item.classList.add('in-view');
        });
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    revealItems.forEach(item => observer.observe(item));
}

function initCursorGlow(prefersReducedMotion, isCoarsePointer) {
    const glow = document.querySelector('.cursor-glow');
    if (!glow || prefersReducedMotion || isCoarsePointer) return;

    let rafId = null;
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let active = false;

    const stop = () => {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    };

    const animate = () => {
        if (!active) return;
        x += (targetX - x) * 0.14;
        y += (targetY - y) * 0.14;
        glow.style.transform = `translate(${x - 210}px, ${y - 210}px)`;
        rafId = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', (event) => {
        targetX = event.clientX;
        targetY = event.clientY;
        glow.style.opacity = '1';
        active = true;
        if (!rafId) rafId = requestAnimationFrame(animate);
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        active = false;
        glow.style.opacity = '0';
        stop();
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            active = false;
            stop();
            glow.style.opacity = '0';
        }
    });
}

function initInterestCardTilt(prefersReducedMotion, isCoarsePointer) {
    if (prefersReducedMotion || isCoarsePointer || window.innerWidth < 992) return;

    const cards = document.querySelectorAll('.interest-card');
    cards.forEach(card => {
        if (card.dataset.tiltBound === '1') return;
        card.dataset.tiltBound = '1';

        card.addEventListener('mousemove', (event) => {
            const rect = card.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width;
            const py = (event.clientY - rect.top) / rect.height;
            const rotateY = (px - 0.5) * 10;
            const rotateX = (0.5 - py) * 10;
            card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

function initConsolePulse(prefersReducedMotion, isSmallScreen) {
    if (prefersReducedMotion || isSmallScreen) return;

    const lines = document.querySelectorAll('.console-stream span');
    if (!lines.length) return;

    let active = 0;
    setInterval(() => {
        lines.forEach((line, idx) => {
            line.style.color = idx === active ? 'var(--accent-yellow)' : '#8fdfae';
            line.style.opacity = idx === active ? '1' : '0.85';
        });
        active = (active + 1) % lines.length;
    }, 900);
}

function initTerminalCommandCenter() {
    const form = document.getElementById('terminal-form');
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');
    if (!form || !input || !output) return;

    const commandMap = {
        help: 'Commands: about, stack, projects, contact, clear',
        about: 'Software Engineer focused on AI systems, data pipelines, and secure architecture.',
        stack: 'Python, Azure OpenAI, ETL, RAG, FastAPI, Cloud Security, DevOps.',
        projects: 'Featured: Sentinel orchestrator, GasOps extraction, ConvIR denoiser.',
        contact: 'Email: rajeshkodaganti.work@gmail.com | LinkedIn and GitHub links above.',
        clear: '__clear__'
    };

    const appendLine = (text, type = 'stream') => {
        const p = document.createElement('p');
        p.className = type === 'command' ? '' : 'console-stream';
        p.innerHTML = type === 'command'
            ? `<span class="prompt">$</span> ${text}`
            : `<span>${text}</span>`;
        output.appendChild(p);
        output.scrollTop = output.scrollHeight;
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const raw = input.value.trim();
        if (!raw) return;

        const cmd = raw.toLowerCase();
        appendLine(raw, 'command');

        if (commandMap[cmd] === '__clear__') {
            output.innerHTML = '';
        } else {
            const response = commandMap[cmd] || `Unknown command: ${raw}. Try 'help'.`;
            appendLine(response);
        }

        input.value = '';
    });
}

function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    let ticking = false;

    const update = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    }, { passive: true });
    update();
}

function initMagneticButtons(prefersReducedMotion, isCoarsePointer) {
    if (prefersReducedMotion || isCoarsePointer || window.innerWidth < 992) return;

    const buttons = document.querySelectorAll('.btn-fun');
    buttons.forEach(button => {
        if (button.dataset.magneticBound === '1') return;
        button.dataset.magneticBound = '1';
        button.classList.add('magnetic-hover');

        button.addEventListener('mousemove', (event) => {
            const rect = button.getBoundingClientRect();
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;
            button.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });
}

function initPointerReactiveGlow(isCoarsePointer) {
    if (isCoarsePointer) return;

    const cards = document.querySelectorAll('.browser-card, .interest-card');
    if (!cards.length) return;

    cards.forEach(card => {
        if (card.dataset.glowBound === '1') return;
        card.dataset.glowBound = '1';

        card.addEventListener('mousemove', (event) => {
            const rect = card.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = ((event.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mx', `${x}%`);
            card.style.setProperty('--my', `${y}%`);
        });
    });
}

function initHeroCanvas(prefersReducedMotion, isSmallScreen, isCoarsePointer) {
    const canvas = document.getElementById('hero-canvas');
    const lead = document.getElementById('lead');
    if (!canvas || !lead || prefersReducedMotion || isSmallScreen || isCoarsePointer) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles = [];
    let rafId = null;
    let isActive = true;
    let viewportWidth = 0;
    let viewportHeight = 0;

    const getParticleCount = () => {
        if (window.innerWidth < 640) return 24;
        if (window.innerWidth < 992) return 36;
        return 52;
    };

    const resize = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, 1.6);
        viewportWidth = lead.clientWidth;
        viewportHeight = lead.clientHeight;
        canvas.width = Math.floor(viewportWidth * ratio);
        canvas.height = Math.floor(viewportHeight * ratio);
        canvas.style.width = `${viewportWidth}px`;
        canvas.style.height = `${viewportHeight}px`;
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const createParticle = () => ({
        x: Math.random() * viewportWidth,
        y: Math.random() * viewportHeight,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 1.8 + 0.8
    });

    const init = () => {
        particles.length = 0;
        const particleCount = getParticleCount();
        for (let i = 0; i < particleCount; i += 1) {
            particles.push(createParticle());
        }
    };

    const draw = () => {
        if (!isActive) return;
        ctx.clearRect(0, 0, viewportWidth, viewportHeight);

        for (let i = 0; i < particles.length; i += 1) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > viewportWidth) p.vx *= -1;
            if (p.y < 0 || p.y > viewportHeight) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(139, 233, 253, 0.65)';
            ctx.fill();

            for (let j = i + 1; j < particles.length; j += 1) {
                const q = particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 125) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(0, 255, 157, ${(1 - dist / 125) * 0.24})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        rafId = requestAnimationFrame(draw);
    };

    resize();
    init();
    draw();

    window.addEventListener('resize', () => {
        resize();
        init();
    });

    const observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        isActive = entry.isIntersecting && !document.hidden;
        if (isActive && !rafId) {
            draw();
        }
        if (!isActive && rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }, { threshold: 0.05 });

    observer.observe(lead);

    document.addEventListener('visibilitychange', () => {
        isActive = !document.hidden;
        if (isActive && !rafId) {
            draw();
        }
        if (!isActive && rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    });
}

function initLogoEntrance(prefersReducedMotion) {
    if (prefersReducedMotion) {
        document.body.classList.add('site-ready');
        return;
    }

    requestAnimationFrame(() => {
        document.body.classList.add('site-ready');
    });
}

function initNavigationTelemetry() {
    const links = Array.from(document.querySelectorAll('#menu a[href^="#"]'));
    const breadcrumb = document.getElementById('nav-breadcrumb');
    if (!links.length) return;

    const sections = links
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if (!sections.length) return;

    const setActive = (id) => {
        links.forEach(link => {
            const active = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', active);
        });

        if (breadcrumb) {
            const label = id.replace(/-/g, ' ');
            breadcrumb.textContent = `root / ${label}`;
        }
    };

    const observer = new IntersectionObserver((entries) => {
        const visible = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible && visible.target.id) {
            setActive(visible.target.id);
        }
    }, {
        threshold: [0.2, 0.45, 0.7],
        rootMargin: '-20% 0px -45% 0px'
    });

    sections.forEach(section => observer.observe(section));
}

function initCommandPalette() {
    const palette = document.getElementById('command-palette');
    const list = document.getElementById('palette-list');
    const input = document.getElementById('palette-input');
    const closeBtn = document.getElementById('palette-close');
    if (!palette || !list || !input || !closeBtn) return;

    const commands = [
        { id: 'go-about', label: 'Go to About', shortcut: 'A', run: () => scrollToId('about') },
        { id: 'go-experience', label: 'Go to Experience', shortcut: 'E', run: () => scrollToId('experience') },
        { id: 'go-projects', label: 'Go to Projects', shortcut: 'P', run: () => scrollToId('projects') },
        { id: 'go-contact', label: 'Go to Contact', shortcut: 'C', run: () => scrollToId('contact') },
        { id: 'open-resume', label: 'Open Resume', shortcut: 'R', run: () => window.open('resume.pdf', '_blank', 'noopener') },
        { id: 'open-books', label: 'Open Books', shortcut: 'B', run: () => { window.location.href = 'books.html'; } }
    ];

    let filtered = commands.slice();
    let activeIndex = 0;

    const open = () => {
        palette.classList.add('open');
        palette.setAttribute('aria-hidden', 'false');
        document.body.classList.add('splash-active');
        input.value = '';
        filtered = commands.slice();
        activeIndex = 0;
        render();
        setTimeout(() => input.focus(), 10);
    };

    const close = () => {
        palette.classList.remove('open');
        palette.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('splash-active');
    };

    const render = () => {
        list.innerHTML = '';
        filtered.forEach((item, idx) => {
            const li = document.createElement('li');
            if (idx === activeIndex) li.classList.add('active');
            li.innerHTML = `<span>${item.label}</span><span class="palette-shortcut">${item.shortcut}</span>`;
            li.addEventListener('click', () => {
                item.run();
                close();
            });
            list.appendChild(li);
        });
    };

    input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        filtered = commands.filter(item => item.label.toLowerCase().includes(q));
        activeIndex = 0;
        render();
    });

    input.addEventListener('keydown', (event) => {
        if (!filtered.length) return;

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            activeIndex = (activeIndex + 1) % filtered.length;
            render();
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            activeIndex = (activeIndex - 1 + filtered.length) % filtered.length;
            render();
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            filtered[activeIndex].run();
            close();
        }
    });

    document.addEventListener('keydown', (event) => {
        const openShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
        if (openShortcut) {
            event.preventDefault();
            if (palette.classList.contains('open')) {
                close();
            } else {
                open();
            }
            return;
        }

        if (event.key === 'Escape' && palette.classList.contains('open')) {
            close();
        }
    });

    closeBtn.addEventListener('click', close);
    palette.querySelector('.palette-backdrop')?.addEventListener('click', close);
}

function scrollToId(id) {
    const target = document.getElementById(id);
    if (!target) return;

    window.scrollTo({
        top: target.offsetTop - getHeaderOffset(),
        behavior: 'smooth'
    });
}

function getHeaderOffset() {
    const headerEl = document.querySelector('header');
    if (!headerEl) return 0;
    return headerEl.offsetHeight + 8;
}

function initCardChromeNormalization() {
    const normalize = () => {
        const cards = document.querySelectorAll('.browser-card');
        cards.forEach((card, idx) => {
            const header = card.querySelector('.browser-header');
            const title = card.querySelector('h3');
            if (!header || !title) return;

            const bar = header.querySelector('.browser-address-bar');
            if (bar && !bar.textContent.trim()) {
                const file = title.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24) || `module-${idx + 1}`;
                bar.textContent = `${file}.ts`;
            }

            if (!header.querySelector('.status-chip')) {
                const chip = document.createElement('span');
                chip.className = 'status-chip stable';
                chip.textContent = 'Stable';
                header.appendChild(chip);
            }
        });
    };

    normalize();
    setTimeout(normalize, 450);
}
