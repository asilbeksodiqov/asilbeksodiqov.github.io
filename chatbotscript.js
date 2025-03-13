document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const nameModal = document.getElementById('name-modal');
    const confirmModal = document.getElementById('confirm-modal');
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

function showConfirmModal() {
    const confirmModal = document.getElementById('confirm-modal');
    confirmModal.style.display = 'flex';
}

function confirmClear(confirmed) {
    const confirmModal = document.getElementById('confirm-modal');
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
        'salom': `Salom, ${userName}! Sizga qanday yordam bera olaman?`,
        'qalaysiz': `Men yaxshi, rahmat, ${userName}! Siz-chi?`,
        'xayr': `Xayr, ${userName}! Sizga omad tilayman!`,
        'isming nima': `Mening ismim Sodiqov! Siz bilan tanishganimdan xursandman, ${userName}.`,
        'kimsan': `Men rejalashtirilgan savollarga javob berishga mo‘ljallangan chatbotman!`,
        'nimasan': `Men Asilbek Sodiqov haqidagi savollarga umumiy javob bera oladigan suhbatdoshman!`,
        'kim tomonidan yaratilgansan': `Men Asilbek Sodiqov tomonidan 2024 yil oxirida yaratilganman!`,
        "nima so'ray": `Noqulayliklar uchun uzr, ${userName}. Sizning savollaringiz tez orada ma‘lumotlar bazamga qo‘shiladi.`
    };

    userInput = userInput.toLowerCase().trim();
    return responses[userInput] || `Kechirasiz, ${userName}, men sizni tushunmadim. Boshqa savol so‘rab ko‘ring.`;
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
