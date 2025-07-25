export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  audioUrl?: string;
}

export interface RoleplayScenario {
  id: string;
  title: string;
  description: string;
  emoji: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prompts: RoleplayPrompt[];
}

export interface RoleplayPrompt {
  id: string;
  aiMessage: string;
  expectedResponse?: string;
  hints?: string[];
}

export interface VoiceSettings {
  language: string;
  voice: string;
  rate: number;
  pitch: number;
}

export interface User {
  name: string;
  age: number;
  nativeLanguage: string;
}

export type AppMode = 'welcome' | 'chat' | 'roleplay' | 'settings';
export type RecordingState = 'idle' | 'recording' | 'processing' | 'playing';