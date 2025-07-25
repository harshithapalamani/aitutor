import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mic, Users, Settings, Sparkles } from 'lucide-react';
import logoImage from '../assets/images/logo-tutor.png';

interface WelcomePageProps {
  userName?: string;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ userName }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <img 
            src={logoImage} 
            alt="SpeakGenie Logo" 
            className="h-16 w-auto mx-auto"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <h1 className="text-6xl md:text-7xl font-bold text-gray-800 mb-6">
            Unlock the Power of Learning
          </h1>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-8">
            with <span className="text-primary-500">SpeakGenie AI</span>
          </h2>
          
          {userName && (
            <div className="text-xl text-gray-600 mb-8">
              Welcome back, <span className="text-primary-600 font-semibold">{userName}</span>!
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full"
        >
          <motion.button
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/chat')}
            className="bg-white border-2 border-gray-200 hover:border-primary-300 text-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-primary-100 group-hover:bg-primary-200 rounded-full transition-colors duration-300">
                <Mic size={32} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-bold">Start Personal Chat</h3>
              <p className="text-sm text-gray-600 text-center">
                Begin your learning journey with AI-powered conversations
              </p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/roleplay')}
            className="bg-primary-500 hover:bg-primary-600 text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-white/20 group-hover:bg-white/30 rounded-full transition-colors duration-300">
                <Users size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold">Practice Roleplay</h3>
              <p className="text-sm text-white/90 text-center">
                Engage in real-world conversation scenarios
              </p>
            </div>
          </motion.button>
        </motion.div>

        {/* Settings and Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 flex items-center space-x-4"
        >
          <motion.button
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/settings')}
            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 hover:text-gray-800 transition-all duration-300"
          >
            <Settings size={20} />
          </motion.button>
          
          <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
            <Sparkles size={16} className="text-primary-500 animate-pulse" />
            <span className="text-gray-700 text-sm font-medium">Powered by AI</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomePage;
