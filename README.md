# ResolveAI - AI-Powered Smart Grievance Assist System

A production-ready, AI-driven grievance management platform that automatically routes citizen complaints to the correct government department using NLP and machine learning.

## 🚀 Quick Start

### 🌐 Live Demo
**🎯 Try it now**: [https://resolveai-demo.vercel.app](https://resolveai-demo.vercel.app)

### ⚡ Quick Online Deployment (5 Minutes)
👉 **NEW**: See [QUICK_DEPLOYMENT.md](./QUICK_DEPLOYMENT.md) for step-by-step online deployment using:
- **Vercel** (Frontend) - Free hosting
- **Railway** (Backend) - Free hosting
- **GitHub** (Code repository)

#### 🚀 One-Click Setup:
```bash
# Run the deployment script
./deploy.ps1        # Windows PowerShell
# or
./deploy.sh          # Linux/Mac

# Follow the instructions to deploy to:
# - Vercel (frontend)
# - Railway (backend)
```

### 📋 System Overview
ResolveAI is designed for public users to submit complaints related to municipal services such as water supply, electricity, roads, sanitation, etc. The system uses AI to automatically analyze and route complaints to the appropriate department, prioritizing urgent issues for faster resolution.

## 🔐 Role-Based Access Control (RBAC)
The system implements strict role-based access control with three user roles:

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

### � Administrator
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
- **Framework**: Python, FastAPI
- **Database**: MySQL with SQLAlchemy ORM
- **Authentication**: JWT-based with role-based middleware
- **AI/ML**: scikit-learn, NLTK, pandas, numpy
- **Model Persistence**: Pickle

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context API
- **HTTP Client**: Axios

### Database
- **Database**: MySQL 8.0+
- **ORM**: SQLAlchemy 2.0
- **Migrations**: Alembic

## 📁 Project Structure

```
ai-smart-grievance-system/
├── backend/
│   ├── ai_models/                 # AI/ML models and processing
│   │   ├── text_preprocessor.py   # Text preprocessing utilities
│   │   ├── complaint_classifier.py # ML classification models
│   │   ├── smart_router.py        # AI-powered complaint routing
│   │   └── train_models.py        # Model training script
│   ├── auth/                      # Authentication & authorization
│   │   ├── auth_handler.py        # JWT token management
│   │   └── dependencies.py        # Role-based middleware
│   ├── config/                    # Configuration management
│   │   └── settings.py            # Environment settings
│   ├── database/                  # Database configuration
│   │   ├── database.py            # Database connection
│   │   ├── schema.sql             # MySQL schema
│   │   └── seed_data.py           # Initial data seeding
│   ├── models/                    # SQLAlchemy models
│   │   ├── user.py                # User model
│   │   ├── complaint.py           # Complaint model
│   │   └── department.py          # Department model
│   ├── routes/                    # API routes
│   │   ├── auth.py                # Authentication endpoints
│   │   ├── complaints.py          # Complaint management
│   │   ├── users.py               # User management
│   │   └── departments.py         # Department management
│   ├── schemas/                   # Pydantic schemas
│   │   ├── user.py                # User schemas
│   │   ├── complaint.py           # Complaint schemas
│   │   └── department.py          # Department schemas
│   ├── services/                  # Business logic
│   │   └── complaint_service.py    # Complaint services
│   ├── main.py                    # FastAPI application entry
│   ├── requirements.txt           # Python dependencies
│   └── .env                       # Environment variables
├── frontend/
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── components/            # Reusable components
│   │   │   └── Layout.jsx         # Main layout component
│   │   ├── contexts/              # React contexts
│   │   │   └── AuthContext.jsx    # Authentication context
│   │   ├── pages/                 # Page components
│   │   │   ├── Login.jsx          # Login page
│   │   │   ├── Register.jsx       # Registration page
│   │   │   ├── Dashboard.jsx      # Citizen dashboard
│   │   │   ├── SubmitComplaint.jsx # Complaint submission
│   │   │   ├── ComplaintDetails.jsx # Complaint details
│   │   │   ├── Profile.jsx        # User profile
│   │   │   ├── admin/             # Admin pages
│   │   │   │   └── AdminDashboard.jsx
│   │   │   └── officer/           # Officer pages
│   │   │       └── OfficerDashboard.jsx
│   │   ├── App.jsx                # Main App component
│   │   ├── main.jsx               # App entry point
│   │   └── index.css              # Global styles
│   ├── package.json               # Node.js dependencies
│   ├── vite.config.js             # Vite configuration
│   └── tailwind.config.js         # Tailwind CSS configuration
└── README.md                      # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- MySQL 8.0+
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ai-smart-grievance-system
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Copy .env file and update with your database credentials
```

### 3. Database Setup

```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE resolveai_db;

# Update .env file with your database credentials
DATABASE_URL=mysql+pymysql://username:password@localhost/resolveai_db

# Run database migrations and seed data
python database/seed_data.py
```

### 4. Train AI Models

```bash
# Train the AI classification models
python ai_models/train_models.py
```

### 5. Start Backend Server

```bash
# Start the FastAPI server
python main.py

# Or use uvicorn for development
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 6. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 7. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📱 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Citizen | citizen@resolveai.com | citizen123 |
| Officer (Water) | john.water@resolveai.com | officer123 |
| Officer (Electricity) | sarah.power@resolveai.com | officer123 |
| Admin | admin@resolveai.com | admin123 |

## 🔧 Configuration

### Environment Variables (.env)

```env
DATABASE_URL=mysql+pymysql://username:password@localhost/resolveai_db
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Database Schema

The system uses the following main tables:

- **users**: User accounts with role-based access
- **departments**: Municipal departments
- **complaints**: Complaint records with AI-classified categories

## 🤖 AI Model Details

### Text Preprocessing
- Lowercase conversion
- URL and email removal
- Special character cleaning
- Stopword removal
- Lemmatization

### Classification Models
- **Category Classification**: Multinomial Naive Bayes with TF-IDF
- **Priority Prediction**: Logistic Regression with TF-IDF
- **Features**: Unigrams and bigrams (1,2)
- **Training Data**: Synthetic dataset with 36 labeled examples

### Categories
- Water Department
- Electricity Department
- Road & Transport
- Sanitation
- General Administration

### Priority Levels
- High: Emergency situations, safety hazards
- Medium: Service disruptions, maintenance issues
- Low: General inquiries, non-urgent matters

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Complaints
- `POST /api/complaints/` - Submit complaint (Citizens only)
- `GET /api/complaints/` - Get complaints (role-based filtering)
- `GET /api/complaints/{id}` - Get specific complaint
- `PUT /api/complaints/{id}` - Update complaint (Officers/Admin only)
- `GET /api/complaints/stats/dashboard` - Dashboard statistics

### Users
- `GET /api/users/me` - Get current user info
- `PUT /api/users/me` - Update current user
- `GET /api/users/` - Get all users (Admin only)

### Departments
- `GET /api/departments/` - Get all departments
- `POST /api/departments/` - Create department (Admin only)
- `GET /api/departments/{id}` - Get specific department
- `PUT /api/departments/{id}` - Update department (Admin only)

## 🚀 Deployment

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set up a Web Service with Python environment
3. Configure environment variables
4. Set the start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
3. Set environment variables for API URL

### Database (MySQL)
- Use MySQL hosting service (PlanetScale, Railway, etc.)
- Update connection string in environment variables
- Run migrations and seed data

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation with Pydantic
- SQL injection prevention with SQLAlchemy
- CORS configuration
- Rate limiting (recommended for production)

## 📊 Monitoring & Analytics

- Dashboard statistics for all user roles
- Resolution rate tracking
- Department-wise complaint distribution
- Priority-based filtering
- Real-time status updates

## 🔄 Continuous Integration

The system is designed for CI/CD with:
- Automated testing
- Code quality checks
- Security scanning
- Automated deployments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation at `/docs`

## 🌟 Features Coming Soon

- File attachment support
- Email notifications
- Mobile app
- Advanced analytics
- Multi-language support
- SMS notifications
- Workflow automation
- Integration with government systems

---

**ResolveAI** - Transforming grievance management with AI-powered automation and intelligent routing.
