document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const nameModal = document.getElementById('name-modal');
    const confirmModal = document.getElementById('confirmModal');
    const nameInput = document.getElementById('name-input');
    let userName = localStorage.getItem('userName');

    if (!userName) {
        nameModal.style.display = 'flex';
    } else {
        loadChat(userName, chatBox);
    }

    const chatHeader = document.querySelector('.chat-header');
    chatHeader.addEventListener('click', (event) => {
        if (!event.target.closest('.clear-chat-btn')) {
            window.location.href = 'index.html';
        }
    });

    nameInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            saveUserName();
        }
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    document.addEventListener('keydown', (event) => {
        if (confirmModal.style.display === 'flex') {
            if (event.key === 'Enter') confirmClearChat(true);
            if (event.key === 'Escape') confirmClearChat(false);
        }
    });
});

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function saveUserName() {
    const nameInput = document.getElementById('name-input');
    const nameModal = document.getElementById('name-modal');
    const chatBox = document.getElementById('chat-box');
    let userName = nameInput.value.trim();

    if (!userName) {
        alert("Iltimos, ismingizni kiriting!");
        return;
    }
    if (userName.length < 2) {
        alert("Ism kamida 2 harfdan iborat bo‘lishi kerak!");
        return;
    }

    localStorage.setItem('userName', userName);
    nameModal.style.display = 'none';
    loadChat(userName, chatBox);
}

function loadChat(userName, chatBox) {
    const savedChat = localStorage.getItem('chatHistory');
    if (savedChat) {
        chatBox.innerHTML = savedChat;
        Array.from(chatBox.children).forEach(message => {
            message.classList.add('static');
        });
        chatBox.scrollTop = chatBox.scrollHeight;
    } else {
        const initialMessage = document.createElement('div');
        initialMessage.className = 'message bot';
        initialMessage.textContent = `Salom ${userName}, xush kelibsiz! Siz bilan muloqot qilishdan xursandman! Qanday savolingiz bor?`;
        chatBox.appendChild(initialMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

function openModal() {
    const confirmModal = document.getElementById('confirmModal');
    confirmModal.style.display = 'flex';
}

function confirmClearChat(confirmed) {
    const confirmModal = document.getElementById('confirmModal');
    const chatBox = document.getElementById('chat-box');
    confirmModal.style.display = 'none';
    if (confirmed) {
        chatBox.innerHTML = '';
        localStorage.removeItem('chatHistory');
        const clearedMessage = document.createElement('div');
        chatBox.appendChild(clearedMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

function sendMessage() {
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const message = userInput.value.trim();

    if (!message) return;

    Array.from(chatBox.children).forEach(message => {
        message.classList.add('static');
    });

    const userMessage = document.createElement('div');
    userMessage.className = 'message user';
    userMessage.textContent = message;
    chatBox.appendChild(userMessage);

    userInput.value = '';

    const botMessage = document.createElement('div');
    botMessage.className = 'message bot';
    chatBox.appendChild(botMessage);

    const responseText = getBotResponse(message);
    typeWriter(botMessage, responseText, 0, () => {
        Array.from(chatBox.children).forEach(message => {
            message.classList.add('static');
        });
        sendToTelegram(localStorage.getItem('userName'), message);
        localStorage.setItem('chatHistory', chatBox.innerHTML);
        chatBox.scrollTop = chatBox.scrollHeight;
        userInput.focus();
    });

    chatBox.scrollTop = chatBox.scrollHeight;
}

function typeWriter(element, text, index, callback) {
    if (index < text.length) {
        element.textContent = text.substring(0, index + 1);
        setTimeout(() => typeWriter(element, text, index + 1, callback), 50);
    } else if (callback) {
        callback();
    }
}

function getBotResponse(userInput) {
    const userName = localStorage.getItem('userName');
    const responses = {
        'salom': [
            `Salom, ${userName}! Sizga qanday yordam bera olaman?`,
            `Assalomu alaykum, ${userName}! Nima bilan yordam bera olaman?`,
            `Salom ${userName}! Sizni ko‘rish juda yaxshi, qanday savolingiz bor?`,
            `Salom, ${userName}! Bugun kayfiyatingiz qanday? 😊`,
            `Hey, ${userName}! Xush kelibsiz! 😃`
        ],
        'qalaysiz': [
            `Men yaxshi, rahmat, ${userName}! Siz-chi?`,
            `Ajoyibman, ${userName}! Siz qandaysiz bugun?`,
            `Yaxshi, sizni ko‘rib, yanada yaxshi bo‘ldim! Siz qalaysiz?`,
            `Men a'lo darajada ishlayapman! Siz-chi, bugun qanday o‘tyapti?`,
            `Ajoyibman! Siz ham yaxshi yuribsiz degan umiddaman!`
        ],
        'xayr': [
            `Xayr, ${userName}! Sizga omad tilayman!`,
            `Xayr, ${userName}! Yana uchrashamiz, omad!`,
            `Xayr, ${userName}! Qaytib keling, sizni kutaman!`,
            `Xayr! Siz bilan suhbat qilish yoqimli edi!`,
            `Xayrli kun! Yangi suhbatlarda uchrashguncha!`
        ],
        'isming nima': [
            `Mening ismim Sodiqov! Siz bilan tanishganimdan xursandman, ${userName}.`,
            `Sodiqov deb atalaman! ${userName}, siz bilan suhbatlashish juda qiziq!`,
            `Men Sodiqovman! ${userName}, tanishganimizdan xursandman!`,
            `Menga shunchaki Asilbek deb murojaat qiling, chunki barcha javoblar uning nomidan keladi!`,
            `Meni Asilbek deb chaqirishingiz mumkin, chunki barcha xabarlarni uning nomidan yuboraman!`
        ],
        'kimsan': [
            `Men rejalashtirilgan savollarga javob berishga mo‘ljallangan chatbotman!`,
            `Men oddiy bir chatbotman, sizga yordam berish uchun yaratilganman!`,
            `Sizning virtual yordamchingizman, chatbot sifatida!`,
            `Men Asilbekning raqamli ovoziman, sizga yordam berish uchun shu yerdaman!`,
            `Men sun’iy intellekt asosida ishlovchi chatbotman, savollaringizga javob berishga harakat qilaman!`
        ],
        'nimasan': [
            `Men Asilbek Sodiqov haqidagi savollarga umumiy javob bera oladigan suhbatdoshman.`,
            `Asilbek Sodiqovning yordamchisi sifatida ishlovchi chatbotman.`,
            `Siz uchun Asilbek Sodiqov haqida ma’lumot beruvchi do‘stman!`,
            `Men raqamli suhbatdoshman, savollaringizga javob berish uchun dasturlanganman.`,
            `Men matn orqali muloqot qiluvchi chatbotman, lekin haqiqiy inson emasman!`
        ],
        'kim tomonidan yaratilgansan': [
            `Mening muallifim Asilbek Sodiqov, u meni dasturladi va rivojlantirdi.`,
            `Men Asilbek Sodiqovning loyihasiman, u meni ishlab chiqdi.`,
            `Meni yaratgan odam – Asilbek Sodiqov, men uning ishlaridan biriman!`,
            `Asilbek Sodiqov meni kodladi va hayotga tatbiq etdi!`,
            `Meni Asilbek Sodiqov yaratdi va men uning nomidan javob beraman.`
        ],
        "nima so`ray": [
            `Noqulayliklar uchun uzr, ${userName}. Sizning savollaringiz tez orada ma‘lumotlar bazamga qo‘shiladi.`,
            `Kechirasiz, ${userName}, hozircha bu savolga javob bilmayman, lekin tez orada o‘rganaman!`,
            `Uzr, ${userName}, bu savolga hali tayyor emasman, biroz sabr qiling!`,
            `Afsus, hozircha aniq javob bera olmayman. Biroq, bu savol bo‘yicha tez orada ma’lumot qo‘shiladi!`,
            `Bu savol hozircha javoblar ro‘yxatida yo‘q, lekin men o‘rganishda davom etaman!`
        ]
    };

    userInput = userInput.toLowerCase().trim();
    const availableResponses = responses[userInput] || [`Kechirasiz, ${userName}, men sizni tushunmadim. Boshqa savol so‘rab ko‘ring.`, `Uzr, ${userName}, bu savolga javob bilmayman, boshqa nima deb ko‘raylik?`, `Hmm, ${userName}, tushunmadim, boshqa savol bilan sinab ko‘ring!`];
    return availableResponses[Math.floor(Math.random() * availableResponses.length)];
}

function sendToTelegram(userName, message) {
    const botToken = '8054355597:AAGXFJTUFkJMPJi9qk9L61LLZoULVPxHNzU';
    const chatId = '5830723196';
    const telegramMessage = `Foydalanuvchi: ${userName}\nXabar: ${message}`;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: telegramMessage })
    })
        .then(response => response.json())
        .then(data => console.log('Xabar yuborildi:', data))
        .catch(error => console.error('Xatolik:', error));
}

document.getElementById('user-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') sendMessage();
});
