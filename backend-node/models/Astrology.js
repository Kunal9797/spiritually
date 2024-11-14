const mongoose = require('mongoose');

const astrologySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    elements: [String],
    keyPrinciples: [String],
    techniques: [{
        name: String,
        description: String,
        application: String
    }],
    keywords: [String]
}, {
    timestamps: true
});

astrologySchema.index({ 
    name: 'text', 
    description: 'text' 
});

module.exports = mongoose.model('Astrology', astrologySchema);