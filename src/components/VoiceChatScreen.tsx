import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, ArrowLeft, RotateCcw, Globe } from 'lucide-react';
import { ChatMessage, RecordingState, VoiceSettings, AppMode } from '../types';
import { speechService } from '../services/speechService';
import { apiService } from '../services/apiService';

interface VoiceChatScreenProps {
  onBack: () => void;
  voiceSettings: VoiceSettings;
  nativeLanguage: string;
}

const VoiceChatScreen: React.FC<VoiceChatScreenProps> = ({ 
  onBack, 
  voiceSettings, 
  nativeLanguage 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hi there! I'm Genie, your English tutor! Ask me anything about English or just have a chat. What would you like to talk about today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [isPlaying, setIsPlaying] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
        await handleUserMessage(transcript);
      }
    } catch (error) {
      console.error('Recording error:', error);
      alert('Sorry, I couldn\'t hear you clearly. Please try again!');
    } finally {
      setRecordingState('idle');
    }
  };

  const handleUserMessage = async (text: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const aiResponse = await apiService.sendChatMessage(text, messages);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Speak the AI response
      await speakMessage(aiResponse);
    } catch (error) {
      console.error('Error handling message:', error);
    }
  };

  const speakMessage = async (text: string, useNativeLanguage: boolean = false) => {
    try {
      setIsPlaying(true);
      
      let textToSpeak = text;
      if (useNativeLanguage && nativeLanguage !== 'en') {
        textToSpeak = await apiService.translateToNativeLanguage(text, nativeLanguage);
      }

      const settings = useNativeLanguage 
        ? { ...voiceSettings, language: nativeLanguage }
        : voiceSettings;

      await speechService.speak(textToSpeak, settings);
    } catch (error) {
      console.error('Speech error:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        text: "Hi there! I'm Genie, your English tutor! What would you like to talk about?",
        isUser: false,
        timestamp: new Date()
      }
    ]);
  };

  const getRecordingIcon = () => {
    switch (recordingState) {
      case 'recording':
        return <MicOff className="text-white" size={24} />;
      case 'processing':
        return <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>;
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
          <h1 className="text-xl font-bold text-gray-800">Chat with Genie</h1>
          <p className="text-gray-600 text-sm">Your AI English Tutor</p>
        </div>

        <button
          onClick={clearChat}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-gray-800"
        >
          <RotateCcw size={20} />
        </button>
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
                  <img 
                    src="/aitutorfavicon.png" 
                    alt="Genie" 
                    className="w-8 h-8 rounded-full"
                  />
                )}
                
                <div
                  className={`rounded-2xl px-4 py-3 shadow-md ${
                    message.isUser
                      ? 'bg-white text-gray-800 border border-gray-200 ml-auto'
                      : 'bg-primary-500 text-white'
                  }`}
                >
                  <p className="text-sm md:text-base">{message.text}</p>
                  
                  {!message.isUser && (
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => speakMessage(message.text)}
                        disabled={isPlaying}
                        className="p-1 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50 text-white/80 hover:text-white"
                      >
                        <Volume2 size={16} />
                      </button>
                      
                      {nativeLanguage !== 'en' && (
                        <button
                          onClick={() => speakMessage(message.text, true)}
                          disabled={isPlaying}
                          className="p-1 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50 text-white/80 hover:text-white"
                          title="Play in native language"
                        >
                          <Globe size={16} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                {message.isUser && (
                  <div className="text-2xl">👦</div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
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
                : 'bg-white text-primary-600 hover:bg-gray-50 hover:shadow-lg border-2 border-primary-200 hover:border-primary-300'
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
                  className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"
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

export default VoiceChatScreen;