# Backend Setup Guide

## Quick Setup Instructions

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Train AI Models
Choose ONE of the following methods:

#### Method 1: From backend directory (Recommended)
```bash
cd backend
python train_models.py
```

#### Method 2: From backend directory (Alternative)
```bash
cd backend
python -m ai_models.train_models
```

#### Method 3: From ai_models directory
```bash
cd backend/ai_models
python train_models.py
```

### 3. Setup Database
```bash
# Create MySQL database first, then run:
python database/seed_data.py
```

### 4. Start Server
```bash
python main.py
```

## Troubleshooting

### ModuleNotFoundError: No module named 'ai_models'
This error occurs when Python can't find the ai_models package. Use Method 1 or 2 above.

### NLTK Download Issues
If you get NLTK download errors, run:
```bash
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet'); nltk.download('averaged_perceptron_tagger')"
```

### Database Connection Issues
1. Make sure MySQL is running
2. Update .env file with correct database credentials
3. Create the database: `CREATE DATABASE resolveai_db;`

## Environment Variables
Copy `.env` file and update:
```env
DATABASE_URL=mysql+pymysql://username:password@localhost/resolveai_db
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```
