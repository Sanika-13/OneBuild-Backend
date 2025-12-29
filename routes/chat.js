const express = require('express');
const router = express.Router();

// Mock AI Response Generator (for demo)
function generateMockResponse(message, portfolioData) {
    const msg = message.toLowerCase();

    // Skills question
    if (msg.includes('skill') || msg.includes('technology') || msg.includes('tech')) {
        const skills = portfolioData.skills?.join(', ') || 'various technologies';
        return `${portfolioData.name} is proficient in ${skills}. They have hands-on experience with these technologies across multiple projects!`;
    }

    // Projects question
    if (msg.includes('project')) {
        if (portfolioData.projects && portfolioData.projects.length > 0) {
            const bestProject = portfolioData.projects[0];
            return `${portfolioData.name}'s standout project is "${bestProject.name}" - ${bestProject.description}. It was built using ${bestProject.technologies}.`;
        }
        return `${portfolioData.name} has worked on several impressive projects showcasing their technical skills!`;
    }

    // Experience question
    if (msg.includes('experience') || msg.includes('work')) {
        if (portfolioData.experience && portfolioData.experience.length > 0) {
            const exp = portfolioData.experience[0];
            return `${portfolioData.name} has ${exp.duration} of experience as ${exp.title} at ${exp.company}, where they ${exp.description}`;
        }
        return `${portfolioData.name} has valuable professional experience in software development.`;
    }

    // About/Background question
    if (msg.includes('about') || msg.includes('who') || msg.includes('background')) {
        return portfolioData.about || `${portfolioData.name} is a skilled developer with expertise in modern web technologies.`;
    }

    // Contact question
    if (msg.includes('contact') || msg.includes('email') || msg.includes('reach')) {
        const email = portfolioData.socialLinks?.email || 'their email';
        return `You can reach ${portfolioData.name} at ${email}. They're also available on GitHub and LinkedIn!`;
    }

    // Achievements question
    if (msg.includes('achievement') || msg.includes('award')) {
        if (portfolioData.achievements && portfolioData.achievements.length > 0) {
            const achievementsList = portfolioData.achievements.slice(0, 2).map(a =>
                typeof a === 'string' ? a : (a.title || a.name || 'Achievement')
            ).join(', ');
            return `${portfolioData.name} has achieved: ${achievementsList}`;
        }
        return `${portfolioData.name} has several notable achievements in their career!`;
    }

    // Default response
    return `${portfolioData.name} is a talented developer with strong skills in ${portfolioData.skills?.slice(0, 3).join(', ') || 'web development'}. Feel free to ask about their skills, projects, or experience!`;
}

// POST /api/chat - Chat with portfolio AI
router.post('/', async (req, res) => {
    try {
        const { message, portfolioData } = req.body;

        if (!message || !portfolioData) {
            return res.status(400).json({ error: 'Message and portfolio data are required' });
        }

        // Generate mock response for demo
        const reply = generateMockResponse(message, portfolioData);

        // Simulate AI delay for realistic feel
        await new Promise(resolve => setTimeout(resolve, 800));

        res.json({ reply });

    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({
            error: 'Failed to generate response',
            reply: 'Sorry, I encountered an error. Please try again later.'
        });
    }
});

module.exports = router;

