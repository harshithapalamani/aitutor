import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Volume2, Globe, Save } from 'lucide-react';
import { VoiceSettings, User as UserType } from '../types';

interface SettingsPageProps {
  voiceSettings: VoiceSettings;
  onVoiceSettingsChange: (settings: VoiceSettings) => void;
  user: UserType;
  onUserChange: (user: UserType) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({
  voiceSettings,
  onVoiceSettingsChange,
  user,
  onUserChange
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'voice' | 'language'>('profile');
  const [tempUser, setTempUser] = useState(user);
  const [tempVoiceSettings, setTempVoiceSettings] = useState(voiceSettings);

  const handleSave = () => {
    onUserChange(tempUser);
    onVoiceSettingsChange(tempVoiceSettings);
    // Show success message or feedback
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between border-b border-gray-200">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-primary-600"
        >
          <ArrowLeft size={24} />
        </button>
        
        <h1 className="text-xl font-bold text-gray-800">Settings</h1>
        
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-full transition-colors"
        >
          <Save size={16} />
          <span className="text-sm font-medium">Save</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex">
          {[
            { key: 'profile', label: 'Profile', icon: User },
            { key: 'voice', label: 'Voice', icon: Volume2 },
            { key: 'language', label: 'Language', icon: Globe }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 transition-colors ${
                activeTab === key
                  ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-500'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{label}</span>
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
          className="max-w-2xl mx-auto"
        >
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={tempUser.name}
                      onChange={(e) => setTempUser({ ...tempUser, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age
                    </label>
                    <select
                      value={tempUser.age}
                      onChange={(e) => setTempUser({ ...tempUser, age: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    >
                      {Array.from({ length: 11 }, (_, i) => i + 6).map(age => (
                        <option key={age} value={age}>{age} years old</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'voice' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Voice Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Speech Rate
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={tempVoiceSettings.rate}
                      onChange={(e) => setTempVoiceSettings({ ...tempVoiceSettings, rate: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Slow</span>
                      <span>Normal</span>
                      <span>Fast</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pitch
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={tempVoiceSettings.pitch}
                      onChange={(e) => setTempVoiceSettings({ ...tempVoiceSettings, pitch: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Low</span>
                      <span>Normal</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'language' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Language Preferences</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Native Language
                    </label>
                    <select
                      value={tempUser.nativeLanguage}
                      onChange={(e) => setTempUser({ ...tempUser, nativeLanguage: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    >
                      <option value="hi-IN">Hindi</option>
                      <option value="mr-IN">Marathi</option>
                      <option value="bn-IN">Bengali</option>
                      <option value="ta-IN">Tamil</option>
                      <option value="te-IN">Telugu</option>
                      <option value="gu-IN">Gujarati</option>
                      <option value="kn-IN">Kannada</option>
                      <option value="ml-IN">Malayalam</option>
                      <option value="pa-IN">Punjabi</option>
                      <option value="or-IN">Odia</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Learning Language
                    </label>
                    <select
                      value={tempVoiceSettings.language}
                      onChange={(e) => setTempVoiceSettings({ ...tempVoiceSettings, language: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    >
                      <option value="en-US">English (US)</option>
                      <option value="en-GB">English (UK)</option>
                      <option value="en-AU">English (Australia)</option>
                      <option value="en-IN">English (India)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
