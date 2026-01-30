import dotenv from 'dotenv';
// Load environment variables FIRST before any other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { generateVideoAd } from './services/videoGenerator.js';
import { sendVideoAdEmail } from './services/emailSender.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create directories if they don't exist
const uploadsDir = path.join(__dirname, 'uploads');
const outputDir = path.join(__dirname, 'output');
[uploadsDir, outputDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Serve static files
app.use('/output', express.static(outputDir));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  }
});

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.post('/api/generate-ad', upload.single('image'), async (req, res) => {
  try {
    const { productName, productDescription } = req.body;
    const imagePath = req.file.path;

    if (!productName) {
      return res.status(400).json({ error: 'Product name is required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Product image is required' });
    }

    console.log(`Generating video ad for: ${productName}`);
    console.log(`Image path: ${imagePath}`);

    const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEETS_SPREADSHEET_ID}/values/Sheet1?key=${process.env.GOOGLE_SHEETS_API_KEY}`;
    const sheetsRes = await fetch(sheetsUrl);
    const sheetsData = await sheetsRes.json();
    const rows = sheetsData.values ?? [];
    const dataRows = rows.slice(1);
    const headers = rows[0] ?? [];
    const emailColIndex = headers.findIndex(h => String(h).toLowerCase().trim() === 'email');

    if (dataRows.length === 0) {
      return res.status(400).json({
        error: 'No consumer profiles found',
        message: 'Add at least one data row to your Google Sheet (below the header).'
      });
    }

    const videos = [];
    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const consumerProfile = {};
      headers.forEach((h, j) => { consumerProfile[h] = (row[j] ?? '').toString().trim(); });
      const hasContent = Object.values(consumerProfile).some(v => v.length > 0);
      if (!hasContent) continue;

      const profilePreview = Object.entries(consumerProfile).map(([k, v]) => `${k}: ${v}`).join(', ');
      console.log(`Generating video ad ${i + 1}/${dataRows.length} for consumer: ${profilePreview.substring(0, 50)}...`);
      const { videoUrl, scriptPath } = await generateVideoAd({
        imagePath,
        productName,
        productDescription: productDescription || '',
        consumerProfile,
      });

      let emailSent = false;
      const email = emailColIndex >= 0 ? (consumerProfile[headers[emailColIndex]] ?? '').trim() : '';
      if (email && email.includes('@')) {
        const videoFilePath = path.join(outputDir, path.basename(videoUrl));
        emailSent = await sendVideoAdEmail(email, productName, videoFilePath);
      }

      videos.push({ videoUrl, scriptPath, consumerProfile, emailSent });
    }

    res.json({
      success: true,
      videos,
      message: `${videos.length} video ad(s) generated successfully`
    });

  } catch (error) {
    console.error('Error generating video ad:', error);
    res.status(500).json({
      error: 'Failed to generate video ad',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
