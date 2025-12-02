// Additional app functionality
class AppExtensions {
    constructor() {
        this.telegramBotToken = '8561049037:AAEbMoh0BTPRx5mUR99ui-uyg764vGO8spY';
        this.telegramChatId = 'YOUR_CHAT_ID'; // Sizning chat ID ingiz
    }

    loadAboutPage(container) {
        container.innerHTML = `
            <div style="text-align: center; margin-bottom: 30px;">
                <div class="avatar" style="margin: 0 auto 20px;">
                    <i class="fas fa-user-tie"></i>
                </div>
                <h2>Asilbek Sodiqov</h2>
                <p style="color: var(--text-light);">Data Analyst & Yurist</p>
            </div>

            <div class="stat-card">
                <h3><i class="fas fa-graduation-cap"></i> Ta'lim</h3>
                <p><strong>Huquqshunoslik</strong> - Bakalavr (2025)</p>
                <p><strong>Yuridika</strong> - Magistratura talabasi</p>
            </div>

            <div class="stat-card">
                <h3><i class="fas fa-briefcase"></i> Tajriba</h3>
                <p>Mikromoliya tashkilotida amaliyotchi</p>
                <p>Data Analysis sohasida o'qish</p>
            </div>

            <div class="stat-card">
                <h3><i class="fas fa-star"></i> Ko'nikmalar</h3>
                <p>Ma'lumotlar Tahlili • Huquqshunoslik • Ingliz Tili</p>
            </div>
        `;
    }

    loadPortfolioPage(container) {
        container.innerHTML = `
            <h2 style="margin-bottom: 20px; text-align: center;">Loyihalarim</h2>
            
            <div class="stat-card" style="cursor: pointer;" onclick="window.open('https://asilbeksodiqov.github.io/rps', '_blank')">
                <h3><i class="fas fa-gamepad"></i> Rock Paper Scissors</h3>
                <p>JavaScript va frontend ko'nikmalarimni namoyish etuvchi interaktiv o'yin</p>
                <small style="color: var(--primary);">Batafsil ko'rish →</small>
            </div>

            <div class="stat-card" style="cursor: pointer;" onclick="window.open('https://asilbeksodiqov.github.io/fit', '_blank')">
                <h3><i class="fas fa-running"></i> Fitness Tracker</h3>
                <p>Foydalanuvchilar uchun oddiy va qulay fitness monitoring vositasi</p>
                <small style="color: var(--primary);">Batafsil ko'rish →</small>
            </div>

            <div style="text-align: center; margin-top: 30px;">
                <button class="btn" onclick="window.open('https://github.com/asilbeksodiqov', '_blank')">
                    <i class="fab fa-github"></i> GitHub Profilim
                </button>
            </div>
        `;
    }

    loadContactPage(container) {
        container.innerHTML = `
            <h2 style="margin-bottom: 20px; text-align: center;">Bog'lanish</h2>
            
            <form id="contactForm">
                <div class="form-group">
                    <input type="text" class="form-input" id="name" placeholder="Ismingiz" required>
                </div>
                
                <div class="form-group">
                    <textarea class="form-input" id="message" placeholder="Xabaringiz" rows="5" required></textarea>
                </div>
                
                <button type="submit" class="btn" style="width: 100%;">
                    <i class="fas fa-paper-plane"></i> Xabarni Yuborish
                </button>
            </form>

            <div style="margin-top: 30px;">
                <h3 style="margin-bottom: 15px;">Ijtimoiy Tarmoqlar</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <button class="btn btn-outline" onclick="window.open('https://linkedin.com/in/asilbek-sodiqov-1580b2398', '_blank')">
                        <i class="fab fa-linkedin"></i> LinkedIn
                    </button>
                    <button class="btn btn-outline" onclick="window.open('https://x.com/asilxon_sodiqov', '_blank')">
                        <i class="fab fa-twitter"></i> X (Twitter)
                    </button>
                    <button class="btn btn-outline" onclick="window.open('https://t.me/asilbek_sodiqov', '_blank')">
                        <i class="fab fa-telegram"></i> Telegram
                    </button>
                    <button class="btn btn-outline" onclick="window.open('https://instagram.com/asilxon_sodiqov', '_blank')">
                        <i class="fab fa-instagram"></i> Instagram
                    </button>
                </div>
            </div>
        `;

        this.setupContactForm();
    }

    setupContactForm() {
        const form = document.getElementById('contactForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const message = document.getElementById('message').value;
            const button = form.querySelector('button');

            // Show loading state
            const originalText = button.innerHTML;
            button.innerHTML = '<div class="loading"></div> Yuborilmoqda...';
            button.disabled = true;

            try {
                await this.sendToTelegram(name, message);
                alert('Xabaringiz yuborildi! Tez orada aloqaga chiqaman.');
                form.reset();
            } catch (error) {
                alert('Xatolik yuz berdi. Iltimos, keyinroq urinib ko\'ring.');
            } finally {
                button.innerHTML = originalText;
                button.disabled = false;
            }
        });
    }

    async sendToTelegram(name, message) {
        const text = `📬 Yangi xabar:\n\nIsm: ${name}\nXabar: ${message}`;
        
        const response = await fetch(`https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: this.telegramChatId,
                text: text,
                parse_mode: 'HTML'
            })
        });

        if (!response.ok) {
            throw new Error('Telegram API error');
        }
    }

    loadMorePage(container) {
        container.innerHTML = `
            <h2 style="margin-bottom: 20px; text-align: center;">Boshqa</h2>
            
            <div class="stat-card">
                <h3><i class="fas fa-file-pdf"></i> Rezyume</h3>
                <p>Mening to'liq rezyumem</p>
                <button class="btn btn-outline" style="width: 100%; margin-top: 10px;">
                    <i class="fas fa-download"></i> Yuklab Olish
                </button>
            </div>

            <div class="stat-card">
                <h3><i class="fas fa-code"></i> Texnologiyalar</h3>
                <p>HTML, CSS, JavaScript, GitHub</p>
            </div>

            <div class="stat-card">
                <h3><i class="fas fa-globe"></i> Til Bilish</h3>
                <p>O'zbekcha - Native</p>
                <p>Inglizcha - Intermediate</p>
            </div>
        `;
    }
}

// Extend main app with additional functionality
document.addEventListener('DOMContentLoaded', () => {
    const extensions = new AppExtensions();
    
    // Override page loading methods
    if (window.app) {
        window.app.loadAboutPage = extensions.loadAboutPage.bind(extensions);
        window.app.loadPortfolioPage = extensions.loadPortfolioPage.bind(extensions);
        window.app.loadContactPage = extensions.loadContactPage.bind(extensions);
        window.app.loadMorePage = extensions.loadMorePage.bind(extensions);
    }
});