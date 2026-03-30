#!/bin/bash

# 🚀 AI Smart Grievance System - Quick Online Deployment Script
# This script helps you deploy to Vercel (frontend) + Railway (backend)

echo "🌐 AI Smart Grievance System - Quick Online Deployment"
echo "=================================================="

# Check prerequisites
check_prereqs() {
    echo "📋 Checking prerequisites..."
    
    # Check if git is installed
    if ! command -v git &> /dev/null; then
        echo "❌ Git is not installed. Please install Git first."
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        echo "❌ npm is not installed. Please install Node.js first."
        exit 1
    fi
    
    echo "✅ Prerequisites check passed!"
}

# Prepare the project
prepare_project() {
    echo "🔧 Preparing project for deployment..."
    
    # Create production environment file
    echo "📝 Creating production environment file..."
    cat > backend/.env.production << EOF
DATABASE_URL=postgresql://username:password@host:port/database
SECRET_KEY=your-super-secret-production-key-change-this-$(date +%s)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
EOF
    
    # Create vercel.json for frontend
    echo "📝 Creating Vercel configuration..."
    cat > frontend/vercel.json << EOF
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
EOF
    
    echo "✅ Project preparation completed!"
}

# Initialize Git repository
init_git() {
    echo "📦 Initializing Git repository..."
    
    if [ ! -d ".git" ]; then
        git init
        echo "🔑 Created new Git repository"
    fi
    
    git add .
    git commit -m "Ready for deployment - AI Smart Grievance System"
    
    echo "✅ Git repository ready!"
    echo "📋 Next steps:"
    echo "   1. Create a GitHub repository at https://github.com/new"
    echo "   2. Run: git remote add origin https://github.com/yourusername/ai-smart-grievance-system.git"
    echo "   3. Run: git push -u origin main"
}

# Deploy instructions
deploy_instructions() {
    echo ""
    echo "🚀 DEPLOYMENT INSTRUCTIONS"
    echo "=========================="
    echo ""
    echo "📱 Step 1: Deploy Frontend to Vercel"
    echo "------------------------------------"
    echo "1. Go to https://vercel.com"
    echo "2. Click 'New Project'"
    echo "3. Connect your GitHub repository"
    echo "4. Select the 'frontend' folder"
    echo "5. Add environment variable: VITE_API_URL=https://your-backend-url.railway.app"
    echo "6. Click 'Deploy'"
    echo ""
    echo "🔧 Step 2: Deploy Backend to Railway"
    echo "------------------------------------"
    echo "1. Go to https://railway.app"
    echo "2. Click 'New Project'"
    echo "3. 'Deploy from GitHub repo'"
    echo "4. Select your repository"
    echo "5. Add PostgreSQL service"
    echo "6. Add environment variables from backend/.env.production"
    echo "7. Click 'Deploy'"
    echo ""
    echo "🔗 Step 3: Connect Frontend to Backend"
    echo "--------------------------------------"
    echo "1. Copy your Railway backend URL"
    echo "2. Update VITE_API_URL in Vercel dashboard"
    echo "3. Redeploy frontend"
    echo ""
    echo "🧪 Step 4: Test Your Live App"
    echo "------------------------------"
    echo "1. Visit your Vercel URL"
    echo "2. Test citizen registration"
    echo "3. Test admin login (admin@resolveai.com / admin123)"
    echo "4. Verify all features work"
    echo ""
    echo "📊 Expected URLs:"
    echo "Frontend: https://your-project-name.vercel.app"
    echo "Backend: https://your-service-name.railway.app"
    echo ""
    echo "💡 Tips:"
    echo "- Both Vercel and Railway have free tiers"
    echo "- You'll need a credit card for verification (free tier still applies)"
    echo "- Update your SECRET_KEY before production deployment"
    echo "- Set up custom domains when ready"
    echo ""
    echo "🎉 Your AI Smart Grievance System will be live on the internet!"
}

# Main execution
main() {
    check_prereqs
    prepare_project
    init_git
    deploy_instructions
}

# Run the script
main
