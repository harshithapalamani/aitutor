import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, Trophy, Volume2, Mic, MicOff } from 'lucide-react';
import { RoleplayScenario, ChatMessage, RecordingState, VoiceSettings } from '../types';
import { roleplayScenarios } from '../data/roleplayScenarios';
import { speechService } from '../services/speechService';
import { apiService } from '../services/apiService';

interface RoleplayScenarioPageProps {
  voiceSettings: VoiceSettings;
}

const RoleplayScenarioPage: React.FC<RoleplayScenarioPageProps> = ({ voiceSettings }) => {
  const navigate = useNavigate();
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const [scenario, setScenario] = useState<RoleplayScenario | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const foundScenario = roleplayScenarios.find(s => s.id === scenarioId);
    if (foundScenario) {
      setScenario(foundScenario);
    } else {
      navigate('/roleplay');
    }
  }, [scenarioId, navigate]);

  useEffect(() => {
    if (scenario && messages.length === 0) {
      startRoleplay();
    }
  }, [scenario]);

  const startRoleplay = async () => {
    if (!scenario) return;

    const initialMessage: ChatMessage = {
      id: Date.now().toString(),
      text: scenario.prompts[0].aiMessage,
      isUser: false,
      timestamp: new Date()
    };

    setMessages([initialMessage]);
    
    try {
      await speechService.speak(initialMessage.text, voiceSettings);
    } catch (error) {
      console.error('Error speaking:', error);
    }
  };

  const handleVoiceInput = async () => {
    if (recordingState === 'recording') {
      try {
        setRecordingState('processing');
        const audioBlob = await speechService.stopRecording();
        
        if (audioBlob) {
          const transcript = await apiService.transcribeAudio(audioBlob);
          
          if (transcript) {
            const userMessage: ChatMessage = {
              id: Date.now().toString(),
              text: transcript,
              isUser: true,
              timestamp: new Date()
            };

            setMessages(prev => [...prev, userMessage]);
            
            // Process response and move to next prompt
            setTimeout(() => {
              handleNextPrompt();
            }, 1000);
          }
        }
      } catch (error) {
        console.error('Error processing voice input:', error);
      } finally {
        setRecordingState('idle');
      }
    } else {
      try {
        setRecordingState('recording');
        await speechService.startRecording();
      } catch (error) {
        console.error('Error starting recording:', error);
        setRecordingState('idle');
      }
    }
  };

  const handleNextPrompt = async () => {
    if (!scenario) return;

    const nextIndex = currentPromptIndex + 1;
    
    if (nextIndex < scenario.prompts.length) {
      setCurrentPromptIndex(nextIndex);
      setScore(prev => prev + 10);
      
      const nextMessage: ChatMessage = {
        id: Date.now().toString(),
        text: scenario.prompts[nextIndex].aiMessage,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, nextMessage]);
      
      try {
        await speechService.speak(nextMessage.text, voiceSettings);
      } catch (error) {
        console.error('Error speaking:', error);
      }
    } else {
      // Roleplay completed
      const completionMessage: ChatMessage = {
        id: Date.now().toString(),
        text: "Great job! You've completed this roleplay scenario. Well done!",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, completionMessage]);
      setScore(prev => prev + 20);
      
      try {
        await speechService.speak(completionMessage.text, voiceSettings);
      } catch (error) {
        console.error('Error speaking:', error);
      }
    }
  };

  const playMessage = async (text: string) => {
    if (isPlaying) return;
    
    try {
      setIsPlaying(true);
      await speechService.speak(text, voiceSettings);
    } catch (error) {
      console.error('Error playing message:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  if (!scenario) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Scenario not found</h2>
          <button
            onClick={() => navigate('/roleplay')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Back to scenarios
          </button>
        </div>
      </div>
    );
  }

  const currentPrompt = scenario.prompts[currentPromptIndex];
  const isCompleted = currentPromptIndex >= scenario.prompts.length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between border-b border-gray-200">
        <button
          onClick={() => navigate('/roleplay')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-primary-600"
        >
          <ArrowLeft size={24} />
        </button>
        
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-800">{scenario.title}</h1>
          <p className="text-gray-600 text-sm">{scenario.description}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Trophy size={20} className="text-yellow-500" />
          <span className="font-bold text-gray-800">{score}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm text-gray-600">
              {Math.min(currentPromptIndex + 1, scenario.prompts.length)} / {scenario.prompts.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${((Math.min(currentPromptIndex + 1, scenario.prompts.length)) / scenario.prompts.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.isUser 
                    ? 'bg-white text-gray-800 shadow-md' 
                    : 'bg-primary-500 text-white'
                }`}>
                  <div className="flex items-start space-x-2">
                    {!message.isUser && (
                      <img 
                        src="/aitutorfavicon.png" 
                        alt="AI Tutor" 
                        className="w-6 h-6 rounded-full mt-1"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-sm">{message.text}</p>
                      {!message.isUser && (
                        <button
                          onClick={() => playMessage(message.text)}
                          disabled={isPlaying}
                          className="mt-2 p-1 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
                        >
                          <Volume2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-2xl mx-auto">
          {!isCompleted ? (
            <div className="space-y-4">
              {/* Current Hints */}
              {currentPrompt && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Hints:</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentPrompt.hints.map((hint, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {hint}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Voice Input */}
              <div className="flex items-center justify-center">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleVoiceInput}
                  disabled={recordingState === 'processing'}
                  className={`p-6 rounded-full shadow-lg transition-all duration-200 ${
                    recordingState === 'recording'
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : recordingState === 'processing'
                      ? 'bg-yellow-500 text-white cursor-not-allowed'
                      : 'bg-primary-500 hover:bg-primary-600 text-white'
                  }`}
                >
                  {recordingState === 'recording' ? (
                    <MicOff size={32} />
                  ) : recordingState === 'processing' ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Mic size={32} />
                  )}
                </motion.button>
              </div>

              <p className="text-center text-gray-600 text-sm">
                {recordingState === 'recording' 
                  ? 'Speaking... Tap to stop'
                  : recordingState === 'processing'
                  ? 'Processing your response...'
                  : 'Tap to speak your response'
                }
              </p>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-6xl">🎉</div>
              <h3 className="text-xl font-bold text-gray-800">Congratulations!</h3>
              <p className="text-gray-600">You've completed this roleplay scenario!</p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => navigate('/roleplay')}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium transition-colors"
                >
                  Try Another
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleplayScenarioPage;
