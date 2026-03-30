# 🚀 AI Smart Grievance System - Deployment Guide

## 📋 Overview
This guide provides step-by-step instructions for deploying the AI Smart Grievance System to production environments.

## 🔧 Prerequisites

### System Requirements
- **Node.js 18+** and npm
- **Python 3.8+** and pip
- **SQLite** (for development) or **PostgreSQL/MySQL** (for production)
- **Git** for version control

### Environment Variables
The system requires the following environment variables:

#### Backend (.env)
```bash
DATABASE_URL=sqlite:///./resolveai.db  # or postgresql://user:pass@host/db
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

#### Frontend
```bash
VITE_API_URL=http://localhost:8001  # Production API URL
```

## 🏗️ Build & Deployment

### Option 1: Docker Deployment (Recommended)

#### 1. Backend Docker Setup
```bash
# Build backend image
cd backend
docker build -t resolveai-backend .

# Run with production database
docker run -d \
  --name resolveai-backend \
  -p 8001:8001 \
  -e DATABASE_URL=postgresql://user:password@db-host:5432/resolveai \
  -e SECRET_KEY=your-production-secret-key \
  resolveai-backend
```

#### 2. Frontend Docker Setup
```bash
# Build frontend
cd frontend
npm run build

# Serve with nginx or Apache
docker build -t resolveai-frontend .
docker run -d \
  --name resolveai-frontend \
  -p 80:80 \
  -e VITE_API_URL=https://your-api-domain.com \
  resolveai-frontend
```

#### 3. Docker Compose (Complete Setup)
```bash
# Using the provided docker-compose.yml
docker-compose up -d
```

### Option 2: Traditional Server Deployment

#### 1. Backend Deployment
```bash
# Install dependencies
cd backend
pip install -r requirements.txt

# Set production environment
export DATABASE_URL=postgresql://user:password@db-host:5432/resolveai
export SECRET_KEY=your-production-secret-key

# Start production server
gunicorn main:app --workers 4 --bind 0.0.0.0:8001
```

#### 2. Frontend Deployment
```bash
# Install dependencies and build
cd frontend
npm install
npm run build

# Serve built files with nginx/Apache
# Copy dist/ folder to web server
cp -r dist/* /var/www/html/
```

### Option 3: Cloud Platform Deployment

#### Vercel (Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

#### Railway/Heroku (Backend)
```bash
# Deploy backend
cd backend
railway up

# Or with Heroku
heroku create resolveai-backend
heroku config:set DATABASE_URL=postgresql://...
git push heroku main
```

## 🔐 Security Configuration

### Production Checklist
- [ ] **Change default passwords** and secret keys
- [ ] **Use HTTPS** in production
- [ ] **Set up SSL certificates**
- [ ] **Configure firewall** rules
- [ ] **Database security** - use PostgreSQL/MySQL
- [ ] **API rate limiting** if needed
- [ ] **CORS configuration** for frontend domain

## 📊 Performance Optimization

### Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_department ON complaints(department_id);
CREATE INDEX idx_users_role ON users(role);
```

### Frontend Optimization
```bash
# Build for production
npm run build

# Analyze bundle size
npm run analyze

# Enable compression in nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

## 🔍 Monitoring & Logging

### Application Monitoring
```bash
# Use PM2 for process management
npm install -g pm2
pm2 start ecosystem.config.js

# Log rotation setup
logrotate -f /etc/logrotate.d/resolveai
```

### Health Checks
```bash
# Add health check endpoint
curl https://your-domain.com/api/health

# Monitor application metrics
# Set up Prometheus/Grafana or use cloud monitoring
```

## 🌐 Public Access URLs

After deployment, your application will be accessible at:

- **Frontend**: `https://your-domain.com/`
- **Backend API**: `https://your-domain.com/api/`
- **Health Check**: `https://your-domain.com/api/health`

## 🚨 Troubleshooting

### Common Issues
1. **CORS Errors**: Check backend CORS configuration
2. **Database Connection**: Verify DATABASE_URL format
3. **Authentication Failures**: Check SECRET_KEY consistency
4. **Static Files Not Loading**: Check file paths and permissions
5. **AI Model Loading**: Verify model files exist and paths

### Debug Commands
```bash
# Check backend logs
docker logs resolveai-backend

# Check frontend build
npm run build --verbose

# Database connection test
python -c "from database.database import engine; print(engine.execute('SELECT 1').scalar())"
```

## 📞 Support & Maintenance

### Regular Maintenance
- **Update dependencies** monthly
- **Backup database** regularly
- **Monitor disk space** and performance
- **Review logs** for security issues
- **Update AI models** with new training data

### Backup Strategy
```bash
# Database backup
sqlite3 resolveai.db ".backup backup.db"

# Application backup
tar -czf backup-$(date +%Y%m%d).tar.gz .
```

## 🎯 Production Best Practices

1. **Use environment variables** for all configuration
2. **Implement proper logging** with different levels
3. **Set up monitoring** and alerting
4. **Use HTTPS** and valid SSL certificates
5. **Regular security updates** and dependency patches
6. **Implement caching** for better performance
7. **Document your architecture** and deployment process
8. **Test thoroughly** before production deployment

## 🌐 Live Demo URL

**🚀 Live Demo**: [https://resolveai-demo.vercel.app](https://resolveai-demo.vercel.app)

## 📞 Need Help?

For deployment support or questions:
- Check the [API Documentation](./API_DOCUMENTATION.md)
- Review the [Setup Guide](./SETUP.md)
- Create an issue in the project repository

**🚀 Your AI Smart Grievance System is now ready for production deployment!**
- Server with at least 2GB RAM
- Domain name (optional)

#### Steps

1. **Clone the Repository**
```bash
git clone <repository-url>
cd ai-smart-grievance-system
```

2. **Configure Environment Variables**
```bash
# Copy and edit environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. **Deploy with Docker Compose**
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

4. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Option 2: Manual Deployment

#### Backend Deployment (Render)

1. **Prepare Backend**
```bash
cd backend
pip install -r requirements.txt
python ai_models/train_models.py
```

2. **Deploy to Render**
- Connect GitHub repository to Render
- Create a new Web Service
- Select Python environment
- Set build command: `pip install -r requirements.txt && python ai_models/train_models.py`
- Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Configure environment variables

3. **Environment Variables for Render**
```
DATABASE_URL=mysql+pymysql://user:password@host:3306/database
SECRET_KEY=your-production-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

#### Frontend Deployment (Vercel)

1. **Prepare Frontend**
```bash
cd frontend
npm install
npm run build
```

2. **Deploy to Vercel**
- Connect GitHub repository to Vercel
- Configure build settings:
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Install Command: `npm install`
- Set environment variable: `VITE_API_URL=https://your-backend-url.onrender.com`

#### Database Setup (PlanetScale/Railway)

1. **Create MySQL Database**
- Sign up for PlanetScale or Railway
- Create a new database
- Get connection string

2. **Run Database Setup**
```bash
# Import schema
mysql -h <host> -u <user> -p <database> < backend/database/schema.sql

# Seed initial data
python backend/database/seed_data.py
```

## 🔧 Production Configuration

### Backend Configuration

1. **Security Settings**
```python
# backend/config/settings.py
class Settings(BaseSettings):
    database_url: str
    secret_key: str  # Use a strong, randomly generated key
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Production settings
    debug: bool = False
    allowed_hosts: List[str] = ["yourdomain.com"]
    
    class Config:
        env_file = ".env"
```

2. **Database Optimization**
```python
# Use connection pooling
engine = create_engine(
    database_url,
    pool_size=20,
    max_overflow=30,
    pool_pre_ping=True,
    pool_recycle=3600
)
```

3. **CORS Configuration**
```python
# backend/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Production domain
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

### Frontend Configuration

1. **Environment Variables**
```javascript
// frontend/.env.production
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=ResolveAI
VITE_APP_VERSION=1.0.0
```

2. **Build Optimization**
```javascript
// frontend/vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react']
        }
      }
    }
  }
})
```

## 🔒 Security Best Practices

### Backend Security

1. **JWT Secret Key**
```bash
# Generate a strong secret key
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

2. **Database Security**
- Use strong passwords
- Enable SSL connections
- Regular backups
- Limit database access

3. **API Security**
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection

### Frontend Security

1. **Content Security Policy**
```html
<!-- public/index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

2. **HTTPS Only**
- Enforce HTTPS in production
- Use secure cookies
- Redirect HTTP to HTTPS

## 📊 Monitoring & Logging

### Backend Monitoring

1. **Logging Configuration**
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
```

2. **Health Checks**
```python
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "version": "1.0.0"
    }
```

### Frontend Monitoring

1. **Error Tracking**
```javascript
// Add error boundary and logging
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Send to monitoring service
});
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.9
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      - name: Run tests
        run: |
          cd backend
          python -m pytest

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          # Trigger Render deployment
          curl -X POST $RENDER_DEPLOY_HOOK
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Errors**
```bash
# Check database connectivity
mysql -h <host> -u <user> -p <database>

# Verify connection string
echo $DATABASE_URL
```

2. **CORS Issues**
```python
# Verify CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourdomain.com"],
    allow_credentials=True,
)
```

3. **AI Model Loading Issues**
```bash
# Re-train models if needed
python backend/ai_models/train_models.py

# Check model files
ls -la backend/ai_models/saved_models/
```

### Performance Optimization

1. **Database Optimization**
```sql
-- Add indexes for better performance
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_department ON complaints(department_id);
```

2. **Caching Strategy**
```python
# Add Redis caching for frequently accessed data
import redis
redis_client = redis.Redis(host='localhost', port=6379, db=0)
```

## 📱 Scaling Considerations

### Horizontal Scaling

1. **Load Balancing**
- Use nginx or cloud load balancer
- Multiple backend instances
- Session affinity considerations

2. **Database Scaling**
- Read replicas
- Database sharding
- Connection pooling

### Vertical Scaling

1. **Resource Allocation**
- Increase CPU/RAM as needed
- Monitor resource usage
- Optimize queries

## 🔄 Backup & Recovery

### Database Backups

1. **Automated Backups**
```bash
# Daily backup script
mysqldump -h <host> -u <user> -p<password> <database> > backup_$(date +%Y%m%d).sql
```

2. **Recovery Process**
```bash
# Restore from backup
mysql -h <host> -u <user> -p<password> <database> < backup_20231201.sql
```

### Application Backups

1. **Code Backups**
- Git version control
- Tag releases
- Document changes

2. **AI Model Backups**
```bash
# Backup trained models
cp -r backend/ai_models/saved_models/ backup/models_$(date +%Y%m%d)/
```

## 📞 Support

For deployment issues:
1. Check logs: `docker-compose logs -f`
2. Verify environment variables
3. Test database connectivity
4. Review API documentation at `/docs`
5. Check this troubleshooting guide

---

**Note**: Always test deployments in a staging environment before production deployment.
