/* ────────────────────────────────────────────
   ① CURSEUR PERSONNALISÉ
   (uniquement sur les appareils avec souris —
   évite le point doré parasite sur mobile/tactile)
──────────────────────────────────────────── */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (cursor && ring && hasFinePointer) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    function animateCursor() {
        cursor.style.left = mx + 'px';
        cursor.style.top = my + 'px';
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('a, button, .service-card, .project-card, .testimonial-card, .gcard').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '20px'; cursor.style.height = '20px';
            ring.style.width = '60px'; ring.style.height = '60px';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '12px'; cursor.style.height = '12px';
            ring.style.width = '36px'; ring.style.height = '36px';
        });
    });
} else if (cursor && ring) {
    // Pas de souris fine détectée (mobile/tactile) : on masque le curseur custom
    cursor.style.display = 'none';
    ring.style.display = 'none';
}


/* ────────────────────────────────────────────
   ② NAV SCROLL (desktop)
──────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
}


/* ────────────────────────────────────────────
   ③ BURGER / DRAWER MOBILE
──────────────────────────────────────────── */
const burger = document.getElementById('navBurger');
const drawer = document.getElementById('navDrawer');
const drawerBackdrop = document.getElementById('drawerBackdrop');
const drawerClose = document.getElementById('drawerClose');
const drawerLinks = document.querySelectorAll('.drawer-link');

function openDrawer() {
    drawer.classList.add('is-open');
    burger.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeDrawer() {
    drawer.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

if (burger) {
    burger.addEventListener('click', () => {
        drawer.classList.contains('is-open') ? closeDrawer() : openDrawer();
    });
}
if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

// Fermer au clic sur un lien du drawer
drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeDrawer();
    });
});

// Fermer avec Échap
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) closeDrawer();
});


/* ────────────────────────────────────────────
   ④ REVEAL AU SCROLL
──────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            // On n'unobserve pas pour conserver l'état
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
});


/* ────────────────────────────────────────────
   ⑤ COMPTEURS ANIMÉS
──────────────────────────────────────────── */
function animateCounter(el, target) {
    const duration = 1400; // ms
    const startTime = performance.now();
    const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // ease in-out quad

    function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.round(ease(progress) * target);
        el.textContent = value;
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            el.textContent = target;
            el.classList.add('done'); // pulse final
        }
    }
    requestAnimationFrame(step);
}

const statsSection = document.getElementById('stats');
let statsTriggered = false;

const statsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !statsTriggered) {
        statsTriggered = true;
        document.querySelectorAll('.stat-number[data-target]').forEach(el => {
            const target = parseInt(el.dataset.target);
            el.removeAttribute('data-target');
            animateCounter(el, target);
        });
    }
}, { threshold: 0.3 });

if (statsSection) statsObserver.observe(statsSection);


/* ────────────────────────────────────────────
   ⑥ PARTICULES HERO DYNAMIQUES
──────────────────────────────────────────── */
(function spawnParticles() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    // Conteneur
    const container = document.createElement('div');
    container.className = 'hero-particles';

    // Lignes scan
    const scan = document.createElement('div');
    scan.className = 'hero-scan';
    hero.appendChild(scan);

    // Particules
    const PARTICLE_COUNT = 28;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = document.createElement('span');
        p.className = 'hero-particle';

        const size = Math.random() * 3 + 1;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const dur = (Math.random() * 10 + 6).toFixed(1);
        const delay = (Math.random() * 8).toFixed(1);
        const tx = (Math.random() * 160 - 80).toFixed(0);
        const ty = -(Math.random() * 180 + 60).toFixed(0);

        p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      top: ${top}%;
      --dur: ${dur}s;
      --delay: ${delay}s;
      --tx: ${tx}px;
      --ty: ${ty}px;
    `;
        container.appendChild(p);
    }
    hero.appendChild(container);
})();


/* ────────────────────────────────────────────
   ⑦ FORMULAIRE FORMSPREE
──────────────────────────────────────────── */

// ⚠️ À REMPLACER : mets ton vrai ID de formulaire Formspree ci-dessous
// (créé sur https://formspree.io — Dashboard > New Form > copie l'ID après "f/")
const FORMSPREE_ID = 'https://formspree.io/f/xdaqyaez';

const cfSubmit = document.getElementById('cfSubmit');
const cfSuccess = document.getElementById('cf-success');
const cfError = document.getElementById('cf-error');

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

if (cfSubmit) {
    cfSubmit.addEventListener('click', async () => {
        const name = document.getElementById('cf-name');
        const email = document.getElementById('cf-email');
        const subject = document.getElementById('cf-subject');
        const message = document.getElementById('cf-message');

        // Validation simple
        const fields = [name, email, message];
        let valid = true;
        fields.forEach(f => {
            if (!f.value.trim()) {
                f.style.borderColor = 'rgba(220,60,60,0.6)';
                f.addEventListener('input', () => { f.style.borderColor = ''; }, { once: true });
                valid = false;
            }
        });
        if (email.value.trim() && !isValidEmail(email.value.trim())) {
            email.style.borderColor = 'rgba(220,60,60,0.6)';
            email.addEventListener('input', () => { email.style.borderColor = ''; }, { once: true });
            valid = false;
        }
        if (!valid) return;

        if (FORMSPREE_ID === 'YOUR_FORM_ID') {
            console.warn('Formspree n\'est pas configuré : remplace FORMSPREE_ID dans script.js par ton vrai ID de formulaire.');
            cfError.style.display = 'flex';
            return;
        }

        // Loading state
        cfSubmit.classList.add('is-loading');
        cfSubmit.disabled = true;
        cfSuccess.style.display = 'none';
        cfError.style.display = 'none';

        const data = {
            name: name.value.trim(),
            email: email.value.trim(),
            subject: subject ? subject.value : 'Contact site',
            message: message.value.trim(),
        };

        try {
            const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                cfSuccess.style.display = 'flex';
                // Reset
                [name, email, message].forEach(f => f.value = '');
                if (subject) subject.value = '';
            } else {
                cfError.style.display = 'flex';
            }
        } catch (_) {
            cfError.style.display = 'flex';
        } finally {
            cfSubmit.classList.remove('is-loading');
            cfSubmit.disabled = false;
        }
    });
}


window.handleSend = function () {
    if (cfSubmit) cfSubmit.click();
};


/* ────────────────────────────────────────────
   ⑧ GALERIE (carrousel + lightbox)
   NB : ce tableau doit rester dans le même ordre
   que les .gcard du HTML (même tag/caption/image).
──────────────────────────────────────────── */
(function () {
    const CARDS = [
        { tag: 'Bantoo Afreecom', caption: 'Forum B2B · Bamako 2023', src: 'assets/Bantoons.png' },
        { tag: 'E-Connect Society', caption: 'Assemblée des partenaires · 2022', src: 'assets/Blue.png' },
        { tag: 'Osmose Digital', caption: 'Lancement campagne · Dakar 2023', src: 'assets/Osmoses.png' },
        { tag: 'BleuPhygital', caption: 'Community Event · Conakry 2024', src: 'assets/Blue.png' },
        { tag: 'Metanoa & Vie', caption: 'Séminaire Transformation · 2024', src: 'assets/E-connect-NOIR.png' },
        { tag: 'SLC', caption: 'Opérations logistiques · Mali 2021', src: 'assets/SLC.png' },
        { tag: 'Bantoo Afreecom', caption: 'Salon Portes Ouvertes · Abidjan 2023', src: 'assets/Bantoons.png' },
        { tag: 'Emery Savio', caption: 'Conférence Afritransformalismes · 2024', src: 'assets/E-connect-NOIR.png' },
        { tag: 'BleuPhygital', caption: 'Lifestyle Night · Bamako 2023', src: 'assets/Blue.png' },
        { tag: 'E-Connect Society', caption: 'Signing Ceremony · Dakar 2022', src: 'assets/E-connect-NOIR.png' },
        { tag: 'Osmose Digital', caption: 'Studio Création · Bamako 2024', src: 'assets/Osmoses.png' },
        { tag: 'Metanoa & Vie', caption: 'Retraite Impact Leaders · 2024', src: 'assets/EMERY-SAVIO.png' },
        { tag: 'Emery Savio', caption: 'Portrait Terrain · 2024', src: 'assets/EMERY-SAVIO.png' },
        { tag: 'Bantoo Afreecom', caption: 'Networking Summit · Douala 2023', src: 'assets/Bantoons.png' },
        { tag: 'E-Connect Society', caption: 'Vision 2030 · Bamako 2024', src: 'assets/E-connect-NOIR.png' },
    ];
    const TOTAL = CARDS.length;

    const track = document.getElementById('galleryTrack');
    const btnPrev = document.getElementById('galleryPrev');
    const btnNext = document.getElementById('galleryNext');
    const progressFill = document.getElementById('galleryProgress');
    const currentNum = document.getElementById('galleryCurrentNum');
    const dotsContainer = document.getElementById('galleryDots');
    const lightbox = document.getElementById('galleryLightbox');
    const lbImg = document.getElementById('lightboxImg');
    const lbInfo = document.getElementById('lightboxInfo');
    const lbClose = document.getElementById('lightboxClose');
    const lbBackdrop = document.getElementById('lightboxBackdrop');
    const lbPrev = document.getElementById('lightboxPrev');
    const lbNext = document.getElementById('lightboxNext');

    if (!track) return;

    // Numérotation des cartes
    Array.from(track.querySelectorAll('.gcard')).forEach((card, i) => {
        card.dataset.num = String(i + 1).padStart(2, '0');
        card.dataset.index = i;
    });

    // ── Dots ──
    function buildDots() {
        dotsContainer.innerHTML = '';
        const visible = Math.min(TOTAL, 7);
        for (let i = 0; i < visible; i++) {
            const btn = document.createElement('button');
            btn.className = 'gdot';
            btn.setAttribute('aria-label', `Image ${i + 1}`);
            btn.addEventListener('click', () => scrollToCard(
                Math.round(i / (visible - 1) * (TOTAL - 1))
            ));
            dotsContainer.appendChild(btn);
        }
    }
    buildDots();

    // ── UI update ──
    function updateUI() {
        const sl = track.scrollLeft;
        const maxScroll = track.scrollWidth - track.clientWidth;
        const ratio = maxScroll > 0 ? sl / maxScroll : 0;

        progressFill.style.width = (ratio * 100) + '%';
        const idx = Math.round(ratio * (TOTAL - 1));
        currentNum.textContent = String(idx + 1).padStart(2, '0');

        const dots = Array.from(dotsContainer.children);
        dots.forEach((dot, i) => {
            const dotIdx = Math.round(i / (dots.length - 1) * (TOTAL - 1));
            dot.classList.toggle('active', Math.abs(idx - dotIdx) < 1);
        });
    }
    track.addEventListener('scroll', updateUI, { passive: true });
    updateUI();

    // ── Scroll to card ──
    function scrollToCard(idx) {
        const cards = Array.from(track.querySelectorAll('.gcard'));
        if (!cards[idx]) return;
        const cardRect = cards[idx].getBoundingClientRect();
        const trackRect = track.getBoundingClientRect();
        track.scrollTo({ left: cardRect.left - trackRect.left + track.scrollLeft - 60, behavior: 'smooth' });
    }

    function stepBy(dir) {
        const maxScroll = track.scrollWidth - track.clientWidth;
        const ratio = maxScroll > 0 ? track.scrollLeft / maxScroll : 0;
        const cur = Math.round(ratio * (TOTAL - 1));
        scrollToCard(Math.max(0, Math.min(TOTAL - 1, cur + dir)));
    }

    if (btnPrev) btnPrev.addEventListener('click', () => stepBy(-1));
    if (btnNext) btnNext.addEventListener('click', () => stepBy(1));

    // ── Drag to scroll ──
    let isDragging = false, dragStartX = 0, dragScroll = 0;
    track.addEventListener('mousedown', e => {
        isDragging = true; dragStartX = e.pageX; dragScroll = track.scrollLeft;
        track.classList.add('is-dragging');
    });
    window.addEventListener('mousemove', e => {
        if (!isDragging) return;
        track.scrollLeft = dragScroll - (e.pageX - dragStartX);
    });
    window.addEventListener('mouseup', () => {
        isDragging = false;
        track.classList.remove('is-dragging');
    });

    // ── Auto-scroll (s'arrête au hover, reprend au leave) ──
    let autoTimer = null;
    const AUTO_INTERVAL = 3800; // ms

    function startAuto() {
        stopAuto();
        autoTimer = setInterval(() => {
            const maxScroll = track.scrollWidth - track.clientWidth;
            if (track.scrollLeft >= maxScroll - 8) {
                track.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                stepBy(1);
            }
        }, AUTO_INTERVAL);
    }

    function stopAuto() { clearInterval(autoTimer); }

    startAuto();
    track.addEventListener('mouseenter', stopAuto);
    track.addEventListener('mouseleave', startAuto);
    track.addEventListener('touchstart', stopAuto, { passive: true });
    track.addEventListener('touchend', startAuto, { passive: true });

    // ── Lightbox ──
    let currentLbIdx = 0;

    function openLightbox(idx) {
        idx = ((idx % TOTAL) + TOTAL) % TOTAL;
        currentLbIdx = idx;
        const card = CARDS[idx];
        lbImg.src = card.src;
        lbImg.alt = card.caption;
        lbInfo.innerHTML = '';
        const tagEl = document.createElement('span');
        tagEl.className = 'lb-tag';
        tagEl.textContent = card.tag;
        const capEl = document.createElement('span');
        capEl.className = 'lb-caption';
        capEl.textContent = card.caption;
        lbInfo.appendChild(tagEl);
        lbInfo.appendChild(capEl);
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
        stopAuto();
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
        startAuto();
    }

    track.querySelectorAll('.gcard').forEach((card, i) => {
        card.addEventListener('click', () => { if (!isDragging) openLightbox(i); });
    });

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbBackdrop) lbBackdrop.addEventListener('click', closeLightbox);
    if (lbPrev) lbPrev.addEventListener('click', () => openLightbox(currentLbIdx - 1));
    if (lbNext) lbNext.addEventListener('click', () => openLightbox(currentLbIdx + 1));

    // Keyboard global (galerie + lightbox)
    document.addEventListener('keydown', e => {
        if (lightbox && lightbox.classList.contains('open')) {
            if (e.key === 'ArrowLeft') openLightbox(currentLbIdx - 1);
            if (e.key === 'ArrowRight') openLightbox(currentLbIdx + 1);
            if (e.key === 'Escape') closeLightbox();
        }
    });
})();