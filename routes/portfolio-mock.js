const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');

// Create portfolio (using mock DB)
router.post('/create', async (req, res) => {
  try {
    const {
      name,
      about,
      profileImage,
      skills,
      projects,
      achievements,
      experience,
      socialLinks,
      theme
    } = req.body;

    console.log('💼 Creating portfolio...');

    // Generate unique URL
    const uniqueUrl = nanoid(10);

    const portfolio = {
      id: Date.now().toString(),
      uniqueUrl,
      name,
      about,
      profileImage: profileImage || null,
      skills: skills || [],
      projects: projects || [],
      achievements: achievements || [],
      experience: experience || [],
      socialLinks: socialLinks || {},
      theme: theme || 'dark',
      isPublished: true, // Auto-publish
      createdAt: new Date()
    };

    // Store in mock DB
    global.mockDB.portfolios.push(portfolio);

    console.log('✅ Portfolio created with uniqueUrl:', uniqueUrl);
    console.log('📊 Total portfolios in DB:', global.mockDB.portfolios.length);

    res.json({
      message: 'Portfolio created successfully',
      portfolio: {
        id: portfolio.id,
        uniqueUrl: portfolio.uniqueUrl,
        theme: portfolio.theme,
        isPublished: portfolio.isPublished
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating portfolio', error: error.message });
  }
});

// Publish portfolio
router.post('/publish', async (req, res) => {
  try {
    const { portfolioId } = req.body;

    // Find portfolio in mock DB
    const portfolio = global.mockDB.portfolios.find(p => p.id === portfolioId || p.uniqueUrl === portfolioId);

    if (!portfolio) {
      // If no specific ID, publish the last created portfolio
      const lastPortfolio = global.mockDB.portfolios[global.mockDB.portfolios.length - 1];
      if (lastPortfolio) {
        lastPortfolio.isPublished = true;
        return res.json({
          message: 'Portfolio published successfully',
          portfolioUrl: `http://localhost:3000/p/${lastPortfolio.uniqueUrl}`
        });
      }
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    portfolio.isPublished = true;

    res.json({
      message: 'Portfolio published successfully',
      portfolioUrl: `http://localhost:3000/p/${portfolio.uniqueUrl}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Error publishing portfolio', error: error.message });
  }
});

// Get portfolio by unique URL (for public viewing)
router.get('/:uniqueUrl', async (req, res) => {
  try {
    const portfolio = global.mockDB.portfolios.find(
      p => p.uniqueUrl === req.params.uniqueUrl
    );

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found or not published' });
    }

    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching portfolio', error: error.message });
  }
});

// Get all portfolios (for admin)
router.get('/', async (req, res) => {
  try {
    res.json(global.mockDB.portfolios);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching portfolios', error: error.message });
  }
});

// Debug endpoint - get last portfolio
router.get('/debug/last', async (req, res) => {
  try {
    const lastPortfolio = global.mockDB.portfolios[global.mockDB.portfolios.length - 1];
    res.json({
      total: global.mockDB.portfolios.length,
      lastPortfolio: lastPortfolio || null
    });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
});

module.exports = router;
