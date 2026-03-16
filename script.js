document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const l = document.getElementById('loading');
        l.style.opacity = '0';
        setTimeout(() => l.style.display = 'none', 500);
    }, 1300);

    initTypewriter();
    initReveal();
    initContactTypeSelector();
    initPhoneFormatting();
    initForm();
    initRating();
    initTicker();
    fixNav();
    window.addEventListener('resize', fixNav);
});

// ── NAV POSITION ──────────────────────────
function fixNav() {
    const app  = document.getElementById('app');
    const nav  = document.getElementById('bottomNav');
    const rect = app.getBoundingClientRect();
    nav.style.left  = Math.round(rect.left) + 'px';
    nav.style.width = Math.round(rect.width) + 'px';
}

// ── PAGE NAVIGATION ───────────────────────
let current = 'home';
let typingTimer = null;

function showPage(id) {
    if (id === current) return;
    if (current === 'home' && typingTimer) { clearTimeout(typingTimer); typingTimer = null; }

    // Global tugma elementlarini ushlab olamiz
    const backBtn = document.getElementById('global-back-btn');
    const btnLabel = document.getElementById('back-btn-label');

    // Tugma nomini sahifaga qarab o'zgartirish (Dinamik qism)
    if (id === 'home') {
        backBtn.style.display = 'none'; // Bosh sahifada yashiramiz
    } else {
        backBtn.style.display = 'inline-flex'; // Boshqa sahifalarda ko'rsatamiz
        
        // Sahifa ID siga qarab nom beramiz
        switch(id) {
            case 'about':    btnLabel.textContent = 'Haqida'; break;
            case 'projects': btnLabel.textContent = 'Loyihalar'; break;
            case 'contact':  btnLabel.textContent = 'Bog\'lanish'; break;
            default:         btnLabel.textContent = 'Orqaga';
        }
    }

    // Sahifalarni almashtirish (Sizning kodingiz)
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.page === id));

    document.getElementById(id).classList.add('active');
    current = id;
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (id === 'home')   setTimeout(initTypewriter, 80);
    if (id === 'about')  setTimeout(animateSkills, 280);
    scheduleReveal();
}

// ── TYPEWRITER ────────────────────────────
function initTypewriter() {
    const el = document.getElementById('typingText');
    if (!el) return;
    if (typingTimer) { clearTimeout(typingTimer); typingTimer = null; }

    const words = ['Data Analyst', 'Texnologiya Ishqibozi', 'Havaskor Yurist', 'Talaba', 'Vibe Coder'];
    let wi = 0, ci = 0, del = false;

    function tick() {
        const w = words[wi];
        el.textContent = del ? w.slice(0, ci - 1) : w.slice(0, ci + 1);
        del ? ci-- : ci++;
        let ms = del ? 45 : 90;
        if (!del && ci === w.length)  { del = true;  ms = 1500; }
        if (del  && ci === 0)         { del = false; wi = (wi + 1) % words.length; ms = 380; }
        typingTimer = setTimeout(tick, ms);
    }
    typingTimer = setTimeout(tick, 800);
}

// ── REVEAL ────────────────────────────────
let revObs = null;

function initReveal() {
    revObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); }
        });
    }, { threshold: 0.07, rootMargin: '0px 0px -16px 0px' });
    document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));
}

function scheduleReveal() {
    setTimeout(() => {
        document.querySelectorAll('.page.active .reveal:not(.visible)').forEach(el => revObs?.observe(el));
    }, 80);
}

// ── SKILL BARS ────────────────────────────
function animateSkills() {
    document.querySelectorAll('.skill-fill').forEach(b => {
        const w = b.dataset.w;
        b.style.width = '0';
        requestAnimationFrame(() => setTimeout(() => { b.style.width = w + '%'; }, 60));
    });
    scheduleReveal();
}

// ── CONTACT TYPE ──────────────────────────
function initContactTypeSelector() {
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const input  = document.getElementById('contact_input');
            const prefix = document.getElementById('contactPrefix');
            const label  = document.getElementById('contactLabel');
            const field  = document.getElementById('contactField');
            const t      = btn.dataset.type;

            input.value = ''; field.classList.remove('has-value');
            input.removeAttribute('pattern');

            if (t === 'phone') {
                input.type = 'tel'; input.inputMode = 'numeric'; input.maxLength = 12;
                prefix.textContent = '+998'; prefix.style.display = 'flex';
                label.textContent = 'Telefon raqamingiz';
                field.className = 'float-field float-field--prefix phone-mode';
            } else if (t === 'telegram') {
                input.type = 'text'; input.inputMode = 'text'; input.maxLength = 32;
                prefix.textContent = '@'; prefix.style.display = 'flex';
                label.textContent = 'Telegram username';
                field.className = 'float-field float-field--prefix telegram-mode';
            } else {
                input.type = 'email'; input.inputMode = 'email'; input.maxLength = 255;
                prefix.style.display = 'none';
                label.textContent = 'Email manzilingiz';
                field.className = 'float-field email-mode';
            }
            setTimeout(() => input.focus(), 40);
        });
    });
}

// ── PHONE FORMAT ──────────────────────────
function initPhoneFormatting() {
    const input = document.getElementById('contact_input');
    if (!input) return;
    input.addEventListener('keydown', e => {
        if (document.querySelector('.type-btn.active')?.dataset.type !== 'phone') return;
        if (input.value.replace(/\D/g,'').length >= 9 &&
            !['Backspace','Delete','ArrowLeft','ArrowRight','Tab'].includes(e.key))
            e.preventDefault();
    });
    input.addEventListener('input', () => {
        if (document.querySelector('.type-btn.active')?.dataset.type !== 'phone') return;
        let v = input.value.replace(/\D/g,'').slice(0,9);
        input.value = v.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/,'$1 $2 $3 $4');
        document.getElementById('contactField')?.classList.toggle('has-value', !!v);
    });
}

// ── FLOATING LABELS ───────────────────────
function initFloatLabels() {
    document.querySelectorAll('.float-field input, .float-field textarea').forEach(el => {
        const sync = () => el.closest('.float-field')?.classList.toggle('has-value', !!el.value.trim());
        el.addEventListener('input', sync);
        el.addEventListener('change', sync);
        sync();
    });
}

// ── FORM SUBMIT ───────────────────────────
function initForm() {
    initFloatLabels();
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const type = document.querySelector('.type-btn.active')?.dataset.type || 'phone';
        let   val  = document.getElementById('contact_input').value.trim();
        const msg  = document.getElementById('message').value.trim();

        if (!name || !val || !msg) return showToast('warning','Diqqat!','Barcha maydonlarni to\'ldiring');

        let info = '', ok = true;
        if (type === 'phone') {
            info = '+998' + val.replace(/\s/g,'');
        } else if (type === 'telegram') {
            val = val.replace(/^@/,'');
            if (val.length < 4) { showToast('error','Format xato','Username kamida 5 belgi bo\'lishi kerak'); ok = false; }
            info = '@' + val;
        } else {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { showToast('error','Format xato','To\'g\'ri email kiriting'); ok = false; }
            info = val;
        }
        if (!ok) return;

        const btn = form.querySelector('.btn-submit');
        const orig = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Yuborilmoqda…</span>';

        try {
            const r = await fetch(`https://api.telegram.org/bot8561049037:AAEbMoh0BTPRx5mUR99ui-uyg764vGO8spY/sendMessage`,{
                method:'POST', headers:{'Content-Type':'application/json'},
                body: JSON.stringify({ chat_id:'7123672881',
                    text:`📬 Yangi xabar | sodiqov.uz\n👤 Ism: ${name}\n📞 ${type.toUpperCase()}: ${info}\n💬 Xabar: ${msg}` })
            });
            if (!r.ok) throw new Error();
            showToast('success','Yuborildi!','Tez orada aloqaga chiqamiz.');
            form.reset();
            document.querySelectorAll('.float-field').forEach(f => f.classList.remove('has-value'));
            document.querySelectorAll('.type-btn').forEach(b => b.classList.toggle('active', b.dataset.type === 'phone'));
            const ci=document.getElementById('contact_input'), cp=document.getElementById('contactPrefix'),
                  cf=document.getElementById('contactField'),  cl=document.getElementById('contactLabel');
            ci.type='tel'; ci.inputMode='numeric'; ci.maxLength=12;
            cp.textContent='+998'; cp.style.display='flex';
            cl.textContent='Telefon raqamingiz';
            cf.className='float-field float-field--prefix phone-mode';
            ci.removeAttribute('pattern');
            setTimeout(() => showPage('home'), 2000);
        } catch {
            showToast('error','Xatolik',"Keyinroq urinib ko'ring.");
        } finally {
            btn.disabled = false; btn.innerHTML = orig;
        }
    });
}

// ── TOAST ─────────────────────────────────
function showToast(type='info', title='', message='', dur=4000) {
    document.querySelectorAll('.toast').forEach(t => t.remove());
    const icons = { success:'fa-check-circle', error:'fa-times-circle',
                    warning:'fa-exclamation-triangle', info:'fa-info-circle' };
    const el = document.createElement('div');
    el.className = 'toast toast--' + type;
    el.innerHTML = `<i class="fas ${icons[type]} toast__icon"></i>
        <div class="toast__body">
            ${title   ? `<b class="toast__title">${title}</b>` : ''}
            ${message ? `<span class="toast__msg">${message}</span>` : ''}
        </div>`;
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));
    if (dur > 0) setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 380); }, dur);
}

// ── RATING ────────────────────────────────
function initRating() {
    const stars = document.querySelectorAll('.star-btn');
    const labelText = document.getElementById('ratingLabelText');
    const submitBtn = document.getElementById('ratingSubmitBtn');
    if (!stars.length) return;

    const labels = ['', 'Yomon', 'Qoniqarli', 'Yaxshi', 'Juda yaxshi', 'Zo\'r!'];
    let selected = 0;

    stars.forEach(star => {
        star.addEventListener('mouseenter', () => {
            const v = +star.dataset.value;
            stars.forEach(s => s.classList.toggle('hovered', +s.dataset.value <= v));
            labelText.textContent = labels[v];
        });
        star.addEventListener('mouseleave', () => {
            stars.forEach(s => s.classList.remove('hovered'));
            labelText.textContent = selected ? labels[selected] : 'Yulduzni tanlang';
        });
        star.addEventListener('click', () => {
            selected = +star.dataset.value;
            stars.forEach(s => s.classList.toggle('selected', +s.dataset.value <= selected));
            labelText.textContent = labels[selected];
            submitBtn.disabled = false;
        });
    });
}

function submitRating() {
    const selected = document.querySelectorAll('.star-btn.selected').length;
    if (!selected) return;

    const btn = document.getElementById('ratingSubmitBtn');
    const success = document.getElementById('ratingSuccess');

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Yuborilmoqda…';

    fetch(`https://api.telegram.org/bot8561049037:AAEbMoh0BTPRx5mUR99ui-uyg764vGO8spY/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: '7123672881',
            text: `⭐ Sayt bahosi | sodiqov.uz\n${'⭐'.repeat(selected)}${'☆'.repeat(5 - selected)} (${selected}/5)`
        })
    })
    .then(() => {
        btn.style.display = 'none';
        success.style.display = 'flex';
        localStorage.setItem('site_rated', '1');
    })
    .catch(() => {
        btn.disabled = false;
        btn.innerHTML = 'Baholash <i class="fas fa-paper-plane"></i>';
        showToast('error', 'Xatolik', "Keyinroq urinib ko'ring.");
    });
}

// ── GUESTBOOK ─────────────────────────────
function submitGuestbook() {
    const name = document.getElementById('gbName').value.trim();
    const msg  = document.getElementById('gbMessage').value.trim();

    if (!name) return showToast('warning', 'Diqqat!', 'Ismingizni kiriting');
    if (!msg)  return showToast('warning', 'Diqqat!', 'Xabar yozing');

    const btn = document.querySelector('.btn-gb-submit');
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Yuborilmoqda…';

    fetch(`https://api.telegram.org/bot8561049037:AAEbMoh0BTPRx5mUR99ui-uyg764vGO8spY/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: '7123672881',
            text: `📖 Mehmonlar kitobasi | sodiqov.uz\n👤 Ism: ${name}\n💬 Xabar: ${msg}`
        })
    })
    .then(r => { if (!r.ok) throw new Error(); })
    .then(() => {
        showToast('success', 'Muvaffaqiyatli!', 'Xabaringiz tasdiqlash uchun yuborildi.');
        document.getElementById('gbName').value = '';
        document.getElementById('gbMessage').value = '';
    })
    .catch(() => showToast('error', 'Xatolik', "Keyinroq urinib ko'ring."))
    .finally(() => {
        btn.disabled = false;
        btn.innerHTML = orig;
    });
}

// ── GUESTBOOK TICKER ──────────────────────
let tickerTimer = null;
let tickerIndex = 0;

function initTicker() {
    const slides = document.querySelectorAll('.ticker-slide');
    const dotsEl = document.getElementById('tickerDots');
    if (!slides.length || !dotsEl) return;

    // Dots yaratish
    dotsEl.innerHTML = '';
    slides.forEach((_, i) => {
        const d = document.createElement('button');
        d.className = 'ticker-dot' + (i === 0 ? ' active' : '');
        d.onclick = () => goToSlide(i);
        dotsEl.appendChild(d);
    });

    tickerIndex = 0;
    startTicker();
}

function startTicker() {
    if (tickerTimer) clearInterval(tickerTimer);
    tickerTimer = setInterval(() => {
        const slides = document.querySelectorAll('.ticker-slide');
        goToSlide((tickerIndex + 1) % slides.length);
    }, 3500);
}

function goToSlide(i) {
    const slides = document.querySelectorAll('.ticker-slide');
    const dots   = document.querySelectorAll('.ticker-dot');
    slides[tickerIndex]?.classList.remove('active');
    dots[tickerIndex]?.classList.remove('active');
    tickerIndex = i;
    slides[tickerIndex]?.classList.add('active');
    dots[tickerIndex]?.classList.add('active');
}

// ── GUESTBOOK MODAL ───────────────────────
function openGuestbookModal() {
    document.getElementById('gbModalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('gbName')?.focus(), 300);
}

function closeGuestbookModal(e) {
    if (e && e.target !== document.getElementById('gbModalOverlay')) return;
    document.getElementById('gbModalOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

function submitGuestbook() {
    const name = document.getElementById('gbName').value.trim();
    const msg  = document.getElementById('gbMessage').value.trim();

    if (!name) return showToast('warning', 'Diqqat!', 'Ismingizni kiriting');
    if (!msg)  return showToast('warning', 'Diqqat!', 'Xabar yozing');

    const btn = document.querySelector('.btn-gb-submit');
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Yuborilmoqda…';

    fetch(`https://api.telegram.org/bot8561049037:AAEbMoh0BTPRx5mUR99ui-uyg764vGO8spY/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: '7123672881',
            text: `📖 Mehmonlar kitobasi | sodiqov.uz\n👤 Ism: ${name}\n💬 Xabar: ${msg}`
        })
    })
    .then(r => { if (!r.ok) throw new Error(); })
    .then(() => {
        showToast('success', 'Muvaffaqiyatli!', 'Xabaringiz tasdiqlash uchun yuborildi.');
        document.getElementById('gbName').value = '';
        document.getElementById('gbMessage').value = '';
        document.getElementById('gbCharCount').textContent = '0';
        closeGuestbookModal();
    })
    .catch(() => showToast('error', 'Xatolik', "Keyinroq urinib ko'ring."))
    .finally(() => { btn.disabled = false; btn.innerHTML = orig; });
}

// Belgilar soni
document.addEventListener('DOMContentLoaded', () => {
    const ta = document.getElementById('gbMessage');
    const cc = document.getElementById('gbCharCount');
    if (ta && cc) {
        ta.addEventListener('input', () => cc.textContent = ta.value.length);
    }
});

// ── PROJECT TABS ──────────────────────────
function switchProjTab(tabId, btn) {
    document.querySelectorAll('.proj-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.proj-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById('tab-' + tabId);
    panel.classList.add('active');
    // Reveal animatsiyasini qayta ishga tushirish
    panel.querySelectorAll('.reveal').forEach(el => {
        el.classList.remove('visible');
        setTimeout(() => revObs?.observe(el), 50);
    });
}

// ── ARTICLE OPEN ──────────────────────────
function openArticle(id) {
    window.location.href = 'article.html?id=' + id;
}

// ── CONTACT EXPAND ────────────────────────
function toggleContactForm() {
    const form  = document.getElementById('contactFormWrap');
    const map   = document.getElementById('contactMapWrap');
    const arrow = document.getElementById('formArrow');
    const isOpen = form.classList.contains('open');

    // Xaritani yop
    map.classList.remove('open');
    map.style.maxHeight = '0';
    document.getElementById('mapArrow').style.transform = 'rotate(0deg)';

    if (isOpen) {
        form.classList.remove('open');
        form.style.maxHeight = '0';
        arrow.style.transform = 'rotate(0deg)';
    } else {
        form.classList.add('open');
        form.style.maxHeight = form.scrollHeight + 500 + 'px';
        arrow.style.transform = 'rotate(180deg)';
    }
}

function toggleMap() {
    const map   = document.getElementById('contactMapWrap');
    const form  = document.getElementById('contactFormWrap');
    const arrow = document.getElementById('mapArrow');
    const isOpen = map.classList.contains('open');

    // Formani yop
    form.classList.remove('open');
    form.style.maxHeight = '0';
    document.getElementById('formArrow').style.transform = 'rotate(0deg)';

    if (isOpen) {
        map.classList.remove('open');
        map.style.maxHeight = '0';
        arrow.style.transform = 'rotate(0deg)';
    } else {
        map.classList.add('open');
        map.style.maxHeight = map.scrollHeight + 'px';
        arrow.style.transform = 'rotate(180deg)';
    }
}
