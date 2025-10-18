import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <motion.footer 
      className="bg-gray-900 text-white py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-4 gradient-text">
              Lotto Predictor
            </h3>
            <p className="text-gray-400 mb-4">
              Advanced lottery prediction powered by cutting-edge AI and machine learning algorithms.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <motion.a
                href="https://github.com/TshikhovhokhovhoPhathutshedzo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/phathutshedzo-tshikhovhokhovho-5b3609212/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="mailto:phathu301@gmail.com"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Features Section */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4">AI Models</h4>
            <ul className="space-y-2 text-gray-400">
              <li>🌲 Random Forest</li>
              <li>🚀 XGBoost</li>
              <li>📊 ARIMA</li>
              <li>🎲 Monte Carlo</li>
              <li>📈 Frequency Analysis</li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4">Tech Stack</h4>
            <ul className="space-y-2 text-gray-400">
              <li>⚛️ React.js</li>
              <li>🟢 Node.js</li>
              <li>🐍 Python</li>
              <li>🤖 Machine Learning</li>
              <li>📊 Data Visualization</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div 
          className="border-t border-gray-800 mt-8 pt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="text-gray-400 mb-4">
            Made with <Heart className="w-4 h-4 text-red-500 inline mx-1" /> by 
            <span className="font-semibold text-blue-400 ml-1">Phathu</span>
          </p>
          <p className="text-sm text-gray-500">
            ⚠️ Disclaimer: This application is for educational and entertainment purposes only. 
            Lottery predictions cannot guarantee winning numbers.
          </p>
          <p className="text-xs text-gray-600 mt-2">
            © 2024 Lotto Predictor by Phathu. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
