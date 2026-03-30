# 🚀 AI Smart Grievance System - Render + Railway + Vercel Deployment

## 🌐 Deployment Architecture
- **Frontend**: Vercel (Static hosting)
- **Backend**: Render (Python/FastAPI)
- **Database**: Railway (MySQL)

---

## 📋 Prerequisites

- **GitHub Account** (for code hosting)
- **Vercel Account** (for frontend hosting)
- **Render Account** (for backend hosting)
- **Railway Account** (for MySQL database)
- **Credit Card** (for verification, free tiers available)

---

## 🎯 Step 1: Prepare Your Code

### 1.1 Update Database Configuration
Create `backend/.env.production`:
```bash
DATABASE_URL=mysql://username:password@host:port/database
SECRET_KEY=your-super-secret-production-key-change-this-$(date +%s)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### 1.2 Update Backend for MySQL
Update `backend/requirements.txt` to include MySQL:
```txt
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
pydantic==2.5.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
scikit-learn==1.3.2
nltk==3.8.1
pandas==2.1.4
numpy==1.24.3
PyMySQL==1.1.0  # Add this for MySQL
```

### 1.3 Update Database Connection
Update `backend/database/database.py` for MySQL:
```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Use PyMySQL for MySQL
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://user:password@localhost/dbname")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

---

## 🎨 Step 2: Deploy Database to Railway (MySQL)

### 2.1 Create MySQL Service
1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"MySQL"** (not PostgreSQL)
4. Railway will create MySQL database
5. Copy the connection string

### 2.2 Configure MySQL
Your Railway MySQL connection string will look like:
```
mysql://user:password@containers-us-west-xxx.railway.app:port/railway
```

### 2.3 Add Environment Variables in Railway
```
DATABASE_URL=mysql://user:password@host:port/database
SECRET_KEY=your-super-secret-production-key-change-this-$(date +%s)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

**Note**: Use the exact connection string Railway provides (starts with `mysql://`)

---

## 🔧 Step 3: Deploy Backend to Render

### 3.1 Connect Render to GitHub
1. Go to [render.com](https://render.com)
2. Click **"New +"**
3. Select **"Web Service"**
4. **"Connect a repository"**
5. Select your GitHub repository

### 3.2 Configure Render Service
```yaml
# render.yaml (create this file)
services:
  - type: web
    name: ai-smart-grievance-backend
    env: python
    plan: free
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: SECRET_KEY
        sync: false
      - key: ALGORITHM
        value: HS256
      - key: ACCESS_TOKEN_EXPIRE_MINUTES
        value: 60
```

### 3.3 Add Environment Variables in Render
```
DATABASE_URL=mysql://railway-user:password@containers-us-west-xxx.railway.app:port/railway
SECRET_KEY=your-super-secret-production-key-change-this-$(date +%s)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

**Important**: Use the exact Railway MySQL connection string (starts with `mysql://`) - the system will automatically convert it to `mysql+pymysql://` for SQLAlchemy.

### 3.4 Deploy Backend
- Click **"Create Web Service"**
- Render will build and deploy your backend
- Your API will be available at: `https://your-service-name.onrender.com`

---

## 📱 Step 4: Deploy Frontend to Vercel

### 4.1 Connect Vercel to GitHub
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repository
4. Select the `frontend` folder

### 4.2 Configure Vercel Settings
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

### 4.3 Add Environment Variables in Vercel
```
VITE_API_URL=https://your-service-name.onrender.com
```

### 4.4 Deploy Frontend
- Click **"Deploy"**
- Wait for deployment to complete
- Your frontend will be available at: `https://your-project-name.vercel.app`

---

## 🔗 Step 5: Connect Frontend to Backend

### 5.1 Update Frontend Environment
In Vercel dashboard, update environment variable:
```
VITE_API_URL=https://your-service-name.onrender.com
```

### 5.2 Redeploy Frontend
- In Vercel dashboard, click **"Redeploy"**
- This will update the frontend with the correct backend URL

---

## 🧪 Step 6: Test Your Live Application

### 6.1 Verify Backend API
```bash
curl https://your-service-name.onrender.com/api/health
```

### 6.2 Test Frontend
- Visit your Vercel URL
- Try registering a new citizen account
- Test login functionality
- Verify all features work

### 6.3 Test Database Connection
- Check if citizen registration creates records in Railway MySQL
- Verify admin can access user management
- Test complaint submission and routing

---

## 📊 Free Tier Limits (2024)

### Vercel (Frontend)
- ✅ **100GB Bandwidth** per month
- ✅ **Unlimited Static Sites**
- ✅ **Custom Domains** supported
- ✅ **Automatic HTTPS**

### Render (Backend)
- ✅ **750 Hours** per month (enough for 24/7)
- ✅ **512MB RAM** per service
- ✅ **Shared CPU**
- ✅ **Custom Domains** supported

### Railway (MySQL Database)
- ✅ **500MB Storage** for MySQL
- ✅ **10,000 Rows** limit
- ✅ **100 Connections** limit
- ✅ **Automatic Backups**

---

## 🔧 Alternative Database Options

### Option 2: PlanetScale
- **MySQL-compatible** database
- **Free tier** available
- **Better scaling** options

### Option 3: Supabase
- **PostgreSQL** with MySQL compatibility
- **Free tier** available
- **Built-in auth** and APIs

---

## 🎯 Expected URLs After Deployment

### Your Live Application
```
Frontend: https://your-project-name.vercel.app
Backend API: https://your-service-name.onrender.com
API Docs: https://your-service-name.onrender.com/docs
Database: Railway MySQL (managed)
```

### Example URLs
```
Frontend: https://resolveai-grievance.vercel.app
Backend: https://resolveai-backend.onrender.com
Database: MySQL on Railway
```

---

## 🔐 Production Checklist

### Security
- [ ] **Change default passwords** and secret keys
- [ ] **Use HTTPS** (automatically provided by Vercel/Render)
- [ ] **Set up CORS** for your frontend domain
- [ ] **Database security** with strong passwords
- [ ] **Environment variables** properly configured

### Performance
- [ ] **Enable caching** in Vercel
- [ ] **Monitor resource usage** in Render
- [ ] **Optimize database queries** for MySQL
- [ ] **Set up alerts** for downtime
- [ ] **Regular backups** of MySQL database

### Monitoring
- [ ] **Vercel Analytics** for frontend performance
- [ ] **Render Logs** for backend monitoring
- [ ] **Railway Metrics** for database performance
- [ ] **Error tracking** setup
- [ ] **Uptime monitoring** for API

---

## 🚀 Quick Deploy Commands

### Frontend (Vercel CLI)
```bash
npm install -g vercel
cd frontend
vercel --prod
```

### Backend (Render CLI)
```bash
# Render uses GitHub integration
# Push to main branch triggers deployment
git push origin main
```

---

## 📞 Support & Troubleshooting

### Common Issues
1. **CORS Errors**: Update backend CORS settings for Render
2. **Database Connection**: Verify Railway MySQL connection string
3. **Environment Variables**: Ensure all variables are set in all platforms
4. **Build Failures**: Check logs in Vercel/Render dashboards
5. **MySQL Connection**: Ensure PyMySQL is installed and configured

### MySQL Specific Issues
1. **Connection Timeout**: Check Railway MySQL service status
2. **Authentication Error**: Verify MySQL credentials in connection string
3. **Database Not Found**: Ensure database name is correct in Railway
4. **Permission Denied**: Check MySQL user permissions

### Getting Help
- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Railway Docs**: https://docs.railway.app
- **GitHub Issues**: Create issues in your repository

---

## 🎊 Congratulations! 

Your AI Smart Grievance System is now **live on the internet** with:
- ✅ **Global CDN** for fast frontend loading
- ✅ **Secure HTTPS** connections
- ✅ **Scalable backend** with Render
- ✅ **MySQL database** with Railway
- ✅ **Free hosting** for development and small projects
- ✅ **Custom domain** support when ready

**🌐 Your application is now accessible to users worldwide!**
