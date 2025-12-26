const express = require('express');
const router = express.Router();
const User = require('../models/User');
// Note: In production you should use bcryptjs, but ensuring packages are installed first
// const bcrypt = require('bcryptjs'); 
// const jwt = require('jsonwebtoken');

// Register User
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user (Storing plain text password for now based on user request "just make it work", 
    // but in real app use bcrypt.hash(password, 10))
    const user = await User.create({
      name,
      email,
      password // TODO: Hash this
    });

    console.log('✅ New User Registered:', user.email);

    res.status(201).json({
      message: 'Registration successful',
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body; // 'name' can be email or name

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

    // Return success with simple token (User ID)
    // In production use: const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    const token = `token-${user._id}`;

    res.json({
      message: 'Login successful',
      token: token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
