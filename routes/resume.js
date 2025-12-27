const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'dceofncr5',
  api_key: '916973651243259',
  api_secret: 'z9iPJdWQEi1zmRmLiMSvMdJ1NWI'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const ext = path.extname(file.originalname).toLowerCase();

    // Use 'auto' to let Cloudinary detect the file type (PDFs become viewable images/docs, DOCs become raw).
    // We append the extension to public_id to ensure the filename is correct for download/viewing.
    return {
      folder: 'onebuild_resumes',
      resource_type: 'auto',
      public_id: path.parse(file.originalname).name + '-' + Date.now() + ext,
    };
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.pdf' && ext !== '.doc' && ext !== '.docx') {
      return cb(new Error('Only JPG, JPEG, PNG, PDF, and DOC/DOCX files are allowed'));
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 } // Increased to 10MB
});

// Upload profile image
router.post('/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    console.log('✅ Profile Image uploaded to Cloudinary:', req.file.path);

    res.json({
      message: 'Image uploaded successfully',
      filename: req.file.filename,
      path: req.file.path
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

module.exports = router;
