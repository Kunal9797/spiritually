const mongoose = require('mongoose');

const religionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    practices: [String],
    keyBeliefs: [String],
    sacredTexts: [{
        title: String,
        content: String,
        language: String,
        period: String
    }],
    keywords: [String]
}, {
    timestamps: true
});

religionSchema.index({ 
    name: 'text', 
    description: 'text', 
    'sacredTexts.content': 'text' 
});

module.exports = mongoose.model('Religion', religionSchema);