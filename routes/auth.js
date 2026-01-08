const express = require('express');
const router = express.Router();

// Try to load User model, but don't fail if MongoDB is not connected
let User;
try {
  User = require('../models/User');
} catch (error) {
  console.warn('⚠️  User model not loaded - MongoDB may not be available');
}

// Register User
router.post('/register', async (req, res) => {
  try {
    if (!User) {
      return res.status(503).json({ error: 'Database not available. Please try again later.' });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password
    });

    console.log('✅ New User Registered:', user.email);

    res.status(201).json({
      message: 'Registration successful',
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    if (!User) {
      return res.status(503).json({ error: 'Database not available. Please try again later.' });
    }

    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Find user by email or name
    const user = await User.findOne({
      $or: [{ email: name }, { name: name }]
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('✅ User Logged In:', user.name);

    const token = `token-${user._id}`;

    res.json({
      message: 'Login successful',
      token: token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

module.exports = router;
