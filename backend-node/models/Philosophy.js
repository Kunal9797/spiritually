const mongoose = require('mongoose');

const philosophySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    traditions: [String],
    keyPrinciples: [String],
    practices: [String],
    texts: [{
        title: String,
        content: String,
        author: String,
        period: String
    }],
    keywords: [String],
    enhancedContent: {
        personalInsights: String,
        practicalApplications: [String],
        modernInterpretations: String,
        recommendedReadings: [String]
    }
}, {
    timestamps: true
});

// Add text search indexes
philosophySchema.index({ 
    name: 'text', 
    description: 'text', 
    'texts.content': 'text' 
});

module.exports = mongoose.model('Philosophy', philosophySchema);