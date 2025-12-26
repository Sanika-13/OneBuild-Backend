const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uniqueUrl: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  about: {
    type: String,
    required: true
  },
  profileImage: {
    type: String
  },
  theme: {
    type: String,
    default: 'dark'
  },
  skills: [String],
  projects: [{
    name: String,
    description: String,
    technologies: String,
    link: String
  }],
  achievements: [String],
  experience: [{
    title: String,
    company: String,
    duration: String,
    description: String
  }],
  socialLinks: {
    email: String,
    phone: String,
    countryCode: String,
    github: String,
    linkedin: String,
    instagram: String
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
