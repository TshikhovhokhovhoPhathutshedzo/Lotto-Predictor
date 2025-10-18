import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import os

class RandomForestPredictor:
    def __init__(self):
        self.model = None
        self.feature_importance = None
        self.performance_metrics = {}
        self.is_trained = False
        
    def train(self, data):
        """Train the Random Forest model"""
        try:
            # Prepare features and targets
            X, y = self._prepare_training_data(data)
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Train Random Forest
            self.model = RandomForestRegressor(
                n_estimators=100,
                max_depth=10,
                min_samples_split=5,
                min_samples_leaf=2,
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
            
            self.feature_importance = self.model.feature_importances_
            self.is_trained = True
            
            print("Random Forest model trained successfully!")
            print(f"R² Score: {self.performance_metrics['r2']:.4f}")
            
        except Exception as e:
            print(f"Error training Random Forest model: {e}")
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
            
            predictions = []
            for _ in range(num_predictions):
                # Generate 6 numbers (1-49)
                pred_numbers = self._generate_lottery_numbers(latest_data)
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
    
    def _generate_lottery_numbers(self, features):
        """Generate 6 unique lottery numbers"""
        # Simple approach: use model to predict probabilities for each number
        # For now, generate random numbers (this would be replaced with actual model prediction)
        numbers = np.random.choice(range(1, 50), size=6, replace=False)
        return sorted(numbers.tolist())
    
    def get_confidence_scores(self):
        """Get confidence scores for predictions"""
        # Placeholder confidence scores
        return [0.75, 0.68, 0.72, 0.69, 0.71]
    
    def get_model_performance(self):
        """Get model performance metrics"""
        return self.performance_metrics
    
    def get_feature_importance(self):
        """Get feature importance scores"""
        return self.feature_importance
    
    def save_model(self, filepath):
        """Save the trained model"""
        if self.is_trained:
            joblib.dump(self.model, filepath)
            print(f"Model saved to {filepath}")
    
    def load_model(self, filepath):
        """Load a pre-trained model"""
        if os.path.exists(filepath):
            self.model = joblib.load(filepath)
            self.is_trained = True
            print(f"Model loaded from {filepath}")
        else:
            print(f"Model file not found: {filepath}")
