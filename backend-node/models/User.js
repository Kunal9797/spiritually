const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    birthDetails: {
        date: Date,
        time: String,
        place: String,
        timezone: String
    },
    preferences: {
        notificationFrequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly'],
            default: 'weekly'
        },
        interests: [{
            type: String,
            enum: ['astrology', 'philosophy', 'meditation', 'spirituality']
        }]
    },
    readingHistory: [{
        date: {
            type: Date,
            default: Date.now
        },
        questionType: String,
        question: String,
        answer: String,
        feedback: {
            helpful: Boolean,
            comments: String
        }
    }],
    profile: {
        firstName: String,
        lastName: String,
        avatar: String,
        bio: String
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);