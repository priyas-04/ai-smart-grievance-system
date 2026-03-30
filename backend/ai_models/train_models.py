#!/usr/bin/env python3
"""
Training script for AI models
Run this script to train and save the complaint classification models
"""

import os
import sys
from pathlib import Path

# Add parent directory to Python path
sys.path.append(str(Path(__file__).parent.parent))

from ai_models.complaint_classifier import ComplaintClassifier

def main():
    print("🤖 Training ResolveAI Complaint Classification Models...")
    
    # Initialize classifier
    classifier = ComplaintClassifier()
    
    # Train models
    print("📚 Training models on sample data...")
    classifier.train_models()
    
    # Create models directory if it doesn't exist
    os.makedirs('ai_models/saved_models', exist_ok=True)
    
    # Save models
    category_path = 'ai_models/saved_models/category_classifier.pkl'
    priority_path = 'ai_models/saved_models/priority_classifier.pkl'
    
    print(f"💾 Saving models to {category_path} and {priority_path}")
    classifier.save_models(category_path, priority_path)
    
    print("✅ Models trained and saved successfully!")
    
    # Test prediction
    test_complaints = [
        "Water pipe burst in my area and flooding the streets",
        "Power outage for the last 5 hours",
        "Huge pothole on main road causing accidents",
        "Garbage not collected for 2 weeks",
        "Need new electricity connection"
    ]
    
    print("\n🧪 Testing predictions:")
    for complaint in test_complaints:
        result = classifier.predict(complaint)
        print(f"\nComplaint: {complaint}")
        print(f"Category: {result['category']} (confidence: {result['category_confidence']:.2f})")
        print(f"Priority: {result['priority']} (confidence: {result['priority_confidence']:.2f})")

if __name__ == "__main__":
    main()
