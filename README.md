# 🎯 Lotto Predictor by Phathu

An advanced lottery prediction web application that uses multiple machine learning algorithms to analyze historical lottery data and predict likely future numbers.

## 🚀 Features

- **Multiple ML Models**: Random Forest, XGBoost, ARIMA, Monte Carlo Simulation
- **Modern UI**: React.js with Tailwind CSS and interactive charts
- **Real-time Predictions**: Generate predictions with confidence scores
- **Data Visualization**: Hot/cold number analysis, frequency charts
- **Model Comparison**: Compare different ML model performances
- **Historical Analysis**: Upload and analyze your own lottery data

## 🏗️ Architecture

```
├── client/          # React.js Frontend
├── server/          # Node.js/Express Backend
├── ml-service/      # Python ML Microservice
└── data/           # Historical lottery data
```

## 🛠️ Tech Stack

- **Frontend**: React.js, Next.js, Tailwind CSS, Chart.js
- **Backend**: Node.js, Express.js
- **ML Engine**: Python, Flask, scikit-learn, XGBoost, pandas
- **Database**: MongoDB/PostgreSQL
- **Visualization**: Chart.js, Recharts

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm run install-all
   ```

2. **Start All Services**
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - ML Service: http://localhost:5001

## 📊 ML Models

### Random Forest
- Analyzes historical patterns
- Feature importance visualization
- Ensemble voting for predictions

### XGBoost
- Gradient boosting for non-linear relationships
- Hyperparameter optimization
- Advanced feature ranking

### ARIMA
- Time series analysis
- Temporal trend forecasting
- Autocorrelation analysis

### Monte Carlo Simulation
- Large-scale random simulations
- Probability-based predictions
- Confidence scoring

## 🎨 UI Features

- **Dashboard**: Latest results, model summaries, confidence charts
- **Prediction Generator**: Customizable prediction parameters
- **Model Comparison**: Performance metrics and accuracy scores
- **Data Visualization**: Interactive charts and graphs
- **Historical Analysis**: Trend analysis and pattern recognition

## 👨‍💻 Created by Phathu

Powered by AI & Machine Learning

---

*Disclaimer: This application is for educational and entertainment purposes only. Lottery predictions cannot guarantee winning numbers.*
