# AI Smart Grievance System

A production-ready, AI-driven grievance management platform that automatically routes citizen complaints to the correct government department using NLP and machine learning.

## 🚀 Quick Start

### 🌐 Live Demo
**🎯 Try it now**: [https://resolveai-demo.vercel.app](https://resolveai-demo.vercel.app)

### ⚡ Quick Online Deployment (5 Minutes)
👉 Deploy to Vercel (frontend) + Railway (backend) with free tiers:

#### 🚀 One-Click Setup:
```bash
# Deploy Frontend to Vercel
# 1. Go to https://vercel.com
# 2. Connect your GitHub repository
# 3. Select the 'frontend' folder
# 4. Add environment variable: VITE_API_URL=https://your-backend-url.railway.app
# 5. Click 'Deploy'

# Deploy Backend to Railway
# 1. Go to https://railway.app
# 2. Connect your GitHub repository
# 3. Add PostgreSQL service
# 4. Add environment variables from backend/.env.production.example
# 5. Click 'Deploy'
```

## 🔐 Role-Based Access Control (RBAC)

### 👤 Citizen (User)
- Register/login to the system
- Submit complaints
- View only their complaints
- Track complaint status
- ❌ Cannot access admin or other users' data

### 🏢 Department Officer
- View complaints assigned to their department only
- Update complaint status (pending → in-progress → resolved)
- Add remarks and updates
- ❌ Cannot access admin panel or other departments

### 👑 Administrator
- Full system access and control
- User management (CRUD operations)
- Department management (CRUD operations)
- System configuration and settings
- View all complaints and analytics
- System performance monitoring

## 🏗️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLite/PostgreSQL** - Database with SQLAlchemy ORM
- **JWT Authentication** - Secure token-based auth
- **AI/ML Integration** - TF-IDF + NMF for text classification
- **Role-based Access Control** - Secure permission system

### Frontend
- **React 18** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Axios API** - HTTP client with interceptors
- **Toast Notifications** - User feedback system

## 🧪 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/priyas-04/ai-smart-grievance-system.git
   cd ai-smart-grievance-system
   ```

2. **Local development setup**
   ```bash
   # Backend setup
   cd backend
   pip install -r requirements.txt
   python main.py

   # Frontend setup (new terminal)
   cd frontend
   npm install
   npm run dev
   ```

3. **Access the application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:8001
   - **Default Admin**: admin@resolveai.com / admin123

## 🎯 Key Features

### 🤖 AI-Powered Complaint Routing
- Automatic text classification using TF-IDF
- Topic modeling with NMF for department assignment
- Priority-based routing (high/medium/low)
- Smart keyword extraction and categorization

### 📊 Real-time Dashboard
- Role-based dashboards with live updates
- Interactive complaint tracking
- Performance analytics and reporting
- Department-wise statistics

### 🔐 Security & Performance
- JWT-based authentication with role permissions
- Input validation and sanitization
- Optimized database queries with proper indexing
- Responsive design with mobile support

## 🌐 Deployment

### 📱 Vercel (Frontend)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

### 🔧 Railway (Backend)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy backend
cd backend
railway login
railway up
```

## 📞 Support

For issues, questions, or contributions:
- Create an issue in the project repository
- Check the API documentation at `/docs` endpoint

---

**🚀 Production-ready AI Smart Grievance System!**
