import { ChatMessage, RoleplayScenario } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  async sendChatMessage(message: string, conversationHistory: ChatMessage[]): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history: conversationHistory.slice(-10), // Send last 10 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Chat API error:', error);
      return "I'm sorry, I'm having trouble understanding right now. Can you try again?";
    }
  }

  async getRoleplayResponse(
    scenario: RoleplayScenario,
    userMessage: string,
    conversationHistory: ChatMessage[]
  ): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/roleplay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenario,
          message: userMessage,
          history: conversationHistory.slice(-5),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get roleplay response');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Roleplay API error:', error);
      return "Let's try that again! What would you like to say?";
    }
  }

  async translateToNativeLanguage(text: string, targetLanguage: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          targetLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      return data.translation;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text if translation fails
    }
  }
}

export const apiService = new ApiService();