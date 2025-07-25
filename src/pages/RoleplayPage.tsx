import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Trophy, Volume2, Mic, MicOff } from 'lucide-react';
import { RoleplayScenario, ChatMessage, RecordingState, VoiceSettings } from '../types';
import { roleplayScenarios } from '../data/roleplayScenarios';
import { speechService } from '../services/speechService';
import { apiService } from '../services/apiService';

interface RoleplayPageProps {
  voiceSettings: VoiceSettings;
}

const RoleplayPage: React.FC<RoleplayPageProps> = ({ voiceSettings }) => {
  const navigate = useNavigate();
  const [selectedScenario, setSelectedScenario] = useState<RoleplayScenario | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (selectedScenario && messages.length === 0) {
      startRoleplay();
    }
  }, [selectedScenario]);

  const startRoleplay = async () => {
    if (!selectedScenario) return;

    const firstPrompt = selectedScenario.prompts[0];
    const welcomeMessage: ChatMessage = {
      id: '1',
      text: firstPrompt.aiMessage,
      isUser: false,
      timestamp: new Date()
    };

    setMessages([welcomeMessage]);
    await speakMessage(firstPrompt.aiMessage);
  };

  const handleScenarioSelect = (scenario: RoleplayScenario) => {
    setSelectedScenario(scenario);
    setMessages([]);
    setCurrentPromptIndex(0);
    setScore(0);
  };

  const resetRoleplay = () => {
    setSelectedScenario(null);
    setMessages([]);
    setCurrentPromptIndex(0);
    setScore(0);
  };

  const startRecording = async () => {
    if (!speechService.isSupported()) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    try {
      setRecordingState('recording');
      const transcript = await speechService.startListening();
      
      if (transcript.trim()) {
        setRecordingState('processing');
        await handleUserResponse(transcript);
      }
    } catch (error) {
      console.error('Recording error:', error);
      alert('Sorry, I couldn\'t hear you clearly. Please try again!');
    } finally {
      setRecordingState('idle');
    }
  };

  const handleUserResponse = async (text: string) => {
    if (!selectedScenario) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const aiResponse = await apiService.sendRoleplayMessage(selectedScenario, text, messages);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      await speakMessage(aiResponse);

      // Update score and progress
      setScore(prev => prev + 10);
      
      // Move to next prompt if available
      if (currentPromptIndex < selectedScenario.prompts.length - 1) {
        setCurrentPromptIndex(prev => prev + 1);
      }
    } catch (error) {
      console.error('API error:', error);
    }
  };

  const speakMessage = async (text: string) => {
    try {
      setIsPlaying(true);
      await speechService.speak(text, voiceSettings);
    } catch (error) {
      console.error('Speech error:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const getRecordingIcon = () => {
    switch (recordingState) {
      case 'recording':
        return <MicOff className="text-red-500" size={24} />;
      case 'processing':
        return <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>;
      default:
        return <Mic size={24} />;
    }
  };

  const getRecordingText = () => {
    switch (recordingState) {
      case 'recording':
        return 'Listening... 👂';
      case 'processing':
        return 'Thinking... 🤔';
      default:
        return 'Tap to speak 🎤';
    }
  };

  if (!selectedScenario) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white shadow-sm p-4 flex items-center justify-between border-b border-gray-200">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-primary-600"
          >
            <ArrowLeft size={24} />
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-800">Choose a Scenario</h1>
            <p className="text-gray-600 text-sm">Practice real-life conversations</p>
          </div>
          
          <div className="w-10"></div>
        </div>

        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {roleplayScenarios.map((scenario) => (
              <motion.div
                key={scenario.id}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleScenarioSelect(scenario)}
                className="bg-white shadow-xl hover:shadow-2xl rounded-3xl p-6 cursor-pointer transition-all duration-300 border border-gray-200 hover:border-primary-300 group"
              >
                <div className="text-6xl text-center mb-4 group-hover:scale-110 transition-transform duration-300">{scenario.emoji}</div>
                <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
                  {scenario.title}
                </h3>
                <p className="text-gray-600 text-sm text-center mb-4">
                  {scenario.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < (scenario.difficulty === 'beginner' ? 1 : scenario.difficulty === 'intermediate' ? 2 : 3)
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                        }
                      />
                    ))}
                  </div>
                  
                  <span className="text-gray-500 text-xs uppercase tracking-wide font-medium">
                    {scenario.difficulty}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between border-b border-gray-200">
        <button
          onClick={resetRoleplay}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-primary-600"
        >
          <ArrowLeft size={24} />
        </button>
        
        <div className="text-center">
          <h1 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
            <span>{selectedScenario.emoji}</span>
            <span>{selectedScenario.title}</span>
          </h1>
          <div className="flex items-center space-x-2 justify-center">
            <Trophy className="text-yellow-500" size={16} />
            <span className="text-gray-600 text-sm">Score: {score}</span>
          </div>
        </div>
        
        <div className="w-10"></div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-start space-x-2 max-w-xs md:max-w-md">
                {!message.isUser && (
                  <div className="text-2xl">{selectedScenario.emoji}</div>
                )}
                
                <div
                  className={`rounded-2xl px-4 py-3 shadow-md ${
                    message.isUser
                      ? 'bg-primary-500 text-white ml-auto'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <p className="text-sm md:text-base">{message.text}</p>
                  
                  {!message.isUser && (
                    <button
                      onClick={() => speakMessage(message.text)}
                      disabled={isPlaying}
                      className="mt-2 p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 text-gray-600 hover:text-primary-600"
                    >
                      <Volume2 size={16} />
                    </button>
                  )}
                </div>
                
                {message.isUser && (
                  <div className="text-2xl">👦</div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Voice Input */}
      <div className="p-6 bg-white shadow-lg border-t border-gray-200">
        <div className="flex flex-col items-center space-y-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startRecording}
            disabled={recordingState !== 'idle'}
            className={`
              w-20 h-20 rounded-full flex items-center justify-center shadow-xl
              ${recordingState === 'recording' 
                ? 'bg-red-500 text-white animate-pulse shadow-red-300' 
                : 'bg-primary-500 hover:bg-primary-600 text-white hover:shadow-primary-300'
              }
              transition-all duration-300 disabled:opacity-50
            `}
          >
            {getRecordingIcon()}
          </motion.button>
          
          <p className="text-gray-700 text-center font-medium">
            {getRecordingText()}
          </p>
          
          {recordingState === 'recording' && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="flex space-x-1"
            >
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-red-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleplayPage;
