# 🚀 Lotto Predictor by Phathu - Setup Guide

## 📋 Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download here](https://python.org/)
- **Git** (optional) - [Download here](https://git-scm.com/)

## 🛠️ Installation

### Option 1: Automated Installation (Recommended)

**Windows:**
```bash
# Run the installation script
install.bat
```

**Linux/Mac:**
```bash
# Make script executable and run
chmod +x install.sh
./install.sh
```

### Option 2: Manual Installation

1. **Install Root Dependencies**
   ```bash
   npm install
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Install Python ML Dependencies**
   ```bash
   cd ml-service
   pip install -r requirements.txt
   cd ..
   ```

## 🚀 Running the Application

### Option 1: Automated Startup (Recommended)

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
./start.sh
```

### Option 2: Manual Startup

1. **Start Python ML Service** (Terminal 1)
   ```bash
   cd ml-service
   python app.py
   ```

2. **Start Node.js Backend** (Terminal 2)
   ```bash
   cd server
   npm start
   ```

3. **Start React Frontend** (Terminal 3)
   ```bash
   cd client
   npm start
   ```

## 🌐 Accessing the Application

Once all services are running, you can access:

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **ML Service**: http://localhost:5001

## 📊 Features Overview

### 🤖 AI Models
- **Random Forest**: Ensemble learning for robust predictions
- **XGBoost**: Gradient boosting for high accuracy
- **ARIMA**: Time series analysis for temporal patterns
- **Monte Carlo**: Statistical simulation based on frequency

### 📈 Analytics Dashboard
- Real-time prediction generation
- Model performance comparison
- Hot/cold number analysis
- Frequency distribution charts
- Pattern recognition

### 🎯 Prediction Generator
- Multiple model selection
- Customizable prediction count
- Confidence scoring
- Export functionality

## 🔧 Configuration

### Environment Variables

Create `.env` files in the respective directories:

**server/.env:**
```
PORT=5000
CLIENT_URL=http://localhost:3000
ML_SERVICE_URL=http://localhost:5001
NODE_ENV=development
```

**ml-service/.env:**
```
FLASK_ENV=development
FLASK_DEBUG=True
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Change ports in the respective `.env` files
   - Kill processes using the ports

2. **Python Dependencies**
   - Ensure Python 3.8+ is installed
   - Use `pip3` instead of `pip` if needed
   - Try `python -m pip install -r requirements.txt`

3. **Node.js Dependencies**
   - Clear npm cache: `npm cache clean --force`
   - Delete `node_modules` and reinstall

4. **Data Loading Issues**
   - Ensure `LOTTO-Results.xlsx` is in the `data/` directory
   - Check file permissions

### Performance Optimization

- **Memory**: Ensure at least 4GB RAM available
- **CPU**: Multi-core processor recommended for ML models
- **Storage**: At least 2GB free space

## 📱 Mobile Support

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🔒 Security Notes

- The application is designed for educational purposes
- No sensitive data is stored permanently
- All predictions are generated locally
- No external API calls for predictions

## 📞 Support

For issues or questions:
- Check the console logs for error messages
- Ensure all services are running
- Verify all dependencies are installed correctly

## 🎉 Success!

Once everything is running, you should see:
- A beautiful loading screen with the Lotto Predictor logo
- A modern dashboard with statistics
- Working prediction generator
- Interactive analytics charts

---

**Created by Phathu - Powered by AI & Machine Learning** 🤖✨
