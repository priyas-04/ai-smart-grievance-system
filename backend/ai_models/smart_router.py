from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from models.complaint import ComplaintCategory, ComplaintPriority
from models.department import Department
from .complaint_classifier import ComplaintClassifier
import os

class SmartRouter:
    def __init__(self):
        self.classifier = ComplaintClassifier()
        self.models_loaded = False
        
        # Load pre-trained models if available
        try:
            category_path = 'ai_models/saved_models/category_classifier.pkl'
            priority_path = 'ai_models/saved_models/priority_classifier.pkl'
            
            if os.path.exists(category_path) and os.path.exists(priority_path):
                self.classifier.load_models(category_path, priority_path)
                self.models_loaded = True
                print("✅ AI models loaded successfully")
            else:
                print("⚠️  Pre-trained models not found. Training new models...")
                self.classifier.train_models()
                self.classifier.save_models(category_path, priority_path)
                self.models_loaded = True
        except Exception as e:
            print(f"❌ Error loading AI models: {e}")
            self.models_loaded = False
    
    def route_complaint(self, complaint_text: str, db: Session) -> Dict[str, Any]:
        """
        Route complaint to appropriate department and predict priority
        """
        if not self.models_loaded:
            # Fallback to general department and medium priority
            return self._fallback_routing(complaint_text, db)
        
        try:
            # Get AI prediction
            prediction = self.classifier.predict(complaint_text)
            
            # Map category to department
            department_id = self._get_department_id(prediction['category'], db)
            
            # Convert string enums to actual enum objects
            category_enum = ComplaintCategory(prediction['category'])
            priority_enum = ComplaintPriority(prediction['priority'])
            
            return {
                'category': category_enum,
                'priority': priority_enum,
                'department_id': department_id,
                'confidence': {
                    'category': prediction['category_confidence'],
                    'priority': prediction['priority_confidence']
                },
                'routing_method': 'ai',
                'processed_text': prediction['processed_text']
            }
            
        except Exception as e:
            print(f"Error in AI routing: {e}")
            return self._fallback_routing(complaint_text, db)
    
    def _get_department_id(self, category: str, db: Session) -> int:
        """Map complaint category to department ID"""
        category_to_department = {
            'water': 'Water Department',
            'electricity': 'Electricity Department',
            'road_transport': 'Road & Transport Department',
            'sanitation': 'Sanitation Department',
            'general': 'General Administration'
        }
        
        department_name = category_to_department.get(category, 'General Administration')
        department = db.query(Department).filter(Department.name == department_name).first()
        
        if department:
            return department.id
        else:
            # Fallback to General Administration
            general_dept = db.query(Department).filter(Department.name == 'General Administration').first()
            return general_dept.id if general_dept else 1
    
    def _fallback_routing(self, complaint_text: str, db: Session) -> Dict[str, Any]:
        """Fallback routing when AI models are not available"""
        # Simple keyword-based routing as fallback
        text_lower = complaint_text.lower()
        
        if any(keyword in text_lower for keyword in ['water', 'pipe', 'leak', 'flood']):
            category = ComplaintCategory.WATER
            priority = ComplaintPriority.HIGH
        elif any(keyword in text_lower for keyword in ['power', 'electricity', 'outage', 'light']):
            category = ComplaintCategory.ELECTRICITY
            priority = ComplaintPriority.HIGH
        elif any(keyword in text_lower for keyword in ['road', 'pothole', 'traffic', 'street']):
            category = ComplaintCategory.ROAD_TRANSPORT
            priority = ComplaintPriority.MEDIUM
        elif any(keyword in text_lower for keyword in ['garbage', 'trash', 'sewage', 'clean']):
            category = ComplaintCategory.SANITATION
            priority = ComplaintPriority.MEDIUM
        else:
            category = ComplaintCategory.GENERAL
            priority = ComplaintPriority.LOW
        
        department_id = self._get_department_id(category.value, db)
        
        return {
            'category': category,
            'priority': priority,
            'department_id': department_id,
            'confidence': {'category': 0.5, 'priority': 0.5},
            'routing_method': 'fallback',
            'processed_text': text_lower
        }
    
    def is_high_priority(self, complaint_text: str) -> bool:
        """Check if complaint should be marked as high priority based on keywords"""
        high_priority_keywords = [
            'emergency', 'urgent', 'dangerous', 'accident', 'injury',
            'burst', 'overflow', 'blocked', 'no water', 'no power',
            'flooding', 'fire', 'hazard', 'unsafe'
        ]
        
        text_lower = complaint_text.lower()
        return any(keyword in text_lower for keyword in high_priority_keywords)

# Global router instance
router = SmartRouter()
