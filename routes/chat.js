const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyD9YVOTk6HZhgbqpY5N4G_SGmgcZHLhYeU');

// POST /api/chat - Chat with portfolio AI
router.post('/', async (req, res) => {
    try {
        const { message, portfolioData } = req.body;

        if (!message || !portfolioData) {
            return res.status(400).json({ error: 'Message and portfolio data are required' });
        }

        // Create context from portfolio data
        const context = `
You are an AI assistant for ${portfolioData.name}'s portfolio website.

About ${portfolioData.name}:
${portfolioData.about || 'No description available'}

Skills: ${portfolioData.skills?.join(', ') || 'Not specified'}

Projects:
${portfolioData.projects?.map(p => `- ${p.name}: ${p.description} (Technologies: ${p.technologies})`).join('\n') || 'No projects listed'}

Experience:
${portfolioData.experience?.map(e => `- ${e.title} at ${e.company} (${e.duration}): ${e.description}`).join('\n') || 'No experience listed'}

Achievements:
${portfolioData.achievements?.map(a => typeof a === 'string' ? `- ${a}` : `- ${a.title}`).join('\n') || 'No achievements listed'}

Social Links:
- Email: ${portfolioData.socialLinks?.email || 'Not provided'}
- GitHub: ${portfolioData.socialLinks?.github || 'Not provided'}
- LinkedIn: ${portfolioData.socialLinks?.linkedin || 'Not provided'}

Instructions:
- Answer questions about ${portfolioData.name} professionally and concisely
- Use the information provided above
- Be friendly and helpful
- Keep responses under 100 words
- If asked about something not in the data, politely say you don't have that information
`;

        // Get AI model - using gemini-pro (stable model)
        const model = genAI.getGenerativeModel({ model: 'models/gemini-pro' });

        // Generate response
        const result = await model.generateContent(context + '\n\nQuestion: ' + message);
        const response = await result.response;
        const reply = response.text();

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

