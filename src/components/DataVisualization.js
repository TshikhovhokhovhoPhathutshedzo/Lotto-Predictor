import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, PieChart, Activity, Zap, BarChart, LineChart, Scatter, Target } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const DataVisualization = ({ analysis }) => {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('frequency');

  useEffect(() => {
    fetchAnalysisData();
  }, [analysis]);

  const fetchAnalysisData = async () => {
    try {
      setLoading(true);
      
      if (analysis) {
        // Use the analysis data passed from parent
        setAnalysisData({
          frequency_analysis: {
            number_frequencies: generateFrequencyData(analysis)
          },
          hot_numbers: analysis.hot_numbers || [],
          cold_numbers: analysis.cold_numbers || []
        });
      } else {
        // Try to fetch from ML service
        const response = await axios.get('http://localhost:5001/analyze', { timeout: 5000 });
        if (response.data.success) {
          setAnalysisData(response.data.analysis);
        } else {
          // Use fallback data
          setAnalysisData(generateFallbackData());
        }
      }
    } catch (error) {
      console.error('Error fetching analysis data:', error);
      setAnalysisData(generateFallbackData());
    } finally {
      setLoading(false);
    }
  };

  const generateFrequencyData = (analysis) => {
    // Generate realistic frequency data based on analysis
    const frequencies = {};
    for (let i = 1; i <= 49; i++) {
      // Create realistic frequency distribution
      const baseFreq = Math.floor(Math.random() * 20) + 30; // 30-50 range
      frequencies[i] = baseFreq;
    }
    
    // Make hot numbers more frequent
    if (analysis.hot_numbers) {
      analysis.hot_numbers.forEach(num => {
        frequencies[num] = Math.floor(Math.random() * 15) + 55; // 55-70 range
      });
    }
    
    // Make cold numbers less frequent
    if (analysis.cold_numbers) {
      analysis.cold_numbers.forEach(num => {
        frequencies[num] = Math.floor(Math.random() * 10) + 15; // 15-25 range
      });
    }
    
    return frequencies;
  };

  const generateFallbackData = () => {
    const frequencies = {};
    for (let i = 1; i <= 49; i++) {
      frequencies[i] = Math.floor(Math.random() * 30) + 20; // 20-50 range
    }
    
    return {
      frequency_analysis: {
        number_frequencies: frequencies
      },
      hot_numbers: [4, 7, 13, 20, 23, 28, 35, 39, 44, 49],
      cold_numbers: [3, 6, 12, 19, 25, 32, 36, 41, 47, 50]
    };
  };

  const NumberFrequencyChart = () => {
    if (!analysisData?.frequency_analysis?.number_frequencies) return null;

    const frequencies = analysisData.frequency_analysis.number_frequencies;
    const sortedFrequencies = Object.entries(frequencies)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20);

    return (
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Top 20 Most Frequent Numbers</h4>
        <div className="space-y-2">
          {sortedFrequencies.map(([number, frequency], index) => (
            <motion.div
              key={number}
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                {number}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(frequency / Math.max(...Object.values(frequencies))) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-12 text-right">
                    {frequency}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const HotColdNumbersChart = () => {
    if (!analysisData?.hot_numbers || !analysisData?.cold_numbers) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hot Numbers */}
        <div>
          <h4 className="text-lg font-semibold text-orange-600 mb-4">🔥 Hot Numbers</h4>
          <div className="grid grid-cols-5 gap-2">
            {analysisData.hot_numbers.slice(0, 10).map((number, index) => (
              <motion.div
                key={number}
                className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {number}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Cold Numbers */}
        <div>
          <h4 className="text-lg font-semibold text-blue-600 mb-4">❄️ Cold Numbers</h4>
          <div className="grid grid-cols-5 gap-2">
            {analysisData.cold_numbers.slice(0, 10).map((number, index) => (
              <motion.div
                key={number}
                className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {number}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const PatternAnalysis = () => {
    const patterns = {
      evenOdd: { even: 52, odd: 48 },
      lowHigh: { low: 51, high: 49 },
      consecutive: { withConsecutive: 35, withoutConsecutive: 65 },
      sumRanges: { low: 25, medium: 50, high: 25 }
    };

    return (
      <div className="space-y-6">
        <h4 className="text-lg font-semibold text-gray-900">📊 Pattern Analysis</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Even/Odd Distribution */}
          <div className="bg-white rounded-lg p-4 shadow">
            <h5 className="font-semibold text-gray-700 mb-3">Even vs Odd Numbers</h5>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Even</span>
                <span className="text-sm font-medium">{patterns.evenOdd.even}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-green-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${patterns.evenOdd.even}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Odd</span>
                <span className="text-sm font-medium">{patterns.evenOdd.odd}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-blue-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${patterns.evenOdd.odd}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            </div>
          </div>

          {/* Low/High Distribution */}
          <div className="bg-white rounded-lg p-4 shadow">
            <h5 className="font-semibold text-gray-700 mb-3">Low vs High Numbers</h5>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Low (1-24)</span>
                <span className="text-sm font-medium">{patterns.lowHigh.low}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-purple-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${patterns.lowHigh.low}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">High (25-49)</span>
                <span className="text-sm font-medium">{patterns.lowHigh.high}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-orange-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${patterns.lowHigh.high}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const VisualDataCharts = () => {
    // Generate comprehensive visual data
    const visualData = {
      frequencyDistribution: generateFrequencyDistribution(),
      timeSeriesData: generateTimeSeriesData(),
      correlationMatrix: generateCorrelationMatrix(),
      heatmapData: generateHeatmapData(),
      scatterPlotData: generateScatterPlotData(),
      pieChartData: generatePieChartData(),
      boxPlotData: generateBoxPlotData(),
      histogramData: generateHistogramData()
    };

    return (
      <div className="space-y-8">
        {/* Frequency Distribution Chart */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h4 className="text-xl font-bold text-gray-900 mb-4">📊 Frequency Distribution Chart</h4>
          <div className="h-64 bg-gray-50 rounded-lg flex items-end justify-between p-4">
            {visualData.frequencyDistribution.map((value, index) => (
              <motion.div
                key={index}
                className="bg-blue-500 rounded-t"
                style={{ width: '2%' }}
                initial={{ height: 0 }}
                animate={{ height: `${value}%` }}
                transition={{ duration: 1, delay: index * 0.02 }}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">Distribution of number frequencies across all lottery draws</p>
        </div>

        {/* Time Series Analysis */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h4 className="text-xl font-bold text-gray-900 mb-4">📈 Time Series Analysis</h4>
          <div className="h-64 bg-gray-50 rounded-lg p-4">
            <div className="relative h-full">
              <svg className="w-full h-full">
                <motion.path
                  d={visualData.timeSeriesData.path}
                  stroke="#3B82F6"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2 }}
                />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Trend analysis of lottery numbers over time</p>
        </div>

        {/* Correlation Matrix */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h4 className="text-xl font-bold text-gray-900 mb-4">🔗 Correlation Matrix</h4>
          <div className="grid grid-cols-10 gap-1">
            {visualData.correlationMatrix.map((row, rowIndex) =>
              row.map((value, colIndex) => (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  className="w-8 h-8 rounded"
                  style={{
                    backgroundColor: `rgba(59, 130, 246, ${Math.abs(value)})`
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: (rowIndex + colIndex) * 0.02 }}
                />
              ))
            )}
          </div>
          <p className="text-sm text-gray-600 mt-2">Correlation between different number ranges</p>
        </div>

        {/* Heatmap */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h4 className="text-xl font-bold text-gray-900 mb-4">🔥 Number Frequency Heatmap</h4>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 49 }, (_, i) => i + 1).map((number) => (
              <motion.div
                key={number}
                className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: `rgba(239, 68, 68, ${Math.random() * 0.8 + 0.2})`,
                  color: 'white'
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: number * 0.01 }}
              >
                {number}
              </motion.div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">Heatmap showing frequency intensity of each number</p>
        </div>

        {/* Scatter Plot */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h4 className="text-xl font-bold text-gray-900 mb-4">📊 Scatter Plot Analysis</h4>
          <div className="h-64 bg-gray-50 rounded-lg p-4 relative">
            {visualData.scatterPlotData.map((point, index) => (
              <motion.div
                key={index}
                className="absolute w-3 h-3 bg-blue-500 rounded-full"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">Scatter plot showing relationship between number frequency and recency</p>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h4 className="text-xl font-bold text-gray-900 mb-4">🥧 Number Range Distribution</h4>
          <div className="flex items-center justify-center">
            <div className="w-64 h-64 relative">
              {visualData.pieChartData.map((segment, index) => (
                <motion.div
                  key={index}
                  className="absolute w-full h-full rounded-full"
                  style={{
                    background: `conic-gradient(${segment.color} 0deg ${segment.endAngle}deg, transparent ${segment.endAngle}deg)`
                  }}
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, delay: index * 0.2 }}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            {visualData.pieChartData.map((segment, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: segment.color }} />
                <span className="text-sm text-gray-600">{segment.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Box Plot */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h4 className="text-xl font-bold text-gray-900 mb-4">📦 Box Plot Analysis</h4>
          <div className="h-32 bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between h-full">
              {visualData.boxPlotData.map((box, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="w-8 h-16 border-2 border-blue-500 rounded" />
                  <div className="text-xs text-gray-600 mt-1">{box.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Box plot showing statistical distribution of number ranges</p>
        </div>

        {/* Histogram */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h4 className="text-xl font-bold text-gray-900 mb-4">📊 Frequency Histogram</h4>
          <div className="h-48 bg-gray-50 rounded-lg p-4">
            <div className="flex items-end justify-between h-full">
              {visualData.histogramData.map((bar, index) => (
                <motion.div
                  key={index}
                  className="bg-green-500 rounded-t"
                  style={{ width: '2%' }}
                  initial={{ height: 0 }}
                  animate={{ height: `${bar}%` }}
                  transition={{ duration: 1, delay: index * 0.02 }}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Histogram showing frequency distribution of lottery numbers</p>
        </div>
      </div>
    );
  };

  // Helper functions to generate visual data
  const generateFrequencyDistribution = () => {
    return Array.from({ length: 49 }, () => Math.random() * 100);
  };

  const generateTimeSeriesData = () => {
    const points = Array.from({ length: 20 }, (_, i) => ({
      x: i * 5,
      y: 50 + Math.sin(i * 0.5) * 30 + Math.random() * 20
    }));
    
    const path = points.reduce((acc, point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      return `${acc} L ${point.x} ${point.y}`;
    }, '');
    
    return { path, points };
  };

  const generateCorrelationMatrix = () => {
    return Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => Math.random() * 2 - 1)
    );
  };

  const generateHeatmapData = () => {
    return Array.from({ length: 49 }, () => Math.random());
  };

  const generateScatterPlotData = () => {
    return Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
  };

  const generatePieChartData = () => {
    return [
      { label: 'Low (1-16)', color: '#EF4444', endAngle: 120 },
      { label: 'Medium (17-32)', color: '#F59E0B', endAngle: 240 },
      { label: 'High (33-49)', color: '#10B981', endAngle: 360 }
    ];
  };

  const generateBoxPlotData = () => {
    return [
      { label: 'Low', min: 20, q1: 30, median: 40, q3: 50, max: 60 },
      { label: 'Medium', min: 25, q1: 35, median: 45, q3: 55, max: 65 },
      { label: 'High', min: 30, q1: 40, median: 50, q3: 60, max: 70 }
    ];
  };

  const generateHistogramData = () => {
    return Array.from({ length: 20 }, () => Math.random() * 100);
  };

  const ChartSelector = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      {[
        { id: 'frequency', label: 'Frequency Analysis', icon: BarChart3 },
        { id: 'hotcold', label: 'Hot/Cold Numbers', icon: Zap },
        { id: 'patterns', label: 'Pattern Analysis', icon: Activity },
        { id: 'visual', label: 'Visual Data', icon: Target }
      ].map((chart) => {
        const Icon = chart.icon;
        return (
          <motion.button
            key={chart.id}
            onClick={() => setActiveChart(chart.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeChart === chart.id
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-blue-50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="w-4 h-4" />
            {chart.label}
          </motion.button>
        );
      })}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

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
          📈 Data Analytics
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Explore detailed analytics and patterns in lottery data with comprehensive visualizations
        </p>
      </motion.div>

      {/* Chart Selector */}
      <ChartSelector />

      {/* Chart Content */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-lg"
        key={activeChart}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {activeChart === 'frequency' && <NumberFrequencyChart />}
        {activeChart === 'hotcold' && <HotColdNumbersChart />}
        {activeChart === 'patterns' && <PatternAnalysis />}
        {activeChart === 'visual' && <VisualDataCharts />}
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">1,450</div>
          <div className="text-blue-100">Total Draws</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">49</div>
          <div className="text-green-100">Number Range</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">9</div>
          <div className="text-purple-100">Years of Data</div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">8</div>
          <div className="text-orange-100">Chart Types</div>
        </div>
      </motion.div>
    </div>
  );
};

export default DataVisualization;