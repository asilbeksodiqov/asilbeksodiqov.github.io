const BOT_TOKEN = '8561049037:AAEbMoh0BTPRx5mUR99ui-uyg764vGO8spY';
const CHAT_ID = '7123672881';

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(pageId).classList.add('active');
    
    if (pageId === 'home') {
        document.querySelectorAll('.nav-btn')[0].classList.add('active');
    } else if (pageId === 'portfolio') {
        document.querySelectorAll('.nav-btn')[1].classlist.add('active');
    } else if (pageId === 'contact') {
        document.querySelectorAll('.nav-btn')[2].classList.add('active');
    }
}

document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const button = form.querySelector('button');
    const name = document.getElementById('name').value;
    const contactInfo = document.getElementById('contact_info').value; // ✅ QO'SHILDI
    const message = document.getElementById('message').value;
    
    // Validatsiya qo'shish
    if (!name.trim()) {
        alert('Iltimos, ismingizni kiriting');
        return;
    }
    
    if (!message.trim()) {
        alert('Iltimos, xabaringizni kiriting');
        return;
    }
    
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    button.disabled = true;
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: `📬 Yangi xabar:\n👤 Ism: ${name}\n📞 Aloqa raqami: ${contactInfo || "Ko'rsatilmagan"}\n💬 Xabar: ${message}`,
                parse_mode: 'HTML'
            })
        });
        
        if (!response.ok) {
            throw new Error('Xabar yuborishda xatolik');
        }
        
        alert('Xabaringiz yuborildi!');
        form.reset();
    } catch (error) {
        console.error('Xatolik:', error);
        alert('Xatolik yuz berdi. Iltimos, keyinroq urinib ko\'ring.');
    } finally {
        button.innerHTML = originalText;
        button.disabled = false;
    }
});

// PWA basic functionality
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}