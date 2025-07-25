import { RoleplayScenario } from '../types';

export const roleplayScenarios: RoleplayScenario[] = [
  {
    id: 'school',
    title: 'At School',
    description: 'Practice conversations with teachers and classmates',
    emoji: '🏫',
    difficulty: 'beginner',
    prompts: [
      {
        id: '1',
        aiMessage: "Good morning! What's your name?",
        expectedResponse: 'My name is...',
        hints: ['Say your name', 'Be polite']
      },
      {
        id: '2',
        aiMessage: "Hi! Do you like school?",
        expectedResponse: 'Yes, I like school / No, I don\'t like school',
        hints: ['Say yes or no', 'Give a reason why']
      },
      {
        id: '3',
        aiMessage: "What's your favorite subject?",
        expectedResponse: 'My favorite subject is...',
        hints: ['Math', 'English', 'Science', 'Art']
      }
    ]
  },
  {
    id: 'store',
    title: 'At the Store',
    description: 'Learn to shop and ask for things politely',
    emoji: '🛒',
    difficulty: 'beginner',
    prompts: [
      {
        id: '1',
        aiMessage: "Welcome to our store! What would you like to buy today?",
        expectedResponse: 'I want to buy...',
        hints: ['Be polite', 'Say what you need']
      },
      {
        id: '2',
        aiMessage: "How many do you need?",
        expectedResponse: 'I need... / I want...',
        hints: ['Use numbers', 'One', 'Two', 'Three']
      },
      {
        id: '3',
        aiMessage: "That will be 50 rupees. Here's your change!",
        expectedResponse: 'Thank you!',
        hints: ['Always say thank you', 'Be polite']
      }
    ]
  },
  {
    id: 'home',
    title: 'At Home',
    description: 'Talk about family and daily activities',
    emoji: '🏠',
    difficulty: 'beginner',
    prompts: [
      {
        id: '1',
        aiMessage: "Who do you live with at home?",
        expectedResponse: 'I live with my...',
        hints: ['Family members', 'Parents', 'Siblings']
      },
      {
        id: '2',
        aiMessage: "Do you help your parents with housework?",
        expectedResponse: 'Yes, I help... / No, I don\'t help...',
        hints: ['Cleaning', 'Cooking', 'Be honest']
      },
      {
        id: '3',
        aiMessage: "What do you like to do at home?",
        expectedResponse: 'I like to...',
        hints: ['Play games', 'Read books', 'Watch TV']
      }
    ]
  },
  {
    id: 'restaurant',
    title: 'At a Restaurant',
    description: 'Order food and drinks politely',
    emoji: '🍽️',
    difficulty: 'intermediate',
    prompts: [
      {
        id: '1',
        aiMessage: "Good evening! Welcome to our restaurant. What would you like to order?",
        expectedResponse: 'I would like...',
        hints: ['Be polite', 'Say what food you want']
      },
      {
        id: '2',
        aiMessage: "Would you like something to drink with that?",
        expectedResponse: 'Yes, I\'ll have... / No, thank you',
        hints: ['Water', 'Juice', 'It\'s okay to say no']
      }
    ]
  }
];