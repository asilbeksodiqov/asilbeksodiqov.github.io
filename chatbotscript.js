// "O'chirish" tugmasini aniq bog'lash uchun qo'shimcha kod
document.querySelector('.clear-chat-btn').addEventListener('click', (event) => {
    event.stopPropagation(); // chatHeader click hodisasini to'xtatish uchun
    openModal();
});

// Modalni ochish funksiyasi
function openModal() {
    const confirmModal = document.getElementById('confirmModal');
    confirmModal.style.display = 'flex';
}

// Chatni tozalashni tasdiqlash funksiyasi
function confirmClearChat(confirmed) {
    const confirmModal = document.getElementById('confirmModal');
    const chatBox = document.getElementById('chat-box');
    confirmModal.style.display = 'none';
    if (confirmed) {
        chatBox.innerHTML = '';
        localStorage.removeItem('chatHistory');
        const clearedMessage = document.createElement('div');
        clearedMessage.className = 'message bot';
        clearedMessage.textContent = 'Chat tarixi tozalandi!';
        chatBox.appendChild(clearedMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// Modal ichidagi tugmalar uchun hodisalar (agar HTMLda bo'lsa)
document.addEventListener('DOMContentLoaded', () => {
    const yesButton = document.querySelector('#confirmModal .yes-btn');
    const noButton = document.querySelector('#confirmModal .no-btn');

    if (yesButton) {
        yesButton.addEventListener('click', () => confirmClearChat(true));
    }
    if (noButton) {
        noButton.addEventListener('click', () => confirmClearChat(false));
    }

    // Qolgan kodlar o'zgarishsiz qoladi
    // ...
});
