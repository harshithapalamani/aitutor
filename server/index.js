const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock OpenAI responses for development
const generateChatResponse = (message, history = []) => {
  const responses = [
    "That's a great question! Let me help you understand that better. 😊",
    "Wonderful! You're doing so well with your English practice! 🌟",
    "I love how curious you are! Learning English is exciting, isn't it? 🎉",
    "That's perfect! Keep practicing and you'll become even better! 💪",
    "Amazing work! Your English is improving every day! 🚀",
  ];

  // Simple response based on message content
  if (message.toLowerCase().includes('noun')) {
    return "A noun is a word that names a person, place, or thing! For example: 'cat', 'school', or 'happiness'. Can you think of a noun? 🤔";
  }
  
  if (message.toLowerCase().includes('verb')) {
    return "A verb is an action word! It tells us what someone or something does. Like 'run', 'jump', or 'sing'. What's your favorite action to do? 🏃‍♂️";
  }

  if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
    return "Hello there! It's wonderful to meet you! I'm so excited to help you learn English today! What would you like to explore? 👋✨";
  }

  // Return a random encouraging response
  return responses[Math.floor(Math.random() * responses.length)];
};

const generateRoleplayResponse = (scenario, message, history = []) => {
  const scenarioResponses = {
    school: [
      "That's wonderful! What's your favorite subject in school? 📚",
      "Great! Do you have many friends at school? 👫",
      "Excellent! Learning is so much fun, isn't it? 🎓",
    ],
    store: [
      "Perfect! That costs 10 rupees. Do you have the money? 💰",
      "Great choice! Would you like anything else? 🛒",
      "Wonderful! Here's your item. Have a great day! 😊",
    ],
    home: [
      "That sounds lovely! What's your favorite thing to do with your family? 👨‍👩‍👧‍👦",
      "Wonderful! Helping at home is very important! 🏠",
      "Great! Family time is the best time, isn't it? ❤️",
    ],
    restaurant: [
      "Excellent choice! That will be ready in 10 minutes. 🍽️",
      "Perfect! Would you like anything else to drink? 🥤",
      "Great! Your food is coming right up! 😋",
    ]
  };

  const responses = scenarioResponses[scenario.id] || scenarioResponses.school;
  return responses[Math.floor(Math.random() * responses.length)];
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SpeakGenie API is running!' });
});

app.post('/api/chat', (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = generateChatResponse(message, history);
    
    res.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/roleplay', (req, res) => {
  try {
    const { scenario, message, history } = req.body;
    
    if (!scenario || !message) {
      return res.status(400).json({ error: 'Scenario and message are required' });
    }

    const response = generateRoleplayResponse(scenario, message, history);
    
    res.json({ response });
  } catch (error) {
    console.error('Roleplay API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/translate', (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    
    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'Text and target language are required' });
    }

    // Mock translation - in production, use Google Translate API or similar
    const translations = {
      'hi-IN': {
        'Hello': 'नमस्ते',
        'Thank you': 'धन्यवाद',
        'Good morning': 'सुप्रभात',
        'How are you?': 'आप कैसे हैं?'
      },
      'mr-IN': {
        'Hello': 'नमस्कार',
        'Thank you': 'धन्यवाद',
        'Good morning': 'सुप्रभात',
        'How are you?': 'तुम्ही कसे आहात?'
      }
    };

    const translation = translations[targetLanguage]?.[text] || text;
    
    res.json({ translation });
  } catch (error) {
    console.error('Translation API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🧞‍♂️ SpeakGenie API server running on port ${PORT}`);
  console.log(`🌟 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;