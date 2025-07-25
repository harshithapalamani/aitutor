import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import VoiceChatPage from './pages/VoiceChatPage';
import RoleplaySelectionPage from './pages/RoleplaySelectionPage';
import RoleplayScenarioPage from './pages/RoleplayScenarioPage';
import SettingsPage from './pages/SettingsPage';
import { VoiceSettings, User } from './types';

function App() {
  const [user, setUser] = useState<User>({
    name: '',
    age: 10,
    nativeLanguage: 'hi-IN'
  });
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    language: 'en-US',
    voice: '',
    rate: 1.0,
    pitch: 1.0
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('speakgenie-user');
    const savedVoiceSettings = localStorage.getItem('speakgenie-voice-settings');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedVoiceSettings) {
      setVoiceSettings(JSON.parse(savedVoiceSettings));
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('speakgenie-user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('speakgenie-voice-settings', JSON.stringify(voiceSettings));
  }, [voiceSettings]);

  return (
    <div className="app">
      <Routes>
        <Route 
          path="/" 
          element={
            <WelcomePage userName={user.name} />
          } 
        />
        <Route 
          path="/chat" 
          element={
            <VoiceChatPage
              voiceSettings={voiceSettings}
              nativeLanguage={user.nativeLanguage}
            />
          } 
        />
        <Route 
          path="/roleplay" 
          element={
            <RoleplaySelectionPage />
          } 
        />
        <Route 
          path="/roleplay/:scenarioId" 
          element={
            <RoleplayScenarioPage
              voiceSettings={voiceSettings}
            />
          } 
        />
        <Route 
          path="/settings" 
          element={
            <SettingsPage
              voiceSettings={voiceSettings}
              onVoiceSettingsChange={setVoiceSettings}
              user={user}
              onUserChange={setUser}
            />
          } 
        />
      </Routes>
    </div>
  );
}

export default App;