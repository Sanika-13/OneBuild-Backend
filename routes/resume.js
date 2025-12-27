const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// MEMORY STORAGE (Direct Base64) - Replacing Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    // Allow images and docs
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.pdf' && ext !== '.doc' && ext !== '.docx') {
      return cb(new Error('Only JPG, JPEG, PNG, PDF, and DOC/DOCX files are allowed'));
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Upload profile image / resume -> Returns Base64 Data URI
router.post('/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Explicitly handle buffer for Base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    console.log('✅ File converted to Base64. Size:', req.file.size);

    res.json({
      message: 'File converted to Base64 successfully',
      filename: req.file.originalname,
      path: dataURI // Frontend expects 'path'
    });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Failed to process file' });
  }
});

module.exports = router;
