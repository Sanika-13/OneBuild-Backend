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
  theme: {
    type: String,
    enum: ['dark', 'minimalist', 'modern'],
    default: 'minimalist'
  },
  resumeData: {
    name: String,
    email: String,
    phone: String,
    bio: String,
    education: [{
      degree: String,
      institution: String,
      year: String,
      score: String
    }],
    experience: [{
      title: String,
      company: String,
      duration: String,
      description: String
    }],
    skills: [String],
    projects: [{
      name: String,
      description: String,
      technologies: [String],
      link: String
    }],
    achievements: [String]
  },
  socialLinks: {
    github: String,
    linkedin: String,
    instagram: String,
    whatsapp: String,
    other: String
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
