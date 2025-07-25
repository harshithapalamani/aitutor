import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Users, Settings, Sparkles } from 'lucide-react';
import { AppMode } from '../types';

interface WelcomeScreenProps {
  onSelectMode: (mode: AppMode) => void;
  userName?: string;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectMode, userName }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 flex flex-col items-center justify-center p-4 relative">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 1
        }}
        className="text-center mb-8 relative z-10"
      >
        <div className="text-8xl mb-6 animate-bounce-slow">🧞‍♂️</div>
        <h1 className="text-7xl font-bold text-white mb-3 drop-shadow-lg tracking-tight">
          SpeakGenie
        </h1>
        <p className="text-2xl text-white/90 font-medium mb-2">
          AI English Speaking Coach for Children
        </p>
        <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
          <p className="text-white text-sm font-medium">
            Where learning English is fun for kids aged <span className="bg-white text-primary-600 px-2 py-1 rounded-full text-xs font-bold">6 to 16 years</span>
          </p>
        </div>
      </motion.div>

      {userName && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-2xl text-white font-semibold mb-8 text-center relative z-10"
        >
          Welcome back, <span className="text-white bg-white/20 px-3 py-1 rounded-full">{userName}</span>! 👋
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full relative z-10"
      >
        <motion.button
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectMode('chat')}
          className="bg-white/10 backdrop-blur-md shadow-xl hover:shadow-2xl rounded-3xl p-8 text-white hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 group"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white/20 group-hover:bg-white/30 rounded-full transition-colors duration-300">
              <Mic size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold">Chat with Genie</h3>
            <p className="text-sm text-white/80 text-center group-hover:text-white/90">
              Ask me anything! I'm here to help you learn English
            </p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectMode('roleplay')}
          className="bg-white/10 backdrop-blur-md shadow-xl hover:shadow-2xl rounded-3xl p-8 text-white hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 group"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white/20 group-hover:bg-white/30 rounded-full transition-colors duration-300">
              <Users size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold">Practice Roleplay</h3>
            <p className="text-sm text-white/80 text-center group-hover:text-white/90">
              Practice real-life conversations in fun scenarios
            </p>
          </div>
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 flex items-center space-x-4 relative z-10"
      >
        <motion.button
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onSelectMode('settings')}
          className="p-3 bg-white/10 backdrop-blur-md shadow-lg hover:shadow-xl rounded-full text-white hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40"
        >
          <Settings size={20} />
        </motion.button>
        
        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md shadow-lg rounded-full px-4 py-2 border border-white/20">
          <Sparkles size={16} className="text-white animate-pulse" />
          <span className="text-white text-sm font-medium">Powered by AI</span>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;