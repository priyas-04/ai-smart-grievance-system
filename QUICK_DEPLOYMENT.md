# 🚀 Quick Online Deployment Guide

## 🌐 Option: Vercel + Railway (Recommended for Beginners)

This is the fastest way to get your AI Smart Grievance System online with free tiers available.

---

## 📋 Prerequisites

- **GitHub Account** (for code hosting)
- **Vercel Account** (for frontend hosting)
- **Railway Account** (for backend hosting)
- **Credit Card** (for verification, free tier available)

---

## 🎯 Step 1: Prepare Your Code

### 1.1 Create GitHub Repository
```bash
# Initialize git if not already done
cd ai-smart-grievance-system
git init
git add .
git commit -m "Initial commit - AI Smart Grievance System"

# Create repository on GitHub first, then:
git remote add origin https://github.com/yourusername/ai-smart-grievance-system.git
git push -u origin main
```

### 1.2 Update Environment Variables
Create `backend/.env.production`:
```bash
DATABASE_URL=postgresql://username:password@host:port/database
SECRET_KEY=your-super-secret-production-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

---

## 🎨 Step 2: Deploy Frontend to Vercel

### 2.1 Connect Vercel to GitHub
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the `frontend` folder

### 2.2 Configure Vercel Settings
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

### 2.3 Add Environment Variables in Vercel
```
VITE_API_URL=https://your-backend-url.railway.app
```

### 2.4 Deploy
- Click "Deploy"
- Wait for deployment to complete
- Your frontend will be available at: `https://your-project-name.vercel.app`

---

## 🔧 Step 3: Deploy Backend to Railway

### 3.1 Connect Railway to GitHub
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. "Deploy from GitHub repo"
4. Select your repository

### 3.2 Configure Railway Settings
```dockerfile
# Railway will automatically detect your Dockerfile
# Make sure backend/Dockerfile exists
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8001

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
```

### 3.3 Add Environment Variables in Railway
```
DATABASE_URL=postgresql://username:password@host:port/database
SECRET_KEY=your-super-secret-production-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### 3.4 Set Up PostgreSQL Database
1. In Railway project, click "New Service"
2. Select "PostgreSQL"
3. Railway will provide connection string
4. Copy the connection string to your environment variables

### 3.5 Deploy Backend
- Click "Deploy"
- Railway will build and deploy your backend
- Your API will be available at: `https://your-service-name.railway.app`

---

## 🔗 Step 4: Connect Frontend to Backend

### 4.1 Update Frontend Environment
In Vercel dashboard, update environment variable:
```
VITE_API_URL=https://your-backend-service-name.railway.app
```

### 4.2 Redeploy Frontend
- In Vercel dashboard, click "Redeploy"
- This will update the frontend with the correct backend URL

---

## 🧪 Step 5: Test Your Live Application

### 5.1 Verify Backend API
```bash
curl https://your-backend-url.railway.app/api/health
```

### 5.2 Test Frontend
- Visit your Vercel URL
- Try registering a new citizen account
- Test login functionality
- Verify all features work

---

## 📊 Free Tier Limits (2024)

### Vercel (Frontend)
- ✅ **100GB Bandwidth** per month
- ✅ **Unlimited Static Sites**
- ✅ **Custom Domains** supported
- ✅ **Automatic HTTPS**

### Railway (Backend)
- ✅ **500 Hours** per month (enough for 24/7)
- ✅ **1GB RAM** per service
- ✅ **1GB Storage** for PostgreSQL
- ✅ **Custom Domains** supported

---

## 🔧 Alternative Options

### Option 2: Netlify + Render
- **Frontend**: Netlify (similar to Vercel)
- **Backend**: Render (alternative to Railway)
- **Cost**: Similar free tiers

### Option 3: Vercel + Supabase
- **Frontend**: Vercel
- **Backend**: Supabase (PostgreSQL + API)
- **Advantage**: Built-in database and auth

### Option 4: AWS Free Tier
- **Frontend**: AWS S3 + CloudFront
- **Backend**: AWS EC2 + RDS
- **Complexity**: Higher, but more control

---

## 🎯 Expected URLs After Deployment

### Your Live Application
```
Frontend: https://your-project-name.vercel.app
Backend API: https://your-service-name.railway.app
API Docs: https://your-service-name.railway.app/docs
```

### Example URLs
```
Frontend: https://resolveai-grievance.vercel.app
Backend: https://resolveai-backend-production.railway.app
```

---

## 🔐 Production Checklist

### Security
- [ ] **Change default passwords** and secret keys
- [ ] **Use HTTPS** (automatically provided by Vercel/Railway)
- [ ] **Set up CORS** for your frontend domain
- [ ] **Database security** with strong passwords

### Performance
- [ ] **Enable caching** in Vercel
- [ ] **Monitor resource usage** in Railway
- [ ] **Set up alerts** for downtime
- [ ] **Regular backups** of database

### Monitoring
- [ ] **Vercel Analytics** for frontend performance
- [ ] **Railway Logs** for backend monitoring
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

### Backend (Railway CLI)
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

---

## 📞 Support & Troubleshooting

### Common Issues
1. **CORS Errors**: Update backend CORS settings
2. **Database Connection**: Verify Railway PostgreSQL connection string
3. **Environment Variables**: Ensure all variables are set in both platforms
4. **Build Failures**: Check logs in Vercel/Railway dashboards

### Getting Help
- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **GitHub Issues**: Create issues in your repository

---

## 🎊 Congratulations! 

Your AI Smart Grievance System is now **live on the internet** with:
- ✅ **Global CDN** for fast frontend loading
- ✅ **Secure HTTPS** connections
- ✅ **Scalable backend** with PostgreSQL
- ✅ **Free hosting** for development and small projects
- ✅ **Custom domain** support when ready

**🌐 Your application is now accessible to users worldwide!**
