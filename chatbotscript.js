document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const nameModal = document.getElementById('name-modal');
    const nameInput = document.getElementById('name-input');
    let userName = localStorage.getItem('userName');

    // Agar ism mavjud bo‘lmasa, modalni ko‘rsatish
    if (!userName) {
        nameModal.style.display = 'flex';
    } else {
        loadChat(userName, chatBox);
    }

    // Chat header ga bosilganda index.html ga yo‘naltirish
    const chatHeader = document.querySelector('.chat-header');
    chatHeader.addEventListener('click', (event) => {
        if (!event.target.closest('.clear-chat-btn')) {
            window.location.href = 'index.html';
        }
    });

    // Modal inputda Enter tugmasi bosilganda
    nameInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            saveUserName();
        }
    });
});

// Ismni saqlash funksiyasi
function saveUserName() {
    const nameInput = document.getElementById('name-input');
    const nameModal = document.getElementById('name-modal');
    const chatBox = document.getElementById('chat-box');
    let userName = nameInput.value.trim();

    if (!userName) {
        alert("Iltimos, ismingizni kiriting!");
        return;
    }

    localStorage.setItem('userName', userName);
    nameModal.style.display = 'none';
    loadChat(userName, chatBox);
}

// Chatni yuklash funksiyasi
function loadChat(userName, chatBox) {
    const savedChat = localStorage.getItem('chatHistory');
    if (savedChat) {
        chatBox.innerHTML = savedChat;
        chatBox.scrollTop = chatBox.scrollHeight;
    } else {
        const initialMessage = document.createElement('div');
        initialMessage.className = 'message bot';
        initialMessage.textContent = `Salom ${userName}, xush kelibsiz! Siz bilan muloqot qilishdan xursandman! Qanday savolingiz bor?`;
        chatBox.appendChild(initialMessage);
    }
}

function clearChat() {
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = '';
    localStorage.removeItem('chatHistory');
    const clearedMessage = document.createElement('div');
    chatBox.appendChild(clearedMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const message = userInput.value.trim();

    if (!message) return;

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
            `Assalomu alaykum, ${userName}! Nima yangiliklar?`,
            `Salom, ${userName}! Bugun siz uchun nima qila olaman?`
        ],
        'qalaysiz': [
            `Men yaxshi, rahmat, ${userName}! Siz-chi?`,
            `Ajoyibman, ${userName}! Sizning ahvolingiz qanday?`,
            `Zo‘rman, ${userName}! Siz qalaysiz?`
        ],
        'xayr': [
            `Xayr, ${userName}! Sizga omad tilayman!`,
            `Xayrli kun, ${userName}! Yana uchrashguncha!`,
            `Xayr, ${userName}! O‘zingizga ehtiyot bo‘ling!`
        ],
        'isming nima': [
            `Mening ismim Sodiqov! Siz bilan tanishganimdan xursandman, ${userName}.`,
            `Ismim Sodiqov, ${userName}! Sizni ko‘rganimdan mamnunman.`,
            `Men Sodiqovman! ${userName}, tanishganimdan xursandman.`
        ],
        'kimsan': [
            `Men rejalashtirilgan savollarga javob berishga mo‘ljallangan chatbotman!`,
            `Men Asilbek Sodiqovning yordamchi chatbotiman!`,
            `Men virtual suhbatdoshman, ${userName}!`
        ],
        'nimasan': [
            `Men Asilbek Sodiqov haqidagi savollarga umumiy javob bera oladigan suhbatdoshman!`,
            `Men oddiy chatbotman, ${userName}!`,
            `Men siz bilan suhbatlashish uchun yaratilgan dasturman!`
        ],
        'kim tomonidan yaratilgansan': [
            `Men Asilbek Sodiqov tomonidan 2024 yil oxirida yaratilganman!`,
            `Meni Asidocument.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const nameModal = document.getElementById('name-modal');
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
});

function saveUserName() {
    const nameInput = document.getElementById('name-input');
    const nameModal = document.getElementById('name-modal');
    const chatBox = document.getElementById('chat-box');
    let userName = nameInput.value.trim();

    if (!userName) {
        alert("Iltimos, ismingizni kiriting!");
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
        chatBox.scrollTop = chatBox.scrollHeight;
    } else {
        const initialMessage = document.createElement('div');
        initialMessage.className = 'message bot';
        initialMessage.textContent = `Salom ${userName}, xush kelibsiz! Siz bilan muloqot qilishdan xursandman! Qanday savolingiz bor?`;
        chatBox.appendChild(initialMessage);
    }
}

function clearChat() {
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = '';
    localStorage.removeItem('chatHistory');
    const clearedMessage = document.createElement('div');
    chatBox.appendChild(clearedMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const message = userInput.value.trim();

    if (!message) return;

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
            `Assalomu alaykum, ${userName}! Nima yangiliklar?`,
            `Salom, ${userName}! Bugun siz uchun nima qila olaman?`
        ],
        'qalaysiz': [
            `Men yaxshi, rahmat, ${userName}! Siz-chi?`,
            `Ajoyibman, ${userName}! Sizning ahvolingiz qanday?`,
            `Zo‘rman, ${userName}! Siz qalaysiz?`
        ],
        'xayr': [
            `Xayr, ${userName}! Sizga omad tilayman!`,
            `Xayrli kun, ${userName}! Yana uchrashguncha!`,
            `Xayr, ${userName}! O‘zingizga ehtiyot bo‘ling!`
        ],
        'isming nima': [
            `Mening ismim Sodiqov! Siz bilan tanishganimdan xursandman, ${userName}.`,
            `Ismim Sodiqov, ${userName}! Sizni ko‘rganimdan mamnunman.`,
            `Men Sodiqovman! ${userName}, tanishganimdan xursandman.`
        ],
        'kimsan': [
            `Men rejalashtirilgan savollarga javob berishga mo‘ljallangan chatbotman!`,
            `Men Asilbek Sodiqovning yordamchi chatbotiman!`,
            `Men virtual suhbatdoshman, ${userName}!`
        ],
        'nimasan': [
            `Men Asilbek Sodiqov haqidagi savollarga umumiy javob bera oladigan suhbatdoshman!`,
            `Men oddiy chatbotman, ${userName}!`,
            `Men siz bilan suhbatlashish uchun yaratilgan dasturman!`
        ],
        'kim tomonidan yaratilgansan': [
            `Men Asilbek Sodiqov tomonidan 2024 yil oxirida yaratilganman!`,
            `Meni Asilbek Sodiqov 2024 yilda ishlab chiqqan!`,
            `Men 2024 yilda Asilbek Sodiqovning ijodi natijasiman!`
        ],
        "nima so'ray": [
            `Noqulayliklar uchun uzr, ${userName}. Sizning savollaringiz tez orada ma‘lumotlar bazamga qo‘shiladi.`,
            `Uzr, ${userName}, bunga javobim yo‘q, lekin tez orada o‘rganaman!`,
            `Kechirasiz, ${userName}, buni hali bilmayman, lekin yangilanaman!`
        ]
    };

    // Tutuq belgisini oddiy apostrofga almashtirish va normallashtirish
    const normalizedInput = userInput.toLowerCase().trim().replace(/ʻ/g, "'");

    if (responses[normalizedInput]) {
        const responseArray = responses[normalizedInput];
        const randomIndex = Math.floor(Math.random() * responseArray.length);
        return responseArray[randomIndex];
    } else {
        return `Kechirasiz, ${userName}, men sizni tushunmadim. Boshqa savol so‘rab ko‘ring.`;
    }
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
