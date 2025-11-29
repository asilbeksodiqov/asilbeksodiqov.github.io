// Static ma'lumotlar
const staticData = {
    projects: [
        {
            id: '1',
            title: 'Portfolio Website',
            description: 'Modern portfolio website with responsive design and PWA support',
            technologies: ['HTML', 'CSS', 'JavaScript', 'Node.js'],
            image: '/api/placeholder/400/300',
            liveUrl: 'https://sodiqov.uz',
            githubUrl: '#',
            category: 'web',
            featured: true
        },
        {
            id: '2',
            title: 'Rock, Paper, Scissors Game',
            description: 'Full-stack enjoyable game that made with HTML, CSS, JS',
            technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
            image: '/api/placeholder/400/300',
            liveUrl: 'https://example.com',
            githubUrl: '#',
            category: 'web',
            featured: false
        },
        {
            id: '3',
            title: 'Mobile Fitness App',
            description: 'Cross-platform fitness tracking application',
            technologies: ['React Native', 'Firebase', 'Redux'],
            image: '/api/placeholder/400/300',
            liveUrl: 'https://example.com',
            githubUrl: '#',
            category: 'mobile',
            featured: false
        }
    ],
    skills: [
        { name: 'Ingliz tili', level: 90, category: 'frontend' },
        { name: 'Excel', level: 85, category: 'frontend' },
        { name: 'Huquq', level: 60, category: 'backend' },
        { name: 'Python', level: 40, category: 'backend' },
        { name: 'UI/UX Design', level: 25, category: 'design' },
        { name: 'Rus tili', level: 10, category: 'database' }
    ]
};

// DOM Elements
const projectsContainer = document.getElementById('projectsContainer');
const skillsContainer = document.getElementById('skillsContainer');
const contactForm = document.getElementById('contactForm');
const filterButtons = document.querySelectorAll('.filter-btn');
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const backToTop = document.createElement('button');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-menu a');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

// Initialize All Functions
function initApp() {
    createBackToTopButton();
    setupEventListeners();
    setupScrollEffects();
    setupIntersectionObserver();
    loadInitialData();
    setupMobileMenu();
}

// Create Back to Top Button
function createBackToTopButton() {
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Setup Mobile Menu
function setupMobileMenu() {
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Add active effect
            e.currentTarget.style.transform = 'scale(0.95)';
            setTimeout(() => {
                e.currentTarget.style.transform = '';
            }, 150);
            
            const filter = btn.dataset.filter;
            
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter projects
            filterProjects(filter);
        });
    });
    
    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Window resize handler
    window.addEventListener('resize', handleResize);
}

// Handle Window Resize
function handleResize() {
    if (window.innerWidth > 768 && navMenu) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Setup Scroll Effects
function setupScrollEffects() {
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        // Navbar background on scroll
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Back to top button
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        
        // Active navigation link
        updateActiveNavLink();
        
        // Throttle scroll events
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Additional scroll effects can go here
        }, 100);
    });
}

// Setup Intersection Observer for Scroll Animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate skills progress bars
                if (entry.target.id === 'skills') {
                    animateSkillBars();
                }
                
                // Animate project cards with stagger
                if (entry.target.id === 'projects') {
                    animateProjectCards();
                }
            }
        });
    }, observerOptions);
    
    // Observe sections
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// Update Active Navigation Link
function updateActiveNavLink() {
    let current = '';
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Load Initial Data
function loadInitialData() {
    loadProjects();
    loadSkills();
}

// Load Projects
function loadProjects() {
    displayProjects(staticData.projects);
}

// Display Projects
function displayProjects(projects) {
    if (!projectsContainer) return;
    
    projectsContainer.innerHTML = projects.map(project => `
        <div class="project-card" data-category="${project.category}">
            <div class="project-image">
                <i class="fas fa-${getProjectIcon(project.category)}"></i>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `
                        <span class="tech-tag">${tech}</span>
                    `).join('')}
                </div>
                <div class="project-links">
                    ${project.liveUrl ? `
                        <a href="${project.liveUrl}" class="project-link" target="_blank" rel="noopener">
                            <i class="fas fa-external-link-alt"></i>
                            Live Demo
                        </a>
                    ` : ''}
                    ${project.githubUrl ? `
                        <a href="${project.githubUrl}" class="project-link" target="_blank" rel="noopener">
                            <i class="fab fa-github"></i>
                            Code
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Load Skills
function loadSkills() {
    displaySkills(staticData.skills);
}

// Display Skills
function displaySkills(skills) {
    if (!skillsContainer) return;
    
    skillsContainer.innerHTML = skills.map(skill => `
        <div class="skill-card">
            <div class="skill-header">
                <span class="skill-name">${skill.name}</span>
                <span class="skill-level">${skill.level}%</span>
            </div>
            <div class="skill-bar">
                <div class="skill-progress" style="--progress-width: ${skill.level}%"></div>
            </div>
        </div>
    `).join('');
}

// Animate Skill Bars
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.classList.add('animate');
        }, index * 200);
    });
}

// Animate Project Cards with Stagger
function animateProjectCards() {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 100);
    });
}

// Get Project Icon
function getProjectIcon(category) {
    const icons = {
        'web': 'globe',
        'mobile': 'mobile-alt',
        'desktop': 'desktop',
        'other': 'folder'
    };
    return icons[category] || 'folder';
}

// Filter Projects
function filterProjects(filter) {
    const projects = document.querySelectorAll('.project-card');
    let visibleCount = 0;
    
    projects.forEach(project => {
        if (filter === 'all' || project.dataset.category === filter) {
            project.style.display = 'block';
            visibleCount++;
            
            // Re-trigger animation
            setTimeout(() => {
                project.classList.add('visible');
            }, 50);
        } else {
            project.style.display = 'none';
            project.classList.remove('visible');
        }
    });
    
    // Show message if no projects found
    if (visibleCount === 0) {
        projectsContainer.innerHTML = `
            <div class="no-projects">
                <i class="fas fa-search"></i>
                <h3>Hech qanday loyiha topilmadi</h3>
                <p>Boshqa kategoriyani tanlab ko'ring</p>
            </div>
        `;
    }
}

// Handle Contact Form Submission
async function handleContactSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Yuborilmoqda...';
    submitBtn.disabled = true;

    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name') || e.target[0].value,
        email: formData.get('email') || e.target[1].value,
        message: formData.get('message') || e.target[2].value
    };

    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Log the contact data (haqiqiy loyihada bu serverga yuboriladi)
        console.log('Contact form submitted:', data);
        
        showNotification('Xabaringiz muvaffaqiyatli yuborildi! Tez orada aloqaga chiqamiz.', 'success');
        e.target.reset();
        
    } catch (error) {
        console.error('Error sending message:', error);
        showNotification('Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.', 'error');
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 1001;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Scroll to Section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add CSS animations
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .no-projects {
        text-align: center;
        padding: 3rem;
        color: #6b7280;
        grid-column: 1 / -1;
    }
    
    .no-projects i {
        font-size: 4rem;
        margin-bottom: 1rem;
        color: #6366f1;
        opacity: 0.5;
    }
    
    .fa-spinner {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(additionalStyles);