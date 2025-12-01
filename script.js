const BOT_TOKEN = '8561049037:AAEbMoh0BTPRx5mUR99ui-uyg764vGO8spY';
const CHAT_ID = '7123672881';

// Sahifa ko'rsatish funksiyasi
function showPage(pageId) {
    // Barcha sahifalarni yashirish
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Barcha nav tugmalarini faolsizlashtirish
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-current', 'false');
    });
    
    // Tanlangan sahifani ko'rsatish
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Tegishli nav tugmasini faollashtirish
    let activeBtnIndex = 0;
    switch(pageId) {
        case 'home':
            activeBtnIndex = 0;
            break;
        case 'portfolio':
            activeBtnIndex = 1;
            break;
        case 'contact':
            activeBtnIndex = 2;
            break;
    }
    
    const navBtns = document.querySelectorAll('.nav-btn');
    if (navBtns[activeBtnIndex]) {
        navBtns[activeBtnIndex].classList.add('active');
        navBtns[activeBtnIndex].setAttribute('aria-current', 'page');
    }
    
    // Sahifa sarlavhasini yangilash
    updatePageTitle(pageId);
    
    // Sahifa boshiga aylantirish
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Sahifa sarlavhasini yangilash
function updatePageTitle(pageId) {
    const titles = {
        'home': 'Asilbek Sodiqov | Data Analyst',
        'portfolio': 'Loyihalarim | Asilbek Sodiqov',
        'contact': 'Bog\'lanish | Asilbek Sodiqov'
    };
    document.title = titles[pageId] || titles['home'];
}

// Telefon raqamini formatlash
function formatPhoneNumber(value) {
    // Faqat raqamlarni qoldiramiz
    return value.replace(/\D/g, '');
}

// Input navigation va boshqaruv funksiyasi
function setupInputNavigation() {
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('contact_info');
    const messageInput = document.getElementById('message');
    
    // Ism inputida Enter bosganda telefon inputiga o'tish
    nameInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            phoneInput.focus();
        }
    });
    
    // Telefon inputida Enter bosganda xabar inputiga o'tish
    phoneInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            messageInput.focus();
        }
    });
    
    // Xabar inputida Enter bosganda yangi qator
    // Ctrl+Enter bosganda formni yuborish
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            document.getElementById('contactForm').dispatchEvent(new Event('submit'));
        }
    });
    
    // Telefon inputini boshqarish
    phoneInput.addEventListener('input', function(e) {
        // Faqat raqam qabul qilish
        this.value = formatPhoneNumber(this.value);
    });
    
    // Barcha inputlarni tekshirish (boshlang'ich holatda)
    [nameInput, phoneInput, messageInput].forEach(input => {
        if (input.value) {
            // Agar qiymat bo'lsa, floating labelni yuqoriga ko'taramiz
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    });
}

// Form validatsiyasi
function validateForm(name, phone, message) {
    const errors = [];
    
    // Ism validatsiyasi
    if (!name.trim()) {
        errors.push('Iltimos, ismingizni kiriting');
        document.getElementById('name').focus();
    } else if (name.trim().length < 2) {
        errors.push('Ism kamida 2 ta belgidan iborat bo\'lishi kerak');
        document.getElementById('name').focus();
    }
    
    // Telefon validatsiyasi
    if (!phone.trim()) {
        errors.push('Iltimos, telefon raqamingizni kiriting');
        document.getElementById('contact_info').focus();
    } else if (phone.length !== 9) {
        errors.push('Telefon raqami 9 ta raqamdan iborat bo\'lishi kerak');
        document.getElementById('contact_info').focus();
    }
    
    // Xabar validatsiyasi
    if (!message.trim()) {
        errors.push('Iltimos, xabaringizni kiriting');
        if (!errors.length) document.getElementById('message').focus();
    } else if (message.trim().length < 5) {
        errors.push('Xabar kamida 5 ta belgidan iborat bo\'lishi kerak');
        if (!errors.length) document.getElementById('message').focus();
    }
    
    return errors;
}

// Tugmani yuklanish holatiga o'tkazish
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.classList.add('loading');
        button.setAttribute('aria-label', 'Yuklanmoqda');
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Yuklanmoqda...';
    } else {
        button.disabled = false;
        button.classList.remove('loading');
        button.removeAttribute('aria-label');
        button.innerHTML = '<i class="fas fa-paper-plane"></i> Xabarni Yuborish';
    }
}

// Telegram xabar yuborish - Soddalashtirilgan versiya
async function sendTelegramMessage(name, phone, message) {
    // Telefon raqamini to'liq formatlash
    const formattedPhone = '+998' + phone;
    
    const text = `
📬 Yangi xabar

👤 Ism: ${name}
📞 Telefon: ${formattedPhone}
💬 Xabar: ${message}

⏰ Vaqt: ${new Date().toLocaleString('uz-UZ')}
    `.trim();

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: text
            // parse_mode ni olib tashladik, oddiy text ishlatamiz
        })
    });

    const responseData = await response.json();
    
    if (!response.ok) {
        throw new Error(responseData.description || `HTTP ${response.status}`);
    }

    return responseData;
}

// Notification ko'rsatish (soddalashtirilgan)
function showNotification(message, type = 'info') {
    // Hozircha oddiy alert ishlatamiz
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    alert(icon + ' ' + message);
}

// Bot ulanishini tekshirish
async function checkBotConnection() {
    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`);
        const data = await response.json();
        
        if (data.ok) {
            console.log('✅ Bot mavjud:', data.result);
            return true;
        } else {
            console.log('❌ Bot mavjud emas:', data);
            return false;
        }
    } catch (error) {
        console.error('❌ Botga ulanishda xatolik:', error);
        return false;
    }
}

// Form yuborish funksiyasi
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const button = form.querySelector('button[type="submit"]');
    const name = document.getElementById('name').value.trim();
    let phone = document.getElementById('contact_info').value;
    const message = document.getElementById('message').value.trim();
    
    console.log('Form ma\'lumotlari:', { name, phone, message });
    
    // Validatsiya
    const errors = validateForm(name, phone, message);
    if (errors.length > 0) {
        showNotification(errors.join('\n'), 'error');
        return;
    }
    
    // Yuklanish holati
    setButtonLoading(button, true);
    
    try {
        console.log('Xabar yuborish boshlandi...');
        
        // Xabar yuborish
        await sendTelegramMessage(name, phone, message);
        
        // Muvaffaqiyatli yuborildi
        showNotification('Xabaringiz muvaffaqiyatli yuborildi! Tez orada aloqaga chiqamiz.', 'success');
        form.reset();
        
        // Form reset qilinganidan keyin floating label holatini yangilash
        setTimeout(() => {
            document.querySelectorAll('.floating-label input, .floating-label textarea').forEach(input => {
                input.dispatchEvent(new Event('input', { bubbles: true }));
            });
        }, 100);
        
    } catch (error) {
        console.error('Xatolik tafsilotlari:', error);
        
        // Xatolik turiga qarab turli xabar
        let errorMessage = 'Xatolik yuz berdi. Iltimos, keyinroq urinib ko\'ring.';
        
        if (error.message.includes('chat not found')) {
            errorMessage = 'Chat topilmadi. Iltimos, administrator bilan bog\'laning.';
        } else if (error.message.includes('bot was blocked')) {
            errorMessage = 'Bot bloklangan. Iltimos, botni blokdan chiqaring.';
        } else if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Internet aloqasi yo\'q. Iltimos, internetingizni tekshiring.';
        }
        
        showNotification(errorMessage, 'error');
    } finally {
        setButtonLoading(button, false);
    }
});

// DOM yuklanganida
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM yuklandi');
    
    // Input navigation sozlamalarini yoqish
    setupInputNavigation();
    
    // Boshlang'ich sahifa
    showPage('home');
    
    // Navigation tugmalariga event listener qo'shish
    document.querySelectorAll('.nav-btn').forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const pages = ['home', 'portfolio', 'contact'];
            showPage(pages[index]);
        });
    });
    
    // Back tugmalariga event listener
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            showPage('home');
        });
    });
    
    // Loyiha kartalariga keyboard navigation
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const url = this.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
                if (url) {
                    window.open(url, '_blank', 'noopener,noreferrer');
                }
            }
        });
        
        // Accessibility uchun focus holatini yaxshilash
        card.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary)';
            this.style.outlineOffset = '2px';
        });
        
        card.addEventListener('blur', function() {
            this.style.outline = '';
        });
    });
});

// PWA Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registered: ', registration.scope);
            })
            .catch(function(registrationError) {
                console.log('ServiceWorker registration failed: ', registrationError);
            });
    });
}

// Offline/Online holatni monitoring qilish
window.addEventListener('online', function() {
    showNotification('Internet ulandi', 'success');
});

window.addEventListener('offline', function() {
    showNotification('Internet ulanmadi', 'error');
});

// Sayt performansini monitoring qilish
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Sayt ${loadTime}ms da yuklandi`);
        }, 0);
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape bosganda bosh sahifaga qaytish
    if (e.key === 'Escape') {
        showPage('home');
    }
});