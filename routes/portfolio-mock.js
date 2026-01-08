const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const Portfolio = require('../models/Portfolio');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('🔒 Auth Middleware - Received Token:', token);

      // Since we used `token-${user._id}` as a simple token
      const userId = token.replace('token-', '');
      console.log('🔒 Auth Middleware - Extracted UserID:', userId);

      req.user = await User.findById(userId); // Verify user exists
      console.log('🔒 Auth Middleware - User Found:', req.user ? 'Yes' : 'No');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error('🔒 Auth Middleware - Error:', error);
      res.status(401).json({ message: 'Not authorized', error: error.message });
    }
  } else {
    console.log('🔒 Auth Middleware - No Token/Bearer Header:', req.headers.authorization);
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Create portfolio (Real DB)
router.post('/create', protect, async (req, res) => {
  try {
    const {
      name, about, profileImage, skills, projects, achievements,
      experience, socialLinks, theme, resume, stats, isNewVersion // Added isNewVersion flag
    } = req.body;

    console.log('💼 Creating/Updating portfolio for user:', req.user._id, 'New Version:', isNewVersion);

    // Check if portfolio exists (ONLY if not forcing a new version)
    let portfolio = null;
    // FORCE NEW: We are disabling the check to ensure every request creates a new unique link
    // if (!isNewVersion) {
    //   portfolio = await Portfolio.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    // }

    // Generate unique URL if new (or forcing new)
    const uniqueUrl = nanoid(10); // ALWAYS generate new ID

    const portfolioData = {
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
      resume,
      stats,
      isPublished: true
    };

    // ALWAYS Create new
    portfolio = await Portfolio.create(portfolioData);

    // Removed Update Logic
    // if (portfolio) { ... } else { ... }

    console.log('✅ Portfolio saved:', uniqueUrl);

    res.json({
      message: 'Portfolio saved successfully',
      portfolio: {
        id: portfolio._id,
        uniqueUrl: portfolio.uniqueUrl,
        theme: portfolio.theme,
        isPublished: portfolio.isPublished
      }
    });
  } catch (error) {
    console.error('Error in portfolio create/update:', error);
    res.status(500).json({ message: 'Error creating portfolio', error: error.message });
  }
});

// Get MY portfolio (Edit Mode - Pre-fill)
router.get('/me', protect, async (req, res) => {
  try {
    // Find the LATEST portfolio created by this user
    const portfolio = await Portfolio.findOne({ userId: req.user._id }).sort({ createdAt: -1 });

    if (!portfolio) {
      return res.status(404).json({ message: 'No portfolio found' });
    }

    res.json(portfolio);
  } catch (error) {
    console.error('Error fetching my portfolio:', error);
    res.status(500).json({ message: 'Error fetching my portfolio', error: error.message });
  }
});

// Get portfolio by unique URL (Public)
router.get('/:uniqueUrl', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ uniqueUrl: req.params.uniqueUrl });

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Increment views count
    portfolio.views = (portfolio.views || 0) + 1;
    await portfolio.save();

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
