const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const { adminAuth } = require('../middleware/auth');

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Delete user
router.delete('/users/:userId', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

    // Delete user's portfolio
    await Portfolio.findOneAndDelete({ userId: req.params.userId });
    
    // Delete user
    await User.findByIdAndDelete(req.params.userId);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

// Get analytics
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalPortfolios = await Portfolio.countDocuments();
    const publishedPortfolios = await Portfolio.countDocuments({ isPublished: true });
    
    // Theme distribution
    const themeStats = await Portfolio.aggregate([
      {
        $group: {
          _id: '$theme',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent portfolios
    const recentPortfolios = await Portfolio.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name email');

    res.json({
      totalUsers,
      totalPortfolios,
      publishedPortfolios,
      unpublishedPortfolios: totalPortfolios - publishedPortfolios,
      themeDistribution: themeStats,
      recentPortfolios
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
});

// Get all portfolios
router.get('/portfolios', adminAuth, async (req, res) => {
  try {
    const portfolios = await Portfolio.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(portfolios);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching portfolios', error: error.message });
  }
});

// Delete portfolio (admin)
router.delete('/portfolios/:portfolioId', adminAuth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findByIdAndDelete(req.params.portfolioId);
    
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    res.json({ message: 'Portfolio deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting portfolio', error: error.message });
  }
});

module.exports = router;
