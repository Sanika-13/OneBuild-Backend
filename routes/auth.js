const express = require('express');
const router = express.Router();

// Register User
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if user already exists
  const userExists = global.mockDB.users.find(u => u.email === email);
  if (userExists) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Create new user
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password // In a real app, hash this password!
  };

  global.mockDB.users.push(newUser);
  console.log('✅ New User Registered:', newUser);

  res.status(201).json({ message: 'Registration successful', user: { id: newUser.id, name: newUser.name, email: newUser.email } });
});

// Login User
router.post('/login', (req, res) => {
  const { name, password } = req.body; // Accepting 'name' as username for simplicity, or email

  if (!name || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Find user by name (or email if you prefer)
  const user = global.mockDB.users.find(u => u.name === name || u.email === name);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  console.log('✅ User Logged In:', user.name);

  // Return success with a mock token
  res.json({
    message: 'Login successful',
    token: `mock-token-${user.id}`,
    user: { id: user.id, name: user.name, email: user.email }
  });
});

module.exports = router;
