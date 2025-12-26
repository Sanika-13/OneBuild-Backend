const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const Portfolio = require('../models/Portfolio');
const { auth } = require('../middleware/auth');

// Create portfolio
router.post('/create', auth, async (req, res) => {
  try {
    const {
      name,
      about,
      profileImage,
      education,
      skills,
      projects,
      achievements,
      experience,
      socialLinks,
      theme,
      animation
    } = req.body;

    // Check if user already has a portfolio
    let portfolio = await Portfolio.findOne({ userId: req.user.id });

    const portfolioData = {
      name,
      about,
      profileImage,
      skills: skills || [],
      projects: projects || [],
      achievements: achievements || [],
      experience: experience || [],
      socialLinks: socialLinks || {},
      theme: theme || 'dark',
      animation: animation || 'none'
    };

    if (portfolio) {
      // Update existing portfolio
      Object.assign(portfolio, portfolioData);
      portfolio.updatedAt = Date.now();
      await portfolio.save();
    } else {
      // Create new portfolio with unique URL
      const uniqueUrl = nanoid(10);
      portfolio = new Portfolio({
        userId: req.user.id,
        uniqueUrl,
        ...portfolioData
      });
      await portfolio.save();
    }

    res.json({
      message: 'Portfolio created successfully',
      portfolio: {
        id: portfolio._id,
        uniqueUrl: portfolio.uniqueUrl,
        theme: portfolio.theme,
        animation: portfolio.animation,
        isPublished: portfolio.isPublished
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating portfolio', error: error.message });
  }
});

// Get portfolio by unique URL (public route)
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

// Get user's portfolio
router.get('/my-portfolio', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user.id });

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching portfolio', error: error.message });
  }
});

// Update portfolio
router.put('/update', auth, async (req, res) => {
  try {
    const {
      name,
      about,
      profileImage,
      education,
      skills,
      projects,
      achievements,
      experience,
      socialLinks,
      theme,
      animation
    } = req.body;

    const portfolio = await Portfolio.findOne({ userId: req.user.id });

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    if (name) portfolio.name = name;
    if (about) portfolio.about = about;
    if (profileImage) portfolio.profileImage = profileImage;
    if (skills) portfolio.skills = skills;
    if (projects) portfolio.projects = projects;
    if (achievements) portfolio.achievements = achievements;
    if (experience) portfolio.experience = experience;
    if (socialLinks) portfolio.socialLinks = socialLinks;
    if (theme) portfolio.theme = theme;
    if (animation) portfolio.animation = animation;
    portfolio.updatedAt = Date.now();

    await portfolio.save();

    res.json({ message: 'Portfolio updated successfully', portfolio });
  } catch (error) {
    res.status(500).json({ message: 'Error updating portfolio', error: error.message });
  }
});

// Publish portfolio
router.post('/publish', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user.id });

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    portfolio.isPublished = true;
    await portfolio.save();

    res.json({
      message: 'Portfolio published successfully',
      portfolioUrl: `${process.env.FRONTEND_URL}/p/${portfolio.uniqueUrl}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Error publishing portfolio', error: error.message });
  }
});

// Unpublish portfolio
router.post('/unpublish', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user.id });

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    portfolio.isPublished = false;
    await portfolio.save();

    res.json({ message: 'Portfolio unpublished successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error unpublishing portfolio', error: error.message });
  }
});

// Delete portfolio
router.delete('/delete', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndDelete({ userId: req.user.id });

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    res.json({ message: 'Portfolio deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting portfolio', error: error.message });
  }
});

// Preview portfolio (temporary, not saved)
router.post('/preview', auth, async (req, res) => {
  try {
    const portfolioData = req.body;
    res.json({
      message: 'Preview data received',
      data: portfolioData
    });
  } catch (error) {
    res.status(500).json({ message: 'Error previewing portfolio', error: error.message });
  }
});

module.exports = router;
