# 🚀 AI Smart Grievance System - Quick Online Deployment Script (PowerShell)
# This script helps you deploy to Vercel (frontend) + Railway (backend)

Write-Host "🌐 AI Smart Grievance System - Quick Online Deployment" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Check prerequisites
function Check-Prerequisites {
    Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow
    
    # Check if git is installed
    try {
        git --version | Out-Null
        Write-Host "✅ Git is installed" -ForegroundColor Green
    } catch {
        Write-Host "❌ Git is not installed. Please install Git first." -ForegroundColor Red
        exit 1
    }
    
    # Check if npm is installed
    try {
        npm --version | Out-Null
        Write-Host "✅ npm is installed" -ForegroundColor Green
    } catch {
        Write-Host "❌ npm is not installed. Please install Node.js first." -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Prerequisites check passed!" -ForegroundColor Green
}

# Prepare the project
function Prepare-Project {
    Write-Host "🔧 Preparing project for deployment..." -ForegroundColor Yellow
    
    # Create production environment file
    Write-Host "📝 Creating production environment file..." -ForegroundColor Yellow
    $timestamp = Get-Date -UFormat %s
    $envContent = @"
DATABASE_URL=postgresql://username:password@host:port/database
SECRET_KEY=your-super-secret-production-key-change-this-$timestamp
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
"@
    $envContent | Out-File -FilePath "backend/.env.production" -Encoding UTF8
    Write-Host "✅ Created backend/.env.production" -ForegroundColor Green
    
    # Create vercel.json for frontend
    Write-Host "📝 Creating Vercel configuration..." -ForegroundColor Yellow
    $vercelConfig = @{
        version = 2
        builds = @(
            @{
                src = "package.json"
                use = "@vercel/static-build"
                config = @{
                    distDir = "dist"
                }
            }
        )
        routes = @(
            @{
                src = "/(.*)"
                dest = "/index.html"
            }
        )
    }
    $vercelConfig | ConvertTo-Json -Depth 3 | Out-File -FilePath "frontend/vercel.json" -Encoding UTF8
    Write-Host "✅ Created frontend/vercel.json" -ForegroundColor Green
    
    Write-Host "✅ Project preparation completed!" -ForegroundColor Green
}

# Initialize Git repository
function Initialize-Git {
    Write-Host "📦 Initializing Git repository..." -ForegroundColor Yellow
    
    if (-not (Test-Path ".git")) {
        git init
        Write-Host "🔑 Created new Git repository" -ForegroundColor Green
    }
    
    git add .
    git commit -m "Ready for deployment - AI Smart Grievance System"
    
    Write-Host "✅ Git repository ready!" -ForegroundColor Green
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Create a GitHub repository at https://github.com/new" -ForegroundColor White
    Write-Host "   2. Run: git remote add origin https://github.com/yourusername/ai-smart-grievance-system.git" -ForegroundColor White
    Write-Host "   3. Run: git push -u origin main" -ForegroundColor White
}

# Deploy instructions
function Show-DeployInstructions {
    Write-Host ""
    Write-Host "🚀 DEPLOYMENT INSTRUCTIONS" -ForegroundColor Green
    Write-Host "==========================" -ForegroundColor Green
    Write-Host ""
    Write-Host "📱 Step 1: Deploy Frontend to Vercel" -ForegroundColor Cyan
    Write-Host "------------------------------------" -ForegroundColor Cyan
    Write-Host "1. Go to https://vercel.com" -ForegroundColor White
    Write-Host "2. Click 'New Project'" -ForegroundColor White
    Write-Host "3. Connect your GitHub repository" -ForegroundColor White
    Write-Host "4. Select the 'frontend' folder" -ForegroundColor White
    Write-Host "5. Add environment variable: VITE_API_URL=https://your-backend-url.railway.app" -ForegroundColor White
    Write-Host "6. Click 'Deploy'" -ForegroundColor White
    Write-Host ""
    Write-Host "🔧 Step 2: Deploy Backend to Railway" -ForegroundColor Cyan
    Write-Host "------------------------------------" -ForegroundColor Cyan
    Write-Host "1. Go to https://railway.app" -ForegroundColor White
    Write-Host "2. Click 'New Project'" -ForegroundColor White
    Write-Host "3. 'Deploy from GitHub repo'" -ForegroundColor White
    Write-Host "4. Select your repository" -ForegroundColor White
    Write-Host "5. Add PostgreSQL service" -ForegroundColor White
    Write-Host "6. Add environment variables from backend/.env.production" -ForegroundColor White
    Write-Host "7. Click 'Deploy'" -ForegroundColor White
    Write-Host ""
    Write-Host "🔗 Step 3: Connect Frontend to Backend" -ForegroundColor Cyan
    Write-Host "--------------------------------------" -ForegroundColor Cyan
    Write-Host "1. Copy your Railway backend URL" -ForegroundColor White
    Write-Host "2. Update VITE_API_URL in Vercel dashboard" -ForegroundColor White
    Write-Host "3. Redeploy frontend" -ForegroundColor White
    Write-Host ""
    Write-Host "🧪 Step 4: Test Your Live App" -ForegroundColor Cyan
    Write-Host "------------------------------" -ForegroundColor Cyan
    Write-Host "1. Visit your Vercel URL" -ForegroundColor White
    Write-Host "2. Test citizen registration" -ForegroundColor White
    Write-Host "3. Test admin login (admin@resolveai.com / admin123)" -ForegroundColor White
    Write-Host "4. Verify all features work" -ForegroundColor White
    Write-Host ""
    Write-Host "📊 Expected URLs:" -ForegroundColor Yellow
    Write-Host "Frontend: https://your-project-name.vercel.app" -ForegroundColor White
    Write-Host "Backend: https://your-service-name.railway.app" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Tips:" -ForegroundColor Magenta
    Write-Host "- Both Vercel and Railway have free tiers" -ForegroundColor White
    Write-Host "- You'll need a credit card for verification (free tier still applies)" -ForegroundColor White
    Write-Host "- Update your SECRET_KEY before production deployment" -ForegroundColor White
    Write-Host "- Set up custom domains when ready" -ForegroundColor White
    Write-Host ""
    Write-Host "🎉 Your AI Smart Grievance System will be live on the internet!" -ForegroundColor Green
}

# Main execution
function Main {
    Check-Prerequisites
    Prepare-Project
    Initialize-Git
    Show-DeployInstructions
}

# Run the script
Main
