import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, Globe, User, Sliders } from 'lucide-react';
import { VoiceSettings, User as UserType } from '../types';

interface SettingsScreenProps {
  onBack: () => void;
  voiceSettings: VoiceSettings;
  onVoiceSettingsChange: (settings: VoiceSettings) => void;
  user: UserType;
  onUserChange: (user: UserType) => void;
}

const languages = [
  { code: 'en-US', name: 'English (US)', native: 'English' },
  { code: 'hi-IN', name: 'Hindi', native: 'हिन्दी' },
  { code: 'mr-IN', name: 'Marathi', native: 'मराठी' },
  { code: 'gu-IN', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'ta-IN', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te-IN', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn-IN', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml-IN', name: 'Malayalam', native: 'മലയാളം' },
];

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  voiceSettings,
  onVoiceSettingsChange,
  user,
  onUserChange
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'voice' | 'language'>('profile');

  const testVoice = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('Hello! This is how I sound.');
      utterance.rate = voiceSettings.rate;
      utterance.pitch = voiceSettings.pitch;
      speechSynthesis.speak(utterance);
    }
  };

  return (
      return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between border-b border-gray-200">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={24} />
        </button>
        
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-600 text-sm">Customize your experience</p>
        </div>
        
        <div className="w-10"></div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'voice', label: 'Voice', icon: Volume2 },
            { id: 'language', label: 'Language', icon: Globe }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-colors ${
                activeTab === id
                  ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-md mx-auto"
        >
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-lg">
                <h3 className="text-gray-800 font-bold text-lg mb-4">Your Profile</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={user.name}
                      onChange={(e) => onUserChange({ ...user, name: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      min="6"
                      max="16"
                      value={user.age}
                      onChange={(e) => onUserChange({ ...user, age: parseInt(e.target.value) || 6 })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'voice' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-800 font-bold text-lg">Voice Settings</h3>
                  <button
                    onClick={testVoice}
                    className="p-2 bg-primary-100 hover:bg-primary-200 rounded-full transition-colors"
                  >
                    <Volume2 className="text-primary-600" size={20} />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Speech Rate: {voiceSettings.rate}x
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={voiceSettings.rate}
                      onChange={(e) => onVoiceSettingsChange({
                        ...voiceSettings,
                        rate: parseFloat(e.target.value)
                      })}
                      className="w-full accent-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Pitch: {voiceSettings.pitch}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={voiceSettings.pitch}
                      onChange={(e) => onVoiceSettingsChange({
                        ...voiceSettings,
                        pitch: parseFloat(e.target.value)
                      })}
                      className="w-full accent-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'language' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-lg">
                <h3 className="text-gray-800 font-bold text-lg mb-4">Native Language</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Choose your native language for translations
                </p>
                
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => onUserChange({ ...user, nativeLanguage: lang.code })}
                      className={`w-full text-left p-3 rounded-xl transition-colors ${
                        user.nativeLanguage === lang.code
                          ? 'bg-primary-100 text-primary-800 border border-primary-300'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{lang.name}</span>
                        <span className="text-sm opacity-70">{lang.native}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsScreen;