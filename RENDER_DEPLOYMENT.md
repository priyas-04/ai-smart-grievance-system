# 🚀 Render Deployment Guide

## 📋 Quick Setup for Render

Your AI Smart Grievance System is now **Render-ready** with the following files:

- ✅ `requirements.txt` - Python dependencies
- ✅ `main.py` - Entry point for Render
- ✅ `render.yaml` - Render configuration

## 🚀 Deploy to Render

### Step 1: Go to Render
1. Visit [render.com](https://render.com)
2. Sign up/login with GitHub

### Step 2: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `priyas-04/ai-smart-grievance-system`
3. Select **"Python 3"** as the environment
4. Render will auto-detect your settings from `render.yaml`

### Step 3: Configure Environment
Render will automatically:
- ✅ Install dependencies from `requirements.txt`
- ✅ Create PostgreSQL database
- ✅ Set environment variables
- ✅ Start your application

### Step 4: Deploy
- Click **"Create Web Service"**
- Wait for deployment to complete (2-3 minutes)

## 🌐 Your Live Application

After deployment, you'll get:
- **Backend URL**: `https://your-service-name.onrender.com`
- **Database**: PostgreSQL automatically provisioned
- **Health Check**: Available at `/health`

## 📱 Deploy Frontend to Vercel

### Step 1: Go to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Connect your GitHub repository

### Step 2: Configure Frontend
1. Select **`frontend` folder**
2. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-name.onrender.com
   ```

### Step 3: Deploy
- Click **"Deploy"**
- Wait for deployment to complete

## 🔗 Connect Frontend & Backend

1. Copy your Render backend URL
2. Update `VITE_API_URL` in Vercel dashboard
3. Redeploy frontend

## 🎯 Expected URLs

- **Backend**: `https://ai-smart-grievance-system.onrender.com`
- **Frontend**: `https://ai-smart-grievance-system.vercel.app`
- **API Docs**: `https://ai-smart-grievance-system.onrender.com/docs`

## 💡 Render Benefits

- ✅ **Free Tier** Available
- ✅ **Automatic HTTPS**
- ✅ **PostgreSQL Included**
- ✅ **Easy GitHub Integration**
- ✅ **Auto-Deploys** on push

## 🔧 Troubleshooting

### Common Issues:
1. **Build Failed**: Check that all files are pushed to GitHub
2. **Database Connection**: Verify DATABASE_URL environment variable
3. **Port Issues**: Render uses dynamic PORT variable
4. **Import Errors**: Backend modules must be accessible

### Solutions:
1. **Re-deploy**: Push changes and trigger new deploy
2. **Check Logs**: View build logs in Render dashboard
3. **Environment**: Verify all environment variables are set
4. **Health Check**: Visit `/health` endpoint to test

## 🎉 Success!

Your AI Smart Grievance System will be live with:
- ✅ **Production Database** (PostgreSQL)
- ✅ **Secure HTTPS** connections
- ✅ **AI-Powered** routing
- ✅ **Role-Based Access** control
- ✅ **Citizen-Only** registration

**🚀 Your application is now live on Render + Vercel!**
