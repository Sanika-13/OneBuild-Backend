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
  resume: String,
  stats: {
    yearsOfExperience: String,
    projectsCompleted: String,
    internshipsCompleted: String,
    totalSkills: String
  },
  skills: [String],
  projects: [{
    name: String,
    description: String,
    technologies: String,
    link: String,
    image: String
  }],
  achievements: [{
    title: String,
    image: String
  }],
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
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
