import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Ma'lumotlar bazasi (memory)
let projects = [
  {
    id: '1',
    title: 'Portfolio Website',
    description: 'Modern portfolio website with responsive design',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Node.js'],
    image: '/api/placeholder/400/300',
    liveUrl: 'https://sodiqov.uz',
    githubUrl: 'https://github.com',
    category: 'web',
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'E-commerce Platform',
    description: 'Full-stack e-commerce solution',
    technologies: ['React', 'Node.js', 'MongoDB'],
    image: '/api/placeholder/400/300',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    category: 'web',
    featured: false,
    createdAt: new Date().toISOString()
  }
];

let skills = [
  { id: '1', name: 'JavaScript', level: 90, category: 'frontend' },
  { id: '2', name: 'React', level: 85, category: 'frontend' },
  { id: '3', name: 'Node.js', level: 80, category: 'backend' },
  { id: '4', name: 'Python', level: 75, category: 'backend' },
  { id: '5', name: 'UI/UX Design', level: 70, category: 'design' }
];

let contacts = [];

// API Routes
app.get('/api/projects', (req, res) => {
  res.json(projects);
});

app.get('/api/projects/:id', (req, res) => {
  const project = projects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

app.get('/api/skills', (req, res) => {
  res.json(skills);
});

// Contact form
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, message } = req.body;

    console.log('Contact form received:', { name, email, message });

    // Validatsiya
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Iltimos, barcha maydonlarni to\'ldiring' 
      });
    }

    // Email validatsiya
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Iltimos, to\'g\'ri email manzil kiriting' 
      });
    }

    // Contactni saqlash
    const newContact = {
      id: Date.now().toString(),
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
      read: false
    };
    
    contacts.push(newContact);
    
    console.log('Contact saved:', newContact);

    // Email yuborish simulyatsiya
    console.log('=== YANGI XABAR ===');
    console.log('Ism:', name);
    console.log('Email:', email);
    console.log('Xabar:', message);
    console.log('==================');

    res.json({ 
      success: true,
      message: 'Xabaringiz muvaffaqiyatli yuborildi! Tez orada aloqaga chiqamiz.' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      error: 'Xabarni yuborishda xatolik yuz berdi. Iltimos, keyinroq urinib ko\'ring.' 
    });
  }
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// Manifest.json ni serve qilish
app.get('/manifest.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(join(__dirname, 'manifest.json'));
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Sahifa topilmadi' });
});

app.listen(PORT, () => {
  console.log('=== SODIQOV.UZ SERVER ===');
  console.log(`Server ${PORT}-portda ishlamoqda`);
  console.log(`Frontend: http://localhost:${PORT}`);
  console.log('==========================');
});