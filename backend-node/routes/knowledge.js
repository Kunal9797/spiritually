const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
require('dotenv').config();

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
// Sample data (later we can move this to MongoDB)
const data = {
    philosophies: [
        {
            id: 1,
            name: "Stoicism",
            description: "Ancient Greek philosophy emphasizing virtue, reason, and living in harmony with nature",
            traditions: ["Roman Stoicism", "Greek Stoicism"],
            keyPrinciples: [
                "Focus on what you can control",
                "Live according to nature",
                "Practice self-discipline",
                "Cultivate wisdom, justice, courage, and moderation",
                "Accept what cannot be changed"
            ],
            practices: [
                "Daily meditation",
                "Journaling",
                "Negative visualization",
                "Self-reflection"
            ]
        },
        {
            id: 2,
            name: "Zen Buddhism",
            description: "A Mahayana Buddhist tradition emphasizing direct insight through meditation",
            traditions: ["Sōtō", "Rinzai", "Ōbaku"],
            keyPrinciples: [
                "Direct experience of reality",
                "Mindfulness",
                "Non-attachment",
                "Present moment awareness",
                "Emptiness (Śūnyatā)"
            ],
            practices: [
                "Zazen meditation",
                "Koan study",
                "Mindful daily activities",
                "Tea ceremony"
            ]
        },
        {
            id: 3,
            name: "Existentialism",
            description: "Philosophy focusing on the human condition and individual existence",
            traditions: ["French Existentialism", "Religious Existentialism"],
            keyPrinciples: [
                "Existence precedes essence",
                "Freedom of choice",
                "Personal responsibility",
                "Authenticity",
                "Confronting the absurd"
            ],
            practices: [
                "Self-reflection",
                "Authentic living",
                "Embracing uncertainty",
                "Creating personal meaning"
            ]
        },
        {
            id: 4,
            name: "Taoism",
            description: "Chinese philosophy emphasizing living in harmony with the Tao (Way)",
            traditions: ["Philosophical Taoism", "Religious Taoism"],
            keyPrinciples: [
                "Wu Wei (non-action)",
                "Balance of Yin and Yang",
                "Living in harmony with nature",
                "Simplicity and spontaneity",
                "The Tao as the source"
            ],
            practices: [
                "Tai Chi",
                "Qigong",
                "Meditation",
                "Living simply"
            ]
        },
        {
            id: 5,
            name: "Vedanta",
            description: "Indian philosophical tradition focusing on self-realization and the nature of consciousness",
            traditions: ["Advaita Vedanta", "Dvaita Vedanta", "Vishishtadvaita"],
            keyPrinciples: [
                "Brahman as ultimate reality",
                "Atman (true self)",
                "Maya (illusion)",
                "Unity of existence",
                "Self-knowledge"
            ],
            practices: [
                "Meditation",
                "Self-inquiry",
                "Study of sacred texts",
                "Yoga"
            ]
        }
    ],

    religions: [
        {
            id: 1,
            name: "Buddhism",
            description: "Path to enlightenment through meditation",
            practices: ["Meditation", "Mindfulness", "Compassion"],
            keyBeliefs: ["Four Noble Truths", "Eightfold Path"]
        },
        {
            id: 2,
            name: "Hinduism",
            description: "Ancient Indian spiritual tradition",
            practices: ["Yoga", "Meditation", "Rituals"],
            keyBeliefs: ["Dharma", "Karma", "Reincarnation"]
        }
    ],
    astrologicalSystems: [
        {
            id: 1,
            name: "Vedic Astrology",
            description: "Traditional Indian astrological system",
            elements: ["Houses", "Planets", "Nakshatras"],
            keyPrinciples: ["Karma", "Planetary Periods"]
        },
        {
            id: 2,
            name: "Western Astrology",
            description: "Modern Western zodiac system",
            elements: ["Houses", "Planets", "Signs"],
            keyPrinciples: ["Sun Sign", "Rising Sign", "Moon Sign"]
        }
    ]
};

// Get all data
router.get('/', (req, res) => {
    res.json(data);
});

// Get philosophies
router.get('/philosophies', (req, res) => {
    res.json(data.philosophies);
});

// Get religions
router.get('/religions', (req, res) => {
    res.json(data.religions);
});

// Get astrological systems
router.get('/astrological-systems', (req, res) => {
    res.json(data.astrologicalSystems);
});

// Search across all categories
router.get('/search', (req, res) => {
    const query = req.query.query.toLowerCase();
    
    const filteredData = {
        philosophies: data.philosophies.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.description.toLowerCase().includes(query)
        ),
        religions: data.religions.filter(r => 
            r.name.toLowerCase().includes(query) || 
            r.description.toLowerCase().includes(query)
        ),
        astrologicalSystems: data.astrologicalSystems.filter(a => 
            a.name.toLowerCase().includes(query) || 
            a.description.toLowerCase().includes(query)
        )
    };
    
    res.json(filteredData);
});

router.post('/chat/:type/:id', async (req, res) => {
    try {
        const { type, id } = req.params;
        const { message } = req.body;
        
        console.log('Received chat request:', {
            type,
            id,
            message
        });

        // Find the tradition
        let tradition;
        switch(type) {
            case 'philosophy':
                tradition = data.philosophies.find(p => p.id === parseInt(id));
                break;
            case 'religion':
                tradition = data.religions.find(r => r.id === parseInt(id));
                break;
            case 'astrology':
                tradition = data.astrologicalSystems.find(a => a.id === parseInt(id));
                break;
            default:
                return res.status(400).json({ error: 'Invalid tradition type' });
        }

        if (!tradition) {
            return res.status(404).json({ error: 'Tradition not found' });
        }

        // Create context based on tradition type
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

        console.log('Sending to OpenAI with context:', context);

        // Get response from OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: context
                },
                {
                    role: "user",
                    content: message
                }
            ],
            temperature: 0.7,
            max_tokens: 500
        });

        console.log('Received OpenAI response:', completion.choices[0].message);

        res.json({
            role: 'assistant',
            content: completion.choices[0].message.content
        });

    } catch (error) {
        console.error('Chat error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to get response: ' + (error.message || 'Unknown error') });
    }
});

// Existing routes remain the same...


module.exports = router;