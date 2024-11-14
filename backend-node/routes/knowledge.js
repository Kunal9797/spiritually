const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const Philosophy = require('../models/Philosophy');
const Religion = require('../models/Religion');
const Astrology = require('../models/Astrology');
require('dotenv').config();

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Get all data
router.get('/', async (req, res) => {
    try {
        const [philosophies, religions, astrologicalSystems] = await Promise.all([
            Philosophy.find(),
            Religion.find(),
            Astrology.find()
        ]);
        
        res.json({
            philosophies,
            religions,
            astrologicalSystems
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get philosophies
router.get('/philosophies', async (req, res) => {
    try {
        const philosophies = await Philosophy.find();
        res.json(philosophies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get religions
router.get('/religions', async (req, res) => {
    try {
        const religions = await Religion.find();
        res.json(religions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get astrological systems
router.get('/astrological-systems', async (req, res) => {
    try {
        const astrologicalSystems = await Astrology.find();
        res.json(astrologicalSystems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search across all categories
router.get('/search', async (req, res) => {
    try {
        const query = req.query.query;
        
        const [philosophies, religions, astrologicalSystems] = await Promise.all([
            Philosophy.find({ $text: { $search: query } }),
            Religion.find({ $text: { $search: query } }),
            Astrology.find({ $text: { $search: query } })
        ]);
        
        res.json({
            philosophies,
            religions,
            astrologicalSystems
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Chat endpoint
router.post('/chat/:type/:id', async (req, res) => {
    try {
        const { type, id } = req.params;
        const { message } = req.body;
        
        // Find the tradition based on type
        let tradition;
        switch(type) {
            case 'philosophy':
                tradition = await Philosophy.findById(id);
                break;
            case 'religion':
                tradition = await Religion.findById(id);
                break;
            case 'astrology':
                tradition = await Astrology.findById(id);
                break;
            default:
                return res.status(400).json({ error: 'Invalid tradition type' });
        }

        if (!tradition) {
            return res.status(404).json({ error: 'Tradition not found' });
        }

        // Create context
        let context = `You are a wise teacher representing ${tradition.name}. 
            Provide guidance and insights based on this tradition's principles.
            
            About ${tradition.name}:
            ${tradition.description}
            
            Key aspects:`;

        if (tradition.keyPrinciples) {
            context += `\nKey Principles: ${tradition.keyPrinciples.join(', ')}`;
        }
        if (tradition.practices) {
            context += `\nPractices: ${tradition.practices.join(', ')}`;
        }
        if (tradition.elements) {
            context += `\nElements: ${tradition.elements.join(', ')}`;
        }
        if (tradition.traditions) {
            context += `\nTraditions: ${tradition.traditions.join(', ')}`;
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: context },
                { role: "user", content: message }
            ],
            temperature: 0.7,
            max_tokens: 500
        });

        res.json({
            role: 'assistant',
            content: completion.choices[0].message.content
        });

    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to get response: ' + (error.message || 'Unknown error') });
    }
});

// Add these new routes for getting single items by ID
router.get('/philosophies/:id', async (req, res) => {
    try {
        const philosophy = await Philosophy.findById(req.params.id);
        if (!philosophy) {
            return res.status(404).json({ error: 'Philosophy not found' });
        }
        res.json(philosophy);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/religions/:id', async (req, res) => {
    try {
        const religion = await Religion.findById(req.params.id);
        if (!religion) {
            return res.status(404).json({ error: 'Religion not found' });
        }
        res.json(religion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/astrological-systems/:id', async (req, res) => {
    try {
        const astrology = await Astrology.findById(req.params.id);
        if (!astrology) {
            return res.status(404).json({ error: 'Astrological system not found' });
        }
        res.json(astrology);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;