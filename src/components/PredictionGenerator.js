import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Brain, Zap, BarChart3, Shuffle, Download, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const PredictionGenerator = ({ predictions, onGeneratePredictions, loading }) => {
  const [selectedModel, setSelectedModel] = useState('ensemble');
  const [numPredictions, setNumPredictions] = useState(5);

  const models = [
    { 
      id: 'ensemble', 
      name: 'Ensemble (All Models)', 
      icon: Brain, 
      color: 'purple',
      description: 'Combines all prediction methods for maximum accuracy',
      reasoning: 'Uses frequency analysis, hot/cold numbers, recent trends, and Monte Carlo simulation'
    },
    { 
      id: 'frequency', 
      name: 'Frequency Analysis', 
      icon: Target, 
      color: 'green',
      description: 'Based on historical number frequencies',
      reasoning: 'Analyzes how often each number has appeared in past draws'
    },
    { 
      id: 'hot_cold', 
      name: 'Hot/Cold Analysis', 
      icon: Zap, 
      color: 'orange',
      description: 'Combines most and least frequently drawn numbers',
      reasoning: 'Balances hot numbers (frequent) with cold numbers (overdue)'
    },
    { 
      id: 'recent', 
      name: 'Recent Trend', 
      icon: BarChart3, 
      color: 'blue',
      description: 'Focuses on patterns from recent draws',
      reasoning: 'Identifies patterns from the last 20 lottery draws'
    },
    { 
      id: 'monte_carlo', 
      name: 'Monte Carlo Simulation', 
      icon: Shuffle, 
      color: 'pink',
      description: 'Advanced statistical simulation using probability distributions',
      reasoning: 'Runs 10,000+ random simulations based on historical probability distributions'
    }
  ];

  const generatePredictions = () => {
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

  const NumberBall = ({ number, confidence = 0 }) => (
    <motion.div
      className="number-ball relative"
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {number}
      {confidence > 0 && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-xs text-white">
          {Math.round(confidence * 100)}%
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          🎯 Prediction Generator
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Generate lottery number predictions using advanced AI models with detailed algorithmic reasoning
        </p>
      </motion.div>

      {/* Model Selection */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Select AI Model</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {models.map((model) => {
            const Icon = model.icon;
            return (
              <motion.button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                  selectedModel === model.id
                    ? `border-${model.color}-500 bg-${model.color}-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon className={`w-6 h-6 text-${model.color}-600`} />
                  <div>
                    <div className="font-semibold text-gray-900">{model.name}</div>
                    <div className="text-sm text-gray-500">{model.description}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Reasoning:</strong> {model.reasoning}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Prediction Settings */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Prediction Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              onClick={generatePredictions}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="spinner w-4 h-4"></div>
                  Generating...
                </div>
              ) : (
                '🎯 Generate Predictions'
              )}
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
                
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-700">Algorithmic Reasoning:</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {prediction.reasoning}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {prediction.predictions[0]?.map((number, numIndex) => (
                    <NumberBall
                      key={numIndex}
                      number={number}
                      confidence={prediction.confidence || 0.75}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tips */}
      <motion.div
        className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Prediction Tips</h3>
        <ul className="space-y-2 text-gray-700">
          <li>• <strong>Ensemble Model:</strong> Combines all methods for the most balanced predictions</li>
          <li>• <strong>Frequency Analysis:</strong> Best for long-term historical patterns</li>
          <li>• <strong>Hot/Cold Analysis:</strong> Balances frequently drawn with overdue numbers</li>
          <li>• <strong>Recent Trend:</strong> Captures short-term patterns and recent changes</li>
          <li>• <strong>Monte Carlo:</strong> Most sophisticated with 10,000+ statistical simulations</li>
          <li>• <strong>Higher confidence scores</strong> indicate more reliable predictions</li>
          <li>• <strong>Remember:</strong> Lottery predictions are for entertainment purposes only</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default PredictionGenerator;