document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');

    const initialMessage = document.createElement('div');
    initialMessage.className = 'message bot initial-message';
    initialMessage.textContent = "To'g'ri va aniq muloqot qilish uchun imloviy jihatdan to'g'ri yozing.";
    chatBox.appendChild(initialMessage);
});

function sendMessage() {
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const initialMessage = document.querySelector('.initial-message');

    if (userInput.value.trim() === '') return;

    if (initialMessage) {
        initialMessage.remove();
    }

    const userMessage = document.createElement('div');
    userMessage.className = 'message user';
    userMessage.textContent = userInput.value;
    chatBox.appendChild(userMessage);

    // Show typing animation
    const typingMessage = document.createElement('div');
    typingMessage.className = 'message bot';
    typingMessage.innerHTML = '<div class="typing-animation"></div>';
    chatBox.appendChild(typingMessage);

    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(() => {
        typingMessage.remove();

        const botMessage = document.createElement('div');
        botMessage.className = 'message bot';

        const botLogo = document.createElement('img');
        botLogo.src = 'Asilxon Sodiqov Logo.jpg';
        botLogo.alt = 'Bot Logo';

        const botText = document.createElement('span');
        botText.textContent = getBotResponse(userInput.value);

        botMessage.appendChild(botLogo);
        botMessage.appendChild(botText);
        chatBox.appendChild(botMessage);

        sendToTelegram(userInput.value);

        chatBox.scrollTop = chatBox.scrollHeight;

        userInput.value = '';
        userInput.focus();
    }, 1500);
}

function getBotResponse(userInput) {
    const responses = {
        'salom': 'Salom! Sizga qanday yordam bera olaman?',
        'qalaysiz': 'Men yaxshi, rahmat! Siz-chi?',
        'xayr': 'Xayr! Sizga omad tilayman!',
        'isming nima': 'Mening ismim ASchat! Lekin qisqa qilib AS deb chaqirishingiz mumkin.',
        'kimsan': 'Men rejalashtirilgan savollarga javob berishga mo`ljallangan chatbotman.',
        'nimasan': 'Men Asilbek Sodiqov haqidagi savollarga umumiy tarzda javob bera oladigan suhbatdoshman.',
        'kim tomonidan yaratilgansan': 'Men Asilbek Sodiqov tomonidan 2024 yil oxirida yaratilganman.',
        'nima so`ray': 'Noqulayliklar uchun uzr so`rayman. Sizning ushbu savollaringiz tez orada ma`lumotlar bazamga qo`shiladi va Sodiqov tomonidan munosib javoblar kiritiladi.'
    };

    userInput = userInput.toLowerCase().trim();
    return responses[userInput] || "Kechirasiz, men sizni tushunmadim. Boshqa narsa so'rab ko'ring.";
}

function sendToTelegram(message) {
    const botToken = '8054355597:AAGXFJTUFkJMPJi9qk9L61LLZoULVPxHNzU';
    const chatId = '5830723196';

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const data = {
        chat_id: chatId,
        text: message
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Xabar yuborildi:', data);
    })
    .catch(error => {
        console.error('Xatolik yuz berdi:', error);
    });
}

const userInput = document.getElementById('user-input');
userInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
