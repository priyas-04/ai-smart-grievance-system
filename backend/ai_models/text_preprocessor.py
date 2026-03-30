import re
import string
from typing import List
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/stopwords')
    nltk.data.find('corpora/wordnet')
    nltk.data.find('taggers/averaged_perceptron_tagger')
except LookupError:
    nltk.download('punkt')
    nltk.download('stopwords')
    nltk.download('wordnet')
    nltk.download('averaged_perceptron_tagger')

class TextPreprocessor:
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))
        self.lemmatizer = WordNetLemmatizer()
        
    def clean_text(self, text: str) -> str:
        """Clean and preprocess text data"""
        if not text:
            return ""
        
        # Convert to lowercase
        text = text.lower()
        
        # Remove URLs
        text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
        
        # Remove email addresses
        text = re.sub(r'\S+@\S+', '', text)
        
        # Remove phone numbers
        text = re.sub(r'\d{10}|\d{3}-\d{3}-\d{4}', '', text)
        
        # Remove special characters and numbers
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def tokenize_and_remove_stopwords(self, text: str) -> List[str]:
        """Tokenize text and remove stopwords"""
        if not text:
            return []
        
        tokens = word_tokenize(text)
        
        # Remove stopwords and single characters
        tokens = [token for token in tokens if token not in self.stop_words and len(token) > 2]
        
        return tokens
    
    def lemmatize_tokens(self, tokens: List[str]) -> List[str]:
        """Lemmatize tokens to their base form"""
        return [self.lemmatizer.lemmatize(token) for token in tokens]
    
    def preprocess(self, text: str) -> str:
        """Complete preprocessing pipeline"""
        # Clean text
        cleaned_text = self.clean_text(text)
        
        # Tokenize and remove stopwords
        tokens = self.tokenize_and_remove_stopwords(cleaned_text)
        
        # Lemmatize
        lemmatized_tokens = self.lemmatize_tokens(tokens)
        
        # Join back to string
        return ' '.join(lemmatized_tokens)
    
    def preprocess_batch(self, texts: List[str]) -> List[str]:
        """Preprocess a batch of texts"""
        return [self.preprocess(text) for text in texts]
