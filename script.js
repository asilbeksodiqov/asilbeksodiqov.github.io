document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".bottom-nav a");
    const pages = document.querySelectorAll(".page");
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;
  
    // Navigatsiya
    function showPage(targetId) {
      pages.forEach(page => page.classList.remove("active"));
      document.getElementById(targetId).classList.add("active");
  
      navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.dataset.target === targetId) {
          link.classList.add("active");
        }
      });
    }
  
    window.addEventListener("hashchange", () => {
      const hash = window.location.hash.replace("#", "") || "home";
      if (["home", "skills", "experience", "gallery", "contact"].includes(hash)) {
        showPage(hash);
      }
    });
  
    navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = link.dataset.target;
        window.location.hash = target;
      });
    });
  
    // Dastlabki yuklash
    const hash = window.location.hash.replace("#", "") || "home";
    showPage(hash);
  
    // Progress bar animatsiyasi
    function animateProgressBars() {
      const progressItems = document.querySelectorAll('.progress-item');
      progressItems.forEach(item => {
        const fill = item.querySelector('.progress-fill');
        const width = fill.style.width;
        fill.style.width = '0';
        fill.style.setProperty('--width', width);
  
        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            fill.style.width = width;
            observer.unobserve(item);
          }
        }, { threshold: 0.1 });
        observer.observe(item);
      });
    }
  
    if (window.location.hash === '#skills') {
      animateProgressBars();
    }
  
    window.addEventListener('hashchange', () => {
      if (window.location.hash === '#skills') {
        setTimeout(animateProgressBars, 100);
      }
    });
  
    // Modal oynalar
    document.querySelectorAll('.more-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target.getAttribute('data-target');
        document.getElementById(`${target}-modal`).style.display = 'block';
        document.getElementById('modal-overlay').style.display = 'flex';
      });
    });
  
    document.querySelectorAll('.close-btn').forEach(button => {
      button.addEventListener('click', () => {
        document.getElementById('modal-overlay').style.display = 'none';
        document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
      });
    });
  
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
      if (e.target === document.getElementById('modal-overlay')) {
        document.getElementById('modal-overlay').style.display = 'none';
        document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
      }
    });
  
    // -------------------------------
    // 🔤 TIL ALMASHTIRISH FUNKSIYASI
    // -------------------------------
  
    const translations = {
      en: {
        bio: "I am always eager to learn and passionate about mastering new technologies. Currently, I'm diving deep into frontend and backend development. Additionally, law and English language are expanding my knowledge horizon.",
        "daily-tip": "Daily Tip",
        skills: "My Skills",
        developer: "Developer",
        english: "English Language",
        law: "Law Fundamentals",
        "no-data": "No data available",
        contact: "Contact Me",
        email: "Email",
        call: "Call",
        more: "More",
        "dev-certificate": "Here is my certificate of computer literacy:",
        "english-certificate": "My English certificate:",
        "law-certificate": "Degree certificate:",
        "dev-desc": "I'm learning frontend and backend development with great passion. I use AI tools like GitHub Copilot, Qwen, and Deepseek to accelerate my learning. This is my hobby and a path to a future career.",
        "english-desc": "I have 2 years of experience in learning English and hold a certificate of proficiency. I use it daily for reading technical documentation and watching educational videos.",
        "law-desc": "I completed my Bachelor's degree in Law at Kokand State University (2021-2025). Currently, I am pursuing a Master's degree at Karakalpak State University starting in 2025."
      },
      uz: {
        bio: "Men doimo o'rganishga intiladigan va yangi texnologiyalarni o'zlashtirishga qiziqqan insonman. Hozirda frontend va backend dasturlashni chuqur o'rganib bormoqdaman. Shuningdek, huquq sohasi va ingliz tili ham bilim doiramni kengaytirib kelmoqda.",
        "daily-tip": "Kundalik maslahat",
        skills: "Ko'nikmalarim",
        developer: "Dasturchi",
        english: "Ingliz tili",
        law: "Huquq asoslari",
        "no-data": "Ma'lumot topilmadi",
        contact: "Bog'lanish",
        email: "Email",
        call: "Qo'ng'iroq qilish",
        more: "Batafsil",
        "dev-certificate": "Kompyuter savodxonligi sertifikatim:",
        "english-certificate": "Ingliz tili sertifikatim:",
        "law-certificate": "Diplomim:",
        "dev-desc": "Frontend va backend dasturlashni katta qiziqish bilan o'rganmoqdaman. O'qishni tezlashtirish uchun GitHub Copilot, Qwen va Deepseek kabi AI vositalaridan foydalanaman. Bu mening hobbim va kelajakdagi kasbimga yo'l.",
        "english-desc": "Ingliz tilini o'rganish bo'yicha 2 yillik tajribaga ega man va darajangizni tasdiqlovchi sertifikatga ega man. Texnik hujjatlarni o'qish va ta'lim videolarini tomosha qilish uchun har kuni foydalanaman.",
        "law-desc": "2021-2025-yillarda Qo'qon Davlat Universitetida huquq bo'yicha bakalavriat darajasini tamomladim. Hozirda 2025-yildan boshlab Qoraqalpog'iston Davlat Universitetida magistraturaga o'qishga kirdim."
      },
      ru: {
        bio: "Я всегда стремлюсь к обучению и увлечён освоением новых технологий. В настоящее время я углублённо изучаю frontend и backend разработку. Кроме того, юриспруденция и английский язык расширяют мой кругозор.",
        "daily-tip": "Ежедневный совет",
        skills: "Мои навыки",
        developer: "Разработчик",
        english: "Английский язык",
        law: "Основы права",
        "no-data": "Данные отсутствуют",
        contact: "Контакты",
        email: "Эл. почта",
        call: "Позвонить",
        more: "Подробнее",
        "dev-certificate": "Сертификат о компьютерной грамотности:",
        "english-certificate": "Мой сертификат по английскому языку:",
        "law-certificate": "Диплом о высшем образовании:",
        "dev-desc": "Я с большим энтузиазмом изучаю frontend и backend разработку. Для ускорения обучения использую ИИ-инструменты, такие как GitHub Copilot, Qwen и Deepseek. Это моё хобби и путь к будущей карьере.",
        "english-desc": "У меня есть 2-летний опыт изучения английского языка и сертификат о владении. Я использую его ежедневно для чтения технической документации и просмотра обучающих видео.",
        "law-desc": "Я получил степень бакалавра по специальности «Право» в Кокандском государственном университете (2021–2025). В настоящее время планирую продолжить обучение в магистратуре Каракалпакского государственного университета, начиная с 2025 года."
      }
    };
  
    // Tilni o'rnatish funksiyasi
    function setLanguage(lang) {
      document.querySelectorAll('[data-tr]').forEach(el => {
        const key = el.getAttribute('data-tr');
        if (translations[lang] && translations[lang][key]) {
          el.textContent = translations[lang][key];
        }
      });
  
      // Aktiv tilni yangila
      document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
      });
  
      // Tilni saqla
      localStorage.setItem('lang', lang);
    }
  
    // Responsive til tanlash (modal oyna)
    const langToggle = document.getElementById('lang-toggle');
    const langModal = document.getElementById('lang-modal');
    const langClose = document.querySelector('.lang-close');
    const langBtns = document.querySelectorAll('.lang-btn-modal');
  
    if (langToggle && langModal) {
      // Modalni ochish
      langToggle.addEventListener('click', (e) => {
        e.preventDefault();
        langModal.style.display = 'flex';
      });
  
      // Yopish tugmasi
      if (langClose) {
        langClose.addEventListener('click', () => {
          langModal.style.display = 'none';
        });
      }
  
      // Fonni bosib yopish
      langModal.addEventListener('click', (e) => {
        if (e.target === langModal) {
          langModal.style.display = 'none';
        }
      });
  
      // Tilni tanlash
      langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const lang = btn.getAttribute('data-lang');
          setLanguage(lang);
          langModal.style.display = 'none';
  
          // Bayroqni yangila
          const flag = lang === 'en' ? '🇬🇧' : lang === 'uz' ? '🇺🇿' : '🇷🇺';
          document.querySelector('.lang-icon').textContent = flag;
        });
      });
    }
  
    // Dastlabki til
    const savedLang = localStorage.getItem('lang') || 'en';
    setLanguage(savedLang);
  
    // Dastlabki bayroq
    const flagIcon = document.querySelector('.lang-icon');
    if (flagIcon) {
      const initialFlag = savedLang === 'en' ? '🇬🇧' : savedLang === 'uz' ? '🇺🇿' : '🇷🇺';
      flagIcon.textContent = initialFlag;
    }
  });

  // Barcha boshqa kodlar tugagandan keyin, oxiriga qo'shing:

// Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js')
        .then(reg => console.log('SW registered: ', reg))
        .catch(err => console.log('SW not registered: ', err));
    });
  }