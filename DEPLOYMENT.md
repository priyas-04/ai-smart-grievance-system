# 🚀 Quick Deployment Guide

## 📱 Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Connect your GitHub repository: `priyas-04/ai-smart-grievance-system`
4. Select the `frontend` folder
5. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
6. Click "Deploy"

## 🔧 Deploy Backend to Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. "Deploy from GitHub repo"
4. Select `ai-smart-grievance-system`
5. Add PostgreSQL service
6. Add environment variables (from `backend/.env.production.example`):
   ```
   DATABASE_URL=postgresql://username:password@host:port/database
   SECRET_KEY=your-super-secret-production-key-change-this
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=60
   ```
7. Click "Deploy"

## 🔗 Connect Frontend to Backend

1. Copy your Railway backend URL
2. Update `VITE_API_URL` in Vercel dashboard
3. Redeploy frontend

## 🧪 Test Your Application

- **Frontend**: Your Vercel URL
- **Backend**: Your Railway URL
- **API Docs**: Your Railway URL + `/docs`

## 💡 Free Tier Limits

- **Vercel**: 100GB bandwidth/month
- **Railway**: 500 hours/month, 1GB RAM, 1GB PostgreSQL

## 🎯 Expected URLs

```
Frontend: https://ai-smart-grievance-system.vercel.app
Backend: https://ai-smart-grievance-system-production.railway.app
```

## 🔑 Default Credentials

- **Admin**: admin@resolveai.com / admin123
- **Citizen Registration**: Available on signup page
- **Officers**: Created by admin only

**🚀 Your AI Smart Grievance System will be live!**
