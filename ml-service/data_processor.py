import pandas as pd
import numpy as np
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

class DataProcessor:
    def __init__(self):
        self.data = None
        self.processed_data = None
        
    def load_data(self, file_path):
        """Load and preprocess the lottery data"""
        try:
            # Load the Excel file
            self.data = pd.read_excel(file_path)
            
            # Convert date column
            self.data['Draw Date'] = pd.to_datetime(self.data['Draw Date'])
            
            # Sort by date (oldest first)
            self.data = self.data.sort_values('Draw Date').reset_index(drop=True)
            
            # Extract lottery numbers
            ball_columns = ['Ball 1', 'Ball 2', 'Ball 3', 'Ball 4', 'Ball 5', 'Ball 6']
            self.data['numbers'] = self.data[ball_columns].values.tolist()
            self.data['bonus_ball'] = self.data['Bonus Ball']
            
            # Create processed data for ML
            self._create_processed_data()
            
            print(f"Loaded {len(self.data)} lottery draws")
            print(f"Date range: {self.data['Draw Date'].min()} to {self.data['Draw Date'].max()}")
            
        except Exception as e:
            print(f"Error loading data: {e}")
            raise
    
    def _create_processed_data(self):
        """Create processed dataset for machine learning"""
        processed = []
        
        for i in range(len(self.data)):
            row = self.data.iloc[i]
            
            # Basic features
            features = {
                'draw_number': row['Draw No'],
                'date': row['Draw Date'],
                'numbers': row['numbers'],
                'bonus_ball': row['bonus_ball'],
                'sum_numbers': sum(row['numbers']),
                'even_count': sum(1 for x in row['numbers'] if x % 2 == 0),
                'odd_count': sum(1 for x in row['numbers'] if x % 2 == 1),
                'consecutive_count': self._count_consecutive(row['numbers']),
                'low_numbers': sum(1 for x in row['numbers'] if x <= 24),
                'high_numbers': sum(1 for x in row['numbers'] if x >= 25),
            }
            
            # Historical frequency features (last 10, 50, 100 draws)
            if i >= 10:
                features.update(self._get_frequency_features(i, 10))
            if i >= 50:
                features.update(self._get_frequency_features(i, 50))
            if i >= 100:
                features.update(self._get_frequency_features(i, 100))
            
            # Time-based features
            features.update(self._get_time_features(row['Draw Date']))
            
            # Gap analysis
            if i > 0:
                features.update(self._get_gap_features(i))
            
            processed.append(features)
        
        self.processed_data = pd.DataFrame(processed)
        print(f"Created processed dataset with {len(self.processed_data)} samples and {len(self.processed_data.columns)} features")
    
    def _count_consecutive(self, numbers):
        """Count consecutive numbers in a draw"""
        sorted_nums = sorted(numbers)
        consecutive = 0
        for i in range(len(sorted_nums) - 1):
            if sorted_nums[i+1] - sorted_nums[i] == 1:
                consecutive += 1
        return consecutive
    
    def _get_frequency_features(self, current_idx, lookback):
        """Get frequency features for the last N draws"""
        start_idx = max(0, current_idx - lookback)
        recent_data = self.data.iloc[start_idx:current_idx]
        
        # Flatten all numbers from recent draws
        all_numbers = []
        for _, row in recent_data.iterrows():
            all_numbers.extend(row['numbers'])
        
        # Calculate frequency for each number (1-49)
        freq_features = {}
        for num in range(1, 50):
            freq_features[f'freq_{num}_{lookback}'] = all_numbers.count(num)
        
        # Calculate hot/cold numbers
        if all_numbers:
            freq_array = np.array([all_numbers.count(i) for i in range(1, 50)])
            hot_threshold = np.percentile(freq_array, 75)
            cold_threshold = np.percentile(freq_array, 25)
            
            freq_features[f'hot_count_{lookback}'] = sum(1 for x in self.data.iloc[current_idx]['numbers'] if all_numbers.count(x) >= hot_threshold)
            freq_features[f'cold_count_{lookback}'] = sum(1 for x in self.data.iloc[current_idx]['numbers'] if all_numbers.count(x) <= cold_threshold)
        
        return freq_features
    
    def _get_time_features(self, date):
        """Extract time-based features"""
        return {
            'day_of_week': date.weekday(),
            'month': date.month,
            'quarter': (date.month - 1) // 3 + 1,
            'year': date.year,
            'is_weekend': 1 if date.weekday() >= 5 else 0
        }
    
    def _get_gap_features(self, current_idx):
        """Get gap analysis features"""
        current_numbers = set(self.data.iloc[current_idx]['numbers'])
        previous_numbers = set(self.data.iloc[current_idx - 1]['numbers'])
        
        return {
            'numbers_repeated': len(current_numbers.intersection(previous_numbers)),
            'numbers_new': len(current_numbers - previous_numbers),
            'gap_sum': sum(current_numbers - previous_numbers) if current_numbers - previous_numbers else 0
        }
    
    def get_processed_data(self):
        """Return the processed dataset"""
        return self.processed_data
    
    def get_raw_data(self):
        """Return the raw dataset"""
        return self.data
    
    def get_latest_draw(self):
        """Get the most recent draw"""
        return self.data.iloc[-1].to_dict()
    
    def get_statistics(self):
        """Get basic statistics about the dataset"""
        stats = {
            'total_draws': len(self.data),
            'date_range': {
                'start': self.data['Draw Date'].min().strftime('%Y-%m-%d'),
                'end': self.data['Draw Date'].max().strftime('%Y-%m-%d')
            },
            'number_frequency': self._get_number_frequency(),
            'average_sum': self.data['numbers'].apply(sum).mean(),
            'most_common_numbers': self._get_most_common_numbers(),
            'least_common_numbers': self._get_least_common_numbers()
        }
        return stats
    
    def _get_number_frequency(self):
        """Calculate frequency of each number (1-49)"""
        all_numbers = []
        for _, row in self.data.iterrows():
            all_numbers.extend(row['numbers'])
        
        frequency = {}
        for num in range(1, 50):
            frequency[num] = all_numbers.count(num)
        
        return frequency
    
    def _get_most_common_numbers(self, top_n=10):
        """Get most frequently drawn numbers"""
        freq = self._get_number_frequency()
        return sorted(freq.items(), key=lambda x: x[1], reverse=True)[:top_n]
    
    def _get_least_common_numbers(self, top_n=10):
        """Get least frequently drawn numbers"""
        freq = self._get_number_frequency()
        return sorted(freq.items(), key=lambda x: x[1])[:top_n]
