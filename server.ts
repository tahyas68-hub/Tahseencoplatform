import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import multer from 'multer';
import cors from 'cors';
import Database from 'better-sqlite3';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Setup static uploads directory
  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  app.use('/uploads', express.static(uploadDir));

  // Initialize SQLite Database
  const dbPath = path.join(process.cwd(), 'database.sqlite');
  const db = new Database(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      price TEXT,
      duration TEXT,
      instructor TEXT,
      videoUrl TEXT,
      type TEXT,
      students INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS units (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      courseId INTEGER,
      title TEXT,
      duration TEXT,
      completed BOOLEAN DEFAULT 0,
      active BOOLEAN DEFAULT 0
    );
  `);

  // Setup Multer for file uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + ext);
    }
  });
  const upload = multer({ storage });

  // API Routes
  app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // In production, you might want to return an absolute URL or use a proper static mapping
    const url = `/uploads/${req.file.filename}`;
    res.json({ url, filename: req.file.filename, originalName: req.file.originalname });
  });

  // Courses API
  app.get('/api/courses', (req, res) => {
    const stmt = db.prepare('SELECT * FROM courses');
    const courses = stmt.all();
    res.json(courses);
  });

  app.post('/api/courses', (req, res) => {
    const { title, description, price, duration, instructor, videoUrl, type } = req.body;
    
    const stmt = db.prepare('INSERT INTO courses (title, description, price, duration, instructor, videoUrl, type, students) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    const info = stmt.run(title, description, price, duration, instructor, videoUrl, type || 'فيديو', 0);
    
    res.json({ id: info.lastInsertRowid });
  });

  app.delete('/api/courses/:id', (req, res) => {
    const id = req.params.id;
    const stmt = db.prepare('DELETE FROM courses WHERE id = ?');
    stmt.run(id);
    res.json({ success: true });
  });

  // Database seed function 
  const checkEmpty = db.prepare('SELECT COUNT(*) as count FROM courses').get() as { count: number };
  if (checkEmpty.count === 0) {
    const insertCourse = db.prepare('INSERT INTO courses (title, description, price, duration, instructor, type, students) VALUES (?, ?, ?, ?, ?, ?, ?)');
    insertCourse.run('كورس الرياضيات المتقدمة', 'شرح شامل لمقرر الرياضيات المتقدمة', 'مجاني', '12 ساعة', 'د. أحمد محمود', 'فيديو + PDF', 120);
    insertCourse.run('تصميم الواجهات UX/UI', 'دورة عملية لتصميم واجهات المستخدم', '$50', '8 أسابيع', 'م. سارة علي', 'بث مباشر - Zoom', 85);
    insertCourse.run('التسويق الرقمي', 'التسويق الاحترافي عبر المنصات الرقمية', '$30', '5 ساعات', 'أ. خالد سعيد', 'فيديو حصري', 340);
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Determine the dist path properly
    const distPath = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    } else {
      app.get('*', (req, res) => {
        res.send('Production build not found in dist folder.');
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
