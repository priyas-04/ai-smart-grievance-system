import pickle
import numpy as np
import pandas as pd
from typing import Tuple, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from .text_preprocessor import TextPreprocessor

class ComplaintClassifier:
    def __init__(self):
        self.preprocessor = TextPreprocessor()
        self.category_pipeline = None
        self.priority_pipeline = None
        self.categories = ['water', 'electricity', 'road_transport', 'sanitation', 'general']
        self.priorities = ['low', 'medium', 'high']
        
    def create_training_data(self) -> Tuple[pd.DataFrame, pd.Series, pd.Series]:
        """Create synthetic training data for demonstration"""
        # Sample training data
        training_data = [
            # Water complaints
            ("water pipe burst in main street flooding area", "water", "high"),
            ("no water supply for 3 days in residential area", "water", "high"),
            ("low water pressure in apartment building", "water", "medium"),
            ("dirty water coming from taps", "water", "high"),
            ("water bill is too high", "water", "low"),
            ("leaking water meter", "water", "medium"),
            
            # Electricity complaints
            ("power outage for 6 hours", "electricity", "high"),
            ("electric pole damaged after storm", "electricity", "high"),
            ("flickering lights in entire neighborhood", "electricity", "medium"),
            ("high electricity bill this month", "electricity", "low"),
            ("new electricity connection needed", "electricity", "medium"),
            ("street lights not working", "electricity", "medium"),
            
            # Road complaints
            ("huge pothole on main highway", "road_transport", "high"),
            ("road completely damaged due to rain", "road_transport", "high"),
            ("traffic signal not working", "road_transport", "medium"),
            ("no street lights on dark road", "road_transport", "medium"),
            ("road construction causing traffic jam", "road_transport", "low"),
            ("broken speed bump", "road_transport", "low"),
            
            # Sanitation complaints
            ("garbage not collected for 2 weeks", "sanitation", "high"),
            ("sewage overflow in residential area", "sanitation", "high"),
            ("public toilets very dirty", "sanitation", "medium"),
            ("drainage blocked causing water logging", "sanitation", "high"),
            ("no garbage bins in area", "sanitation", "low"),
            ("street cleaning needed", "sanitation", "medium"),
            
            # General complaints
            ("noise pollution from construction site", "general", "medium"),
            ("illegal construction in neighborhood", "general", "medium"),
            ("parking issues in market area", "general", "low"),
            ("need more public parks", "general", "low"),
            ("corruption in municipal office", "general", "high"),
            ("slow response from officials", "general", "medium")
        ]
        
        df = pd.DataFrame(training_data, columns=['complaint', 'category', 'priority'])
        return df
    
    def train_models(self):
        """Train both category and priority classification models"""
        df = self.create_training_data()
        
        # Preprocess the text
        df['processed_text'] = df['complaint'].apply(self.preprocessor.preprocess)
        
        X = df['processed_text']
        y_category = df['category']
        y_priority = df['priority']
        
        # Split data
        X_train, X_test, y_cat_train, y_cat_test = train_test_split(
            X, y_category, test_size=0.2, random_state=42, stratify=y_category
        )
        _, _, y_pri_train, y_pri_test = train_test_split(
            X, y_priority, test_size=0.2, random_state=42, stratify=y_priority
        )
        
        # Create category classification pipeline
        self.category_pipeline = Pipeline([
            ('tfidf', TfidfVectorizer(max_features=1000, ngram_range=(1, 2))),
            ('classifier', MultinomialNB(alpha=0.1))
        ])
        
        # Create priority classification pipeline
        self.priority_pipeline = Pipeline([
            ('tfidf', TfidfVectorizer(max_features=1000, ngram_range=(1, 2))),
            ('classifier', LogisticRegression(random_state=42, max_iter=1000))
        ])
        
        # Train models
        self.category_pipeline.fit(X_train, y_cat_train)
        self.priority_pipeline.fit(X_train, y_pri_train)
        
        # Evaluate models
        cat_pred = self.category_pipeline.predict(X_test)
        pri_pred = self.priority_pipeline.predict(X_test)
        
        print("Category Classification Report:")
        print(classification_report(y_cat_test, cat_pred))
        print(f"Category Accuracy: {accuracy_score(y_cat_test, cat_pred):.2f}")
        
        print("\nPriority Classification Report:")
        print(classification_report(y_pri_test, pri_pred))
        print(f"Priority Accuracy: {accuracy_score(y_pri_test, pri_pred):.2f}")
    
    def predict(self, complaint_text: str) -> Dict[str, Any]:
        """Predict category and priority for a new complaint"""
        if not self.category_pipeline or not self.priority_pipeline:
            raise ValueError("Models not trained. Call train_models() first.")
        
        # Preprocess the input text
        processed_text = self.preprocessor.preprocess(complaint_text)
        
        # Predict category
        category = self.category_pipeline.predict([processed_text])[0]
        category_proba = self.category_pipeline.predict_proba([processed_text])[0]
        category_confidence = max(category_proba)
        
        # Predict priority
        priority = self.priority_pipeline.predict([processed_text])[0]
        priority_proba = self.priority_pipeline.predict_proba([processed_text])[0]
        priority_confidence = max(priority_proba)
        
        return {
            'category': category,
            'category_confidence': float(category_confidence),
            'priority': priority,
            'priority_confidence': float(priority_confidence),
            'processed_text': processed_text
        }
    
    def save_models(self, category_path: str, priority_path: str):
        """Save trained models to disk"""
        with open(category_path, 'wb') as f:
            pickle.dump(self.category_pipeline, f)
        with open(priority_path, 'wb') as f:
            pickle.dump(self.priority_pipeline, f)
    
    def load_models(self, category_path: str, priority_path: str):
        """Load trained models from disk"""
        with open(category_path, 'rb') as f:
            self.category_pipeline = pickle.load(f)
        with open(priority_path, 'rb') as f:
            self.priority_pipeline = pickle.load(f)
