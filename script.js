'use strict';

/* ============================================================
   1. STORY MA'LUMOTLARI
   ============================================================ */
const STORIES = [
    {
        name: 'SURVEY',
        media: [
            { type: 'image', src: 'asilbek_sodiqov.jpg', duration: 7000 }
        ],
        action: {
            label: 'Ishtirok etish',
            icon:  'fas fa-arrow-right',
            url:   'https://sodiqov.uz/survey'
        }
    },
    {
        name: 'KARYERA',
        media: [
            { type: 'image', src: 'stories/media/career1.jpg', duration: 5000 },
            { type: 'image', src: 'stories/media/career2.jpg', duration: 5000 }
        ],
        action: null
    },
    {
        name: 'LOYIHALAR',
        media: [
            { type: 'image', src: 'stories/media/project1.jpg',       duration: 5000 },
            { type: 'video', src: 'stories/media/project1_video.mp4'               }
        ],
        action: null
    },
    {
        name: 'KUNIM',
        media: [
            { type: 'image', src: 'stories/media/day1.jpg', duration: 4000 },
            { type: 'video', src: 'stories/media/day2.mp4'                 },
            { type: 'image', src: 'stories/media/day3.jpg', duration: 4000 }
        ],
        action: null
    },
    {
        name: 'BILIM',
        media: [
            { type: 'image', src: 'stories/media/edu1.jpg', duration: 5000 },
            { type: 'image', src: 'stories/media/edu2.jpg', duration: 5000 }
        ],
        action: null
    },
    {
        name: 'HOBBY',
        media: [
            { type: 'video', src: 'stories/media/hobby1.mp4'               },
            { type: 'image', src: 'stories/media/hobby2.jpg', duration: 5000 }
        ],
        action: null
    }
];


/* ============================================================
   2. DOM ELEMENTLAR
   ============================================================ */
const dom = {
    overlay:   document.getElementById('storyOverlay'),
    progress:  document.getElementById('storyProgress'),
    title:     document.getElementById('storyTitleText'),
    img:       document.getElementById('storyImg'),
    video:     document.getElementById('storyVideo'),
    action:    document.getElementById('storyAction'),
    close:     document.getElementById('storyClose'),
    tapPrev:   document.getElementById('storyTapPrev'),
    tapNext:   document.getElementById('storyTapNext')
};


/* ============================================================
   3. PLAYER HOLATI
   ============================================================ */
const player = {
    storyIdx:   0,
    mediaIdx:   0,
    timer:      null,
    rafId:      null,
    rafStart:   0,
    duration:   0,
    paused:     false,
    open:       false
};

// Ring animatsiyasi davom etayotgan vaqtda boshqa bosishni bloklash
let ringAnimating = false;


/* ============================================================
   4. STORY OCHISH
   ============================================================ */
function openStory(storyIdx) {
    // Indeks doirasini tekshirish
    if (storyIdx < 0 || storyIdx >= STORIES.length) return;

    player.storyIdx = storyIdx;
    player.mediaIdx = 0;
    player.paused   = false;
    player.open     = true;

    dom.overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    _loadMedia();
}


/* ============================================================
   5. STORY YOPISH
   ============================================================ */
function closeStory() {
    _stopAll();

    player.open = false;
    dom.overlay.classList.remove('open');
    document.body.style.overflow = '';

    // Media tozalash — onload/onended hodisalarini ham o'chirish
    dom.img.onload  = null;
    dom.img.onerror = null;
    dom.img.classList.remove('visible');
    dom.img.src = '';

    dom.video.oncanplay       = null;
    dom.video.onloadedmetadata = null;
    dom.video.onended         = null;
    dom.video.onerror         = null;
    dom.video.classList.remove('visible');
    dom.video.pause();
    dom.video.src = '';
}


/* ============================================================
   6. MEDIA YUKLASH (ichki)
   ============================================================ */
function _loadMedia() {
    const story = STORIES[player.storyIdx];
    const media = story.media[player.mediaIdx];

    // Sarlavha
    dom.title.textContent = story.name;

    // Oldingi vaqtlayuvchilar va hodisalarni to'xtatish
    _stopAll();
    _clearMediaEvents();

    // Ikkala element yashirish
    dom.img.classList.remove('visible');
    dom.video.classList.remove('visible');
    dom.video.pause();
    dom.video.src = '';

    // Progress barlar qayta qurish
    _buildBars(story.media.length);

    // Action tugma
    _renderAction(story.action);

    // --- Rasm ---
    if (media.type === 'image') {
        dom.img.src = media.src;

        const onReady = () => {
            // Agar story yopilgan bo'lsa ishlatma
            if (!player.open) return;
            dom.img.classList.add('visible');
            _startProgress(media.duration);
            player.timer = setTimeout(_onMediaEnd, media.duration);
        };

        dom.img.onload  = onReady;
        dom.img.onerror = () => { if (player.open) _onMediaEnd(); };

        // Keshda tayyor bo'lsa onload otmasligini hisobga olamiz
        if (dom.img.complete && dom.img.naturalWidth > 0) {
            dom.img.onload  = null;
            dom.img.onerror = null;
            onReady();
        }

    // --- Video ---
    } else {
        dom.video.src = media.src;
        dom.video.load();
        dom.video.currentTime = 0;

        dom.video.oncanplay = () => {
            if (!player.open) return;
            // Bir marta ishlashi uchun darhol o'chiramiz
            dom.video.oncanplay = null;

            dom.video.classList.add('visible');
            dom.video.play().catch(() => {});

            const startWithDuration = () => {
                if (!player.open) return;
                const dur = (dom.video.duration || 10) * 1000;
                _startProgress(dur);
            };

            if (dom.video.duration && !isNaN(dom.video.duration)) {
                startWithDuration();
            } else {
                dom.video.onloadedmetadata = () => {
                    dom.video.onloadedmetadata = null;
                    startWithDuration();
                };
            }
        };

        dom.video.onended = () => { if (player.open) _onMediaEnd(); };
        dom.video.onerror = () => { if (player.open) _onMediaEnd(); };
    }
}

// Barcha media hodisalarini tozalash
function _clearMediaEvents() {
    dom.img.onload             = null;
    dom.img.onerror            = null;
    dom.video.oncanplay        = null;
    dom.video.onloadedmetadata = null;
    dom.video.onended          = null;
    dom.video.onerror          = null;
}


/* ============================================================
   7. PROGRESS BAR BOSHQARUVI
   ============================================================ */
function _buildBars(count) {
    dom.progress.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const bar  = document.createElement('div');
        bar.className = 'progress-bar';

        const fill = document.createElement('div');
        fill.className = 'progress-fill';

        if (i < player.mediaIdx)      fill.style.width = '100%';
        else if (i === player.mediaIdx) fill.style.width = '0%';

        bar.appendChild(fill);
        dom.progress.appendChild(bar);
    }
}

function _startProgress(duration) {
    player.duration = duration;
    player.rafStart = performance.now();

    const fills      = dom.progress.querySelectorAll('.progress-fill');
    const activeFill = fills[player.mediaIdx];
    if (!activeFill) return;

    // O'tganlarni to'ldirish
    for (let i = 0; i < player.mediaIdx; i++) {
        if (fills[i]) fills[i].style.width = '100%';
    }
    activeFill.style.width = '0%';

    let pauseStart = 0;

    function tick(now) {
        if (!player.open) return;

        if (player.paused) {
            if (pauseStart === 0) pauseStart = now;
            player.rafId = requestAnimationFrame(tick);
            return;
        }

        if (pauseStart > 0) {
            player.rafStart += now - pauseStart;
            pauseStart = 0;
        }

        const elapsed = now - player.rafStart;
        const pct     = Math.min((elapsed / duration) * 100, 100);
        activeFill.style.width = pct + '%';

        if (pct < 100) {
            player.rafId = requestAnimationFrame(tick);
        }
    }

    player.rafId = requestAnimationFrame(tick);
}

function _stopAll() {
    clearTimeout(player.timer);
    cancelAnimationFrame(player.rafId);
    player.timer = null;
    player.rafId = null;
}


/* ============================================================
   8. NAVIGATSIYA
   ============================================================ */
function _onMediaEnd() {
    const story = STORIES[player.storyIdx];
    if (player.mediaIdx < story.media.length - 1) {
        player.mediaIdx++;
        _loadMedia();
    } else {
        if (player.storyIdx < STORIES.length - 1) {
            player.storyIdx++;
            player.mediaIdx = 0;
            _loadMedia();
        } else {
            closeStory();
        }
    }
}

function goNext() {
    if (!player.open) return;
    _stopAll();
    _onMediaEnd();
}

function goPrev() {
    if (!player.open) return;
    _stopAll();

    if (player.mediaIdx > 0) {
        player.mediaIdx--;
        _loadMedia();
    } else if (player.storyIdx > 0) {
        player.storyIdx--;
        player.mediaIdx = 0;
        _loadMedia();
    }
}


/* ============================================================
   9. ACTION TUGMA
   ============================================================ */
function _renderAction(action) {
    dom.action.innerHTML = '';
    if (!action) return;

    const btn = document.createElement('button');
    btn.className = 'story-action-btn';
    btn.innerHTML = `<i class="${action.icon}"></i>${action.label}`;
    btn.addEventListener('click', e => {
        e.stopPropagation();
        window.open(action.url, '_blank');
    });
    dom.action.appendChild(btn);
}


/* ============================================================
   10. STORY ITEM EVENTLARI
   ============================================================ */
document.querySelectorAll('.story-item').forEach(item => {
    // data-story attributini olish va tekshirish
    const idxAttr = item.dataset.story;
    if (idxAttr === undefined || idxAttr === '') return; // story indeksi yo'q
    const idx = parseInt(idxAttr, 10);
    if (isNaN(idx) || idx < 0 || idx >= STORIES.length) return; // noto'g'ri indeks

    const ring     = item.querySelector('.story-ring');
    const coverImg = item.querySelector('.cover-img');

    // Original src ni to'g'ri saqlash (getAttribute bilan — to'liq URL emas)
    if (coverImg) {
        coverImg.dataset.original = coverImg.getAttribute('src');
    }

    // Hover: cover almashtirish
    const hoverSrc = coverImg?.dataset.hover;
    if (hoverSrc && coverImg) {
        item.addEventListener('mouseenter', () => {
            coverImg.src = hoverSrc;
        });
        item.addEventListener('mouseleave', () => {
            coverImg.src = coverImg.dataset.original;
        });
    }

    // Bosish: ring bir marta aylansin → story ochilsin
    item.addEventListener('click', () => {
        // Animatsiya davom etayotgan bo'lsa ikkinchi marta bosilishini e'tiborsiz qoldirish
        if (ringAnimating) return;

        if (!ring) {
            openStory(idx);
            return;
        }

        ringAnimating = true;
        ring.classList.remove('spinning');
        void ring.offsetWidth; // reflow — animatsiyani qayta boshlash uchun
        ring.classList.add('spinning');

        setTimeout(() => {
            ring.classList.remove('spinning');
            ringAnimating = false;
            openStory(idx); // idx closure orqali to'g'ri saqlanadi
        }, 650);
    });
});


/* ============================================================
   11. OVERLAY EVENTLARI
   ============================================================ */
dom.close.addEventListener('click', closeStory);

dom.tapNext.addEventListener('click', e => {
    e.stopPropagation();
    goNext();
});

dom.tapPrev.addEventListener('click', e => {
    e.stopPropagation();
    goPrev();
});

// Klaviatura
document.addEventListener('keydown', e => {
    if (!player.open) return;
    if (e.key === 'Escape')     closeStory();
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft')  goPrev();
});

// Touch swipe
(function initSwipe() {
    let startX = 0;
    let startY = 0;

    dom.overlay.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });

    dom.overlay.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;

        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
            dx < 0 ? goNext() : goPrev();
        }

        if (dy > 80 && Math.abs(dx) < 40) {
            closeStory();
        }
    }, { passive: true });
})();


/* ============================================================
   12. TYPEWRITER
   ============================================================ */
(function initTypewriter() {
    const el = document.getElementById('typingText');
    if (!el) return;

    const texts  = ['Data Analyst', 'Texnologiya Ishqibozi', 'Havaskor Yurist'];
    let tIdx     = 0;
    let cIdx     = 0;
    let deleting = false;

    function tick() {
        const cur = texts[tIdx];

        if (deleting) {
            cIdx--;
        } else {
            cIdx++;
        }

        el.textContent = cur.substring(0, cIdx);

        let delay = deleting ? 45 : 95;

        if (!deleting && cIdx === cur.length) {
            deleting = true;
            delay    = 1600;
        } else if (deleting && cIdx === 0) {
            deleting = false;
            tIdx     = (tIdx + 1) % texts.length;
            delay    = 450;
        }

        setTimeout(tick, delay);
    }

    setTimeout(tick, 900);
})();


/* ============================================================
   13. TOAST
   ============================================================ */
function showToast({ type = 'info', title = '', message = '', duration = 4000 } = {}) {
    document.querySelectorAll('.toast.show').forEach(t => {
        t.classList.remove('show');
        setTimeout(() => t.remove(), 350);
    });

    const iconMap = {
        success: 'fas fa-check-circle',
        error:   'fas fa-exclamation-circle',
        info:    'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="${iconMap[type] ?? iconMap.info}"></i>
        </div>
        <div class="toast-content">
            ${title   ? `<div class="toast-title">${title}</div>`     : ''}
            ${message ? `<div class="toast-message">${message}</div>` : ''}
        </div>
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add('show'));
    });

    if (duration > 0) {
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 350);
        }, duration);
    }

    return toast;
}
