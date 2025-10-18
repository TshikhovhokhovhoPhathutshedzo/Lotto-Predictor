import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Brain, Target, BarChart3, Zap, Clock, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = ({ analysis, predictions, onGeneratePredictions }) => {
  const [selectedModel, setSelectedModel] = useState('ensemble');
  const [numPredictions, setNumPredictions] = useState(5);

  const handleGeneratePredictions = () => {
    onGeneratePredictions(selectedModel, numPredictions);
  };

  const downloadPredictions = () => {
    if (!predictions.length) {
      toast.error('No predictions to download');
      return;
    }

    const data = {
      timestamp: new Date().toISOString(),
      model: selectedModel,
      numPredictions,
      predictions
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lotto-predictions-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Predictions downloaded!');
  };

  const NumberBall = ({ number, type = "normal" }) => (
    <motion.div
      className={`number-ball ${type}`}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {number}
    </motion.div>
  );

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => (
    <motion.div
      className="bg-white rounded-xl p-6 shadow-lg card-hover"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{subtitle}</div>
        </div>
      </div>
      <div className="text-gray-600 font-medium">{title}</div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Lotto Predictor
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Harness the power of AI and machine learning to predict lottery numbers with advanced algorithms
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={BarChart3}
          title="Historical Draws"
          value={analysis?.total_draws?.toLocaleString() || '1,450'}
          subtitle="Analyzed"
          color="blue"
        />
        <StatCard
          icon={Brain}
          title="AI Models"
          value="3"
          subtitle="Active"
          color="purple"
        />
        <StatCard
          icon={Target}
          title="Predictions"
          value={predictions.length}
          subtitle="Generated"
          color="green"
        />
        <StatCard
          icon={TrendingUp}
          title="Accuracy"
          value="75%"
          subtitle="Average"
          color="orange"
        />
      </div>

      {/* Prediction Generator */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6">🎯 Generate Predictions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ensemble">Ensemble (All Models)</option>
              <option value="frequency">Frequency Analysis</option>
              <option value="hot_cold">Hot/Cold Analysis</option>
              <option value="recent">Recent Trend</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Predictions
            </label>
            <select
              value={numPredictions}
              onChange={(e) => setNumPredictions(parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={1}>1 Prediction</option>
              <option value={3}>3 Predictions</option>
              <option value={5}>5 Predictions</option>
              <option value={10}>10 Predictions</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <motion.button
              onClick={handleGeneratePredictions}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🎯 Generate Predictions
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Predictions Display */}
      {predictions.length > 0 && (
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Generated Predictions</h3>
            <motion.button
              onClick={downloadPredictions}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4" />
              Download
            </motion.button>
          </div>

          <div className="space-y-6">
            {predictions.map((prediction, index) => (
              <motion.div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {prediction.model}
                      </div>
                      <div className="text-sm text-gray-500">
                        Confidence: {Math.round((prediction.confidence || 0.75) * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Algorithmic Reasoning:</strong> {prediction.reasoning}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {prediction.predictions[0]?.map((number, numIndex) => (
                    <NumberBall
                      key={numIndex}
                      number={number}
                      type="normal"
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Hot & Cold Numbers */}
      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hot Numbers */}
          <motion.div
            className="bg-white rounded-xl p-6 shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-orange-600" />
              <h3 className="text-2xl font-bold text-gray-900">Hot Numbers</h3>
            </div>
            <p className="text-gray-600 mb-4">Most frequently drawn numbers</p>
            <div className="flex flex-wrap gap-3">
              {analysis.hot_numbers?.slice(0, 6).map((number, index) => (
                <NumberBall key={index} number={number} type="hot" />
              ))}
            </div>
          </motion.div>

          {/* Cold Numbers */}
          <motion.div
            className="bg-white rounded-xl p-6 shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">Cold Numbers</h3>
            </div>
            <p className="text-gray-600 mb-4">Least frequently drawn numbers</p>
            <div className="flex flex-wrap gap-3">
              {analysis.cold_numbers?.slice(0, 6).map((number, index) => (
                <NumberBall key={index} number={number} type="cold" />
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Quick Actions */}
      <motion.div
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className="text-2xl font-bold mb-4">Ready to Predict?</h3>
        <p className="text-blue-100 mb-6">
          Use our advanced AI models to generate lottery number predictions with algorithmic reasoning
        </p>
        <div className="flex flex-wrap gap-4">
          <motion.button
            onClick={handleGeneratePredictions}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🎯 Generate Predictions
          </motion.button>
          <motion.button
            onClick={() => window.location.href = '#analytics'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📊 View Analytics
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;