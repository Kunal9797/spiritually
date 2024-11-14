const mongoose = require('mongoose');
const Philosophy = require('../models/Philosophy');
const Religion = require('../models/Religion');
const Astrology = require('../models/Astrology');
require('dotenv').config();

// Data from your knowledge.js
const data = {
    philosophies: [
        {
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
            name: "Buddhism",
            description: "Path to enlightenment through meditation",
            practices: ["Meditation", "Mindfulness", "Compassion"],
            keyBeliefs: ["Four Noble Truths", "Eightfold Path"]
        },
        {
            name: "Hinduism",
            description: "Ancient Indian spiritual tradition",
            practices: ["Yoga", "Meditation", "Rituals"],
            keyBeliefs: ["Dharma", "Karma", "Reincarnation"]
        }
    ],
    astrologicalSystems: [
        {
            name: "Vedic Astrology",
            description: "Traditional Indian astrological system",
            elements: ["Houses", "Planets", "Nakshatras"],
            keyPrinciples: ["Karma", "Planetary Periods"]
        },
        {
            name: "Western Astrology",
            description: "Modern Western zodiac system",
            elements: ["Houses", "Planets", "Signs"],
            keyPrinciples: ["Sun Sign", "Rising Sign", "Moon Sign"]
        }
    ]
};

async function migrateData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Promise.all([
            Philosophy.deleteMany({}),
            Religion.deleteMany({}),
            Astrology.deleteMany({})
        ]);
        console.log('Cleared existing data');

        // Insert new data
        await Promise.all([
            Philosophy.insertMany(data.philosophies.map(p => ({
                ...p,
                keywords: [...p.keyPrinciples, ...p.practices],
                enhancedContent: {
                    personalInsights: `Deep insights into ${p.name}'s practical applications in modern life.`,
                    practicalApplications: p.practices,
                    modernInterpretations: `Contemporary interpretation of ${p.name}'s principles.`,
                    recommendedReadings: [`Essential readings for ${p.name}`]
                }
            }))),
            Religion.insertMany(data.religions.map(r => ({
                ...r,
                keywords: [...r.keyBeliefs, ...r.practices]
            }))),
            Astrology.insertMany(data.astrologicalSystems.map(a => ({
                ...a,
                keywords: [...a.elements, ...a.keyPrinciples]
            })))
        ]);

        console.log('Data migration completed successfully');
    } catch (error) {
        console.error('Migration error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
        process.exit();
    }
}

migrateData();