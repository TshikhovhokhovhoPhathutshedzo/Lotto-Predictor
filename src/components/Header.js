import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <motion.header 
      className="bg-white shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <motion.div 
            className="flex items-center gap-4"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <motion.div
                className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-yellow-600" />
              </motion.div>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                Lotto Predictor
              </h1>
              <p className="text-gray-600 text-sm">
                by <span className="font-semibold text-blue-600">Phathu</span>
              </p>
            </div>
          </motion.div>

          {/* Status Indicator */}
          <motion.div 
            className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">AI Models Active</span>
          </motion.div>
        </div>

        {/* Subtitle */}
        <motion.div 
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <p className="text-gray-600 text-lg">
            🚀 Advanced Lottery Prediction powered by 
            <span className="font-semibold text-blue-600"> AI & Machine Learning</span>
          </p>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
