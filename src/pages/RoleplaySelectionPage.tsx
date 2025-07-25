import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import { roleplayScenarios } from '../data/roleplayScenarios';

const RoleplaySelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between border-b border-gray-200">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-primary-600"
        >
          <ArrowLeft size={24} />
        </button>
        
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-800">Choose a Roleplay</h1>
          <p className="text-gray-600 text-sm">Select a scenario to practice</p>
        </div>
        
        <div className="w-10"></div>
      </div>

      {/* Scenarios Grid */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roleplayScenarios.map((scenario) => (
              <motion.div
                key={scenario.id}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/roleplay/${scenario.id}`)}
                className="bg-white border-2 border-gray-200 hover:border-primary-300 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{scenario.emoji}</div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(scenario.difficulty)}`}>
                    {scenario.difficulty}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
                  {scenario.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  {scenario.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star size={16} className="text-yellow-500" />
                    <span className="text-sm text-gray-600">
                      {scenario.prompts.length} conversations
                    </span>
                  </div>
                  
                  <div className="text-primary-600 font-medium group-hover:text-primary-700 transition-colors">
                    Start →
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleplaySelectionPage;
