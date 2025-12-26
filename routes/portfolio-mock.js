const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const Portfolio = require('../models/Portfolio');
const User = require('../models/User');

// Middleware to check auth (Basic version)
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Since we used `token-${user._id}` as a simple token
      const userId = token.replace('token-', '');
      req.user = await User.findById(userId); // Verify user exists

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Create portfolio (Real DB)
router.post('/create', protect, async (req, res) => {
  try {
    const {
      name, about, profileImage, skills, projects, achievements,
      experience, socialLinks, theme
    } = req.body;

    console.log('💼 Creating portfolio for user:', req.user._id);

    // Generate unique URL
    const uniqueUrl = nanoid(10);

    const portfolio = await Portfolio.create({
      userId: req.user._id,
      uniqueUrl,
      name,
      about,
      profileImage,
      skills,
      projects,
      achievements,
      experience,
      socialLinks,
      theme,
      isPublished: true
    });

    console.log('✅ Portfolio created:', uniqueUrl);

    res.json({
      message: 'Portfolio created successfully',
      portfolio: {
        id: portfolio._id,
        uniqueUrl: portfolio.uniqueUrl,
        theme: portfolio.theme,
        isPublished: portfolio.isPublished
      }
    });
  } catch (error) {
    console.error('Error creating portfolio:', error);
    res.status(500).json({ message: 'Error creating portfolio', error: error.message });
  }
});

// Get portfolio by unique URL (Public)
router.get('/:uniqueUrl', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ uniqueUrl: req.params.uniqueUrl });

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching portfolio', error: error.message });
  }
});

// Get all portfolios (Debug/Admin)
router.get('/', async (req, res) => {
  try {
    const portfolios = await Portfolio.find().sort({ createdAt: -1 });
    res.json(portfolios);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching portfolios', error: error.message });
  }
});

module.exports = router;
