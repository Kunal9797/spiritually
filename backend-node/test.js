const OpenAI = require('openai');
require('dotenv').config();

// Initialize OpenAI with your API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const testOpenAI = async () => {
    try {
        console.log('Testing OpenAI connection...');
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "Hello, how are you?" }
            ],
            temperature: 0.7,
            max_tokens: 50
        });
        console.log('OpenAI Response:', response.choices[0].message.content);
    } catch (error) {
        console.error('Test error:', error.response ? error.response.data : error.message);
    }
};

// Run the test
console.log('Starting test...');
testOpenAI();