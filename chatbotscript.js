document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    let userName = localStorage.getItem('userName');

    // Ism so‘rash
    if (!userName) {
        while (!userName) {
            userName = prompt("Iltimos, ismingizni kiriting:");
            if (!userName) alert("Ism kiritish majburiy!");
        }
        localStorage.setItem('userName', userName);
    }

    // Oldingi suhbatni yuklash
    const savedChat = localStorage.getItem('chatHistory');
    if (savedChat) {
        chatBox.innerHTML = savedChat; // Saqlangan suhbatni ko‘rsatish
        chatBox.scrollTop = chatBox.scrollHeight; // Oxirgi xabarga o‘tish
    } else {
        // Agar suhbat bo‘lmasa, boshlang‘ich xabar
        const initialMessage = document.createElement('div');
        initialMessage.className = 'message bot';
        initialMessage.innerHTML = `<img src="Asilxon Sodiqov Logo.jpg" alt="Bot Logo"> Salom ${userName}, xush kelibsiz! Siz bilan muloqot qilishdan xursandman! Qanday savolingiz bor?`;
        chatBox.appendChild(initialMessage);
    }
});

function sendMessage() {
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const message = userInput.value.trim();

    if (!message) return;

    // Foydalanuvchi xabari
    const userMessage = document.createElement('div');
    userMessage.className = 'message user';
    userMessage.textContent = message;
    chatBox.appendChild(userMessage);

    // Inputni darhol tozalash
    userInput.value = '';

    // Typing animatsiyasi
    const typingMessage = document.createElement('div');
    typingMessage.className = 'message bot';
    typingMessage.innerHTML = '<div class="typing-animation"></div>';
    chatBox.appendChild(typingMessage);
    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(() => {
        typingMessage.remove();

        // Bot javobi
        const botMessage = document.createElement('div');
        botMessage.className = 'message bot';
        botMessage.innerHTML = `<img src="Asilxon Sodiqov Logo.jpg" alt="Bot Logo"> ${getBotResponse(message)}`;
        chatBox.appendChild(botMessage);

        // Telegramga yuborish
        sendToTelegram(localStorage.getItem('userName'), message);

        // Suhbatni saqlash
        localStorage.setItem('chatHistory', chatBox.innerHTML);

        chatBox.scrollTop = chatBox.scrollHeight;
        userInput.focus();
    }, 1000);
}

function getBotResponse(userInput) {
    const userName = localStorage.getItem('userName'); // Foydalanuvchi ismini olish
    const responses = {
        'salom': `Salom, ${userName}! Sizga qanday yordam bera olaman?`,
        'qalaysiz': `Men yaxshi, rahmat, ${userName}! Siz-chi?`,
        'xayr': `Xayr, ${userName}! Sizga omad tilayman!`,
        'isming nima': `Mening ismim Sodiqov! Siz bilan tanishganimdan xursandman ${userName}.`,
        'kimsan': `Men rejalashtirilgan savollarga javob berishga mo‘ljallangan chatbotman!`,
        'nimasan': `Men Asilbek Sodiqov haqidagi savollarga umumiy tarzda javob bera oladigan suhbatdoshman!`,
        'kim tomonidan yaratilgansan': `Men Asilbek Sodiqov tomonidan 2024 yil oxirida yaratilganman!`,
        "nima so'ray": `Noqulayliklar uchun uzr so‘rayman, ${userName}. Sizning savollaringiz tez orada ma‘lumotlar bazamga qo‘shiladi.`
    };

    userInput = userInput.toLowerCase().trim();
    return responses[userInput] || `Kechirasiz ${userName}, men sizni tushunmadim. Boshqa narsa so‘rab ko‘ring.`;
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