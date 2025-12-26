const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');

// Get portfolio by unique URL
router.get('/:uniqueUrl', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ 
      uniqueUrl: req.params.uniqueUrl,
      isPublished: true 
    }).populate('userId', 'name email');

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found or not published' });
    }

    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching portfolio', error: error.message });
  }
});

module.exports = router;
