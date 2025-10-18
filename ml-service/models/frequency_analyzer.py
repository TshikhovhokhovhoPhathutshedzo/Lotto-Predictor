import numpy as np
import pandas as pd
from collections import Counter
import matplotlib.pyplot as plt
import seaborn as sns

class FrequencyAnalyzer:
    def __init__(self):
        self.data = None
        self.number_frequencies = None
        self.hot_numbers = None
        self.cold_numbers = None
        self.analysis_complete = False
        
    def analyze(self, data):
        """Analyze frequency patterns in the lottery data"""
        try:
            self.data = data
            
            # Calculate basic frequencies
            self._calculate_frequencies()
            
            # Identify hot and cold numbers
            self._identify_hot_cold_numbers()
            
            # Calculate additional statistics
            self._calculate_statistics()
            
            self.analysis_complete = True
            print("Frequency analysis completed successfully!")
            
        except Exception as e:
            print(f"Error in frequency analysis: {e}")
            raise
    
    def _calculate_frequencies(self):
        """Calculate frequency of each number"""
        all_numbers = []
        for _, row in self.data.iterrows():
            all_numbers.extend(row['numbers'])
        
        self.number_frequencies = Counter(all_numbers)
        
        # Calculate relative frequencies
        total_appearances = sum(self.number_frequencies.values())
        self.relative_frequencies = {}
        for num in range(1, 50):
            count = self.number_frequencies.get(num, 0)
            self.relative_frequencies[num] = count / total_appearances if total_appearances > 0 else 0
    
    def _identify_hot_cold_numbers(self):
        """Identify hot and cold numbers based on frequency"""
        if not self.number_frequencies:
            return
        
        # Calculate percentiles
        frequencies = list(self.number_frequencies.values())
        if frequencies:
            hot_threshold = np.percentile(frequencies, 75)
            cold_threshold = np.percentile(frequencies, 25)
            
            self.hot_numbers = [num for num, freq in self.number_frequencies.items() 
                              if freq >= hot_threshold]
            self.cold_numbers = [num for num, freq in self.number_frequencies.items() 
                               if freq <= cold_threshold]
        else:
            self.hot_numbers = []
            self.cold_numbers = []
    
    def _calculate_statistics(self):
        """Calculate additional statistical measures"""
        if not self.number_frequencies:
            return
        
        # Basic statistics
        frequencies = list(self.number_frequencies.values())
        self.stats = {
            'mean_frequency': np.mean(frequencies),
            'median_frequency': np.median(frequencies),
            'std_frequency': np.std(frequencies),
            'min_frequency': np.min(frequencies),
            'max_frequency': np.max(frequencies),
            'total_draws': len(self.data),
            'total_appearances': sum(frequencies)
        }
        
        # Calculate gaps (numbers that haven't appeared recently)
        self._calculate_gaps()
        
        # Calculate streaks
        self._calculate_streaks()
    
    def _calculate_gaps(self):
        """Calculate gaps since last appearance for each number"""
        self.gaps = {}
        
        for num in range(1, 50):
            last_appearance = 0
            for i, row in self.data.iterrows():
                if num in row['numbers']:
                    last_appearance = i
            
            # Gap is the number of draws since last appearance
            self.gaps[num] = len(self.data) - 1 - last_appearance
    
    def _calculate_streaks(self):
        """Calculate current streaks for each number"""
        self.streaks = {}
        
        for num in range(1, 50):
            current_streak = 0
            max_streak = 0
            
            for i, row in self.data.iterrows():
                if num in row['numbers']:
                    current_streak += 1
                    max_streak = max(max_streak, current_streak)
                else:
                    current_streak = 0
            
            self.streaks[num] = {
                'current': current_streak,
                'max': max_streak
            }
    
    def get_frequency_analysis(self):
        """Get comprehensive frequency analysis"""
        if not self.analysis_complete:
            return {}
        
        return {
            'number_frequencies': dict(self.number_frequencies),
            'relative_frequencies': self.relative_frequencies,
            'statistics': self.stats,
            'gaps': self.gaps,
            'streaks': self.streaks
        }
    
    def get_hot_numbers(self, top_n=10):
        """Get the hottest numbers"""
        if not self.number_frequencies:
            return []
        
        sorted_numbers = sorted(self.number_frequencies.items(), 
                              key=lambda x: x[1], reverse=True)
        return [num for num, freq in sorted_numbers[:top_n]]
    
    def get_cold_numbers(self, top_n=10):
        """Get the coldest numbers"""
        if not self.number_frequencies:
            return []
        
        sorted_numbers = sorted(self.number_frequencies.items(), 
                              key=lambda x: x[1])
        return [num for num, freq in sorted_numbers[:top_n]]
    
    def get_overdue_numbers(self, threshold=10):
        """Get numbers that haven't appeared in recent draws"""
        if not self.gaps:
            return []
        
        overdue = [num for num, gap in self.gaps.items() if gap >= threshold]
        return sorted(overdue, key=lambda x: self.gaps[x], reverse=True)
    
    def get_recent_numbers(self, recent_draws=10):
        """Get numbers that have appeared in recent draws"""
        if not self.gaps:
            return []
        
        recent = [num for num, gap in self.gaps.items() if gap < recent_draws]
        return sorted(recent, key=lambda x: self.gaps[x])
    
    def get_number_analysis(self, number):
        """Get detailed analysis for a specific number"""
        if not self.analysis_complete:
            return {}
        
        return {
            'number': number,
            'frequency': self.number_frequencies.get(number, 0),
            'relative_frequency': self.relative_frequencies.get(number, 0),
            'gap': self.gaps.get(number, 0),
            'current_streak': self.streaks.get(number, {}).get('current', 0),
            'max_streak': self.streaks.get(number, {}).get('max', 0),
            'is_hot': number in self.hot_numbers if self.hot_numbers else False,
            'is_cold': number in self.cold_numbers if self.cold_numbers else False
        }
    
    def get_pattern_analysis(self):
        """Analyze patterns in the lottery data"""
        if not self.analysis_complete:
            return {}
        
        # Analyze even/odd patterns
        even_odd_patterns = self._analyze_even_odd_patterns()
        
        # Analyze sum patterns
        sum_patterns = self._analyze_sum_patterns()
        
        # Analyze consecutive numbers
        consecutive_patterns = self._analyze_consecutive_patterns()
        
        return {
            'even_odd_patterns': even_odd_patterns,
            'sum_patterns': sum_patterns,
            'consecutive_patterns': consecutive_patterns
        }
    
    def _analyze_even_odd_patterns(self):
        """Analyze even/odd number patterns"""
        even_counts = []
        odd_counts = []
        
        for _, row in self.data.iterrows():
            even_count = sum(1 for num in row['numbers'] if num % 2 == 0)
            odd_count = 6 - even_count
            even_counts.append(even_count)
            odd_counts.append(odd_count)
        
        return {
            'average_even': np.mean(even_counts),
            'average_odd': np.mean(odd_counts),
            'most_common_even_count': Counter(even_counts).most_common(1)[0][0]
        }
    
    def _analyze_sum_patterns(self):
        """Analyze sum patterns of lottery numbers"""
        sums = [sum(row['numbers']) for _, row in self.data.iterrows()]
        
        return {
            'average_sum': np.mean(sums),
            'min_sum': np.min(sums),
            'max_sum': np.max(sums),
            'std_sum': np.std(sums),
            'most_common_sum_range': self._get_sum_range(sums)
        }
    
    def _analyze_consecutive_patterns(self):
        """Analyze consecutive number patterns"""
        consecutive_counts = []
        
        for _, row in self.data.iterrows():
            sorted_nums = sorted(row['numbers'])
            consecutive = 0
            for i in range(len(sorted_nums) - 1):
                if sorted_nums[i+1] - sorted_nums[i] == 1:
                    consecutive += 1
            consecutive_counts.append(consecutive)
        
        return {
            'average_consecutive': np.mean(consecutive_counts),
            'max_consecutive': np.max(consecutive_counts),
            'most_common_consecutive_count': Counter(consecutive_counts).most_common(1)[0][0]
        }
    
    def _get_sum_range(self, sums):
        """Get the most common sum range"""
        ranges = {
            'low': sum(1 for s in sums if s < 150),
            'medium': sum(1 for s in sums if 150 <= s <= 200),
            'high': sum(1 for s in sums if s > 200)
        }
        return max(ranges, key=ranges.get)
