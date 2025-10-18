import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler
import joblib
import os

class XGBoostPredictor:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.performance_metrics = {}
        self.is_trained = False
        
    def train(self, data):
        """Train the XGBoost model"""
        try:
            # Prepare features and targets
            X, y = self._prepare_training_data(data)
            
            # Scale features
            X_scaled = self.scaler.fit_transform(X)
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X_scaled, y, test_size=0.2, random_state=42
            )
            
            # Train XGBoost
            self.model = xgb.XGBRegressor(
                n_estimators=200,
                max_depth=8,
                learning_rate=0.1,
                subsample=0.8,
                colsample_bytree=0.8,
                random_state=42,
                n_jobs=-1
            )
            
            self.model.fit(X_train, y_train)
            
            # Evaluate model
            y_pred = self.model.predict(X_test)
            self.performance_metrics = {
                'mse': mean_squared_error(y_test, y_pred),
                'r2': r2_score(y_test, y_pred),
                'feature_importance': dict(zip(X.columns, self.model.feature_importances_))
            }
            
            self.is_trained = True
            
            print("XGBoost model trained successfully!")
            print(f"R² Score: {self.performance_metrics['r2']:.4f}")
            
        except Exception as e:
            print(f"Error training XGBoost model: {e}")
            raise
    
    def _prepare_training_data(self, data):
        """Prepare features and targets for training"""
        # Create feature matrix
        feature_columns = [col for col in data.columns if col not in ['draw_number', 'date', 'numbers', 'bonus_ball']]
        X = data[feature_columns].fillna(0)
        
        # Create target: predict next draw numbers
        y = []
        for i in range(len(data) - 1):
            next_numbers = data.iloc[i + 1]['numbers']
            # Create 6 targets for the 6 main numbers
            y.append(next_numbers)
        
        # Remove last row from X since we don't have target for it
        X = X.iloc[:-1]
        
        return X, np.array(y)
    
    def predict(self, num_predictions=5):
        """Generate predictions"""
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")
        
        try:
            # Get the latest data point for prediction
            latest_data = self._get_latest_features()
            latest_data_scaled = self.scaler.transform([latest_data])
            
            predictions = []
            for _ in range(num_predictions):
                # Generate 6 numbers (1-49)
                pred_numbers = self._generate_lottery_numbers(latest_data_scaled)
                predictions.append(pred_numbers)
            
            return predictions
            
        except Exception as e:
            print(f"Error generating predictions: {e}")
            return []
    
    def _get_latest_features(self):
        """Get features for the latest draw"""
        # This would need to be implemented based on your data structure
        # For now, return a dummy feature vector
        return np.random.rand(50)  # Placeholder
    
    def _generate_lottery_numbers(self, features_scaled):
        """Generate 6 unique lottery numbers"""
        # Simple approach: use model to predict probabilities for each number
        # For now, generate random numbers (this would be replaced with actual model prediction)
        numbers = np.random.choice(range(1, 50), size=6, replace=False)
        return sorted(numbers.tolist())
    
    def get_confidence_scores(self):
        """Get confidence scores for predictions"""
        # Placeholder confidence scores
        return [0.82, 0.76, 0.79, 0.74, 0.77]
    
    def get_model_performance(self):
        """Get model performance metrics"""
        return self.performance_metrics
    
    def save_model(self, filepath):
        """Save the trained model"""
        if self.is_trained:
            joblib.dump({
                'model': self.model,
                'scaler': self.scaler
            }, filepath)
            print(f"Model saved to {filepath}")
    
    def load_model(self, filepath):
        """Load a pre-trained model"""
        if os.path.exists(filepath):
            model_data = joblib.load(filepath)
            self.model = model_data['model']
            self.scaler = model_data['scaler']
            self.is_trained = True
            print(f"Model loaded from {filepath}")
        else:
            print(f"Model file not found: {filepath}")
