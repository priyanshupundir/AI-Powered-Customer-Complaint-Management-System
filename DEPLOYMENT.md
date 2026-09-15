# Deployment Guide - Vercel + Render

This guide will help you deploy the AI-Powered Customer Complaint Management System on Vercel (frontend) and Render (backend).

## 📋 Prerequisites

- GitHub account with the project repository
- Vercel account (free tier available)
- Render account (free tier available)
- Groq API key
- PostgreSQL database (Render provides free PostgreSQL)

## 🚀 Step 1: Deploy Backend on Render

### 1.1 Create PostgreSQL Database on Render

1. Go to [Render.com](https://render.com) and sign up/log in
2. Click "New +" → "PostgreSQL"
3. Name: `complaint-db`
4. Database: `complaint_db`
4. User: `complaint_user`
5. Region: Choose nearest region
6. Click "Create Database"
7. Save the **Internal Database URL** (you'll need this later)

### 1.2 Deploy FastAPI Backend

1. In Render, click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the web service:

**Build & Deploy:**
- **Name**: `complaint-backend`
- **Region**: Same as your database
- **Branch**: `main`
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

**Environment Variables:**
```
DATABASE_URL=your_render_postgres_url
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=your_vercel_frontend_url
BACKEND_URL=https://your-backend-url.onrender.com
ENVIRONMENT=production
SECRET_KEY=your_secret_key
```

4. Click "Create Web Service"
5. Wait for deployment to complete (2-3 minutes)
6. Copy the backend URL: `https://your-backend-url.onrender.com`

### 1.3 Initialize Database on Render

1. Go to your Render web service dashboard
2. Click "Shell" tab
3. Run:
```bash
python init_db.py create
```

## 🎨 Step 2: Deploy Frontend on Vercel

### 2.1 Deploy React Frontend

1. Go to [Vercel.com](https://vercel.com) and sign up/log in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:

**Framework Preset:** Vite
**Root Directory:** `frontend`
**Build Command:** `npm run build`
**Output Directory:** `dist`

**Environment Variables:**
```
VITE_API_URL=https://your-backend-url.onrender.com
```

5. Click "Deploy"
6. Wait for deployment to complete (1-2 minutes)
7. Copy the frontend URL: `https://your-project.vercel.app`

### 2.2 Update Render Backend CORS

1. Go back to your Render web service
2. Update the `FRONTEND_URL` environment variable with your Vercel URL
3. The service will automatically redeploy

## 🔧 Step 3: Update Frontend API Configuration

Your frontend is already configured to use the `VITE_API_URL` environment variable, so it should automatically connect to your deployed backend.

## ✅ Step 4: Test the Deployed Application

1. Open your Vercel frontend URL
2. Test the AI chatbot with a sample complaint
3. Verify that the backend is processing requests
4. Check that the database is storing complaints

## 📊 Step 5: Monitor Your Deployments

### Render Dashboard:
- Monitor backend health
- View logs
- Check database connections
- Set up alerts

### Vercel Dashboard:
- Monitor frontend performance
- View deployment logs
- Set up custom domains (optional)
- Analytics

## 🔐 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **API Keys**: Use environment variables for sensitive data
3. **Database**: Use Render's managed PostgreSQL with SSL
4. **CORS**: Restrict to your specific domains in production

## 🚦 Troubleshooting

### Backend Issues:
- **Database Connection**: Check DATABASE_URL format
- **Missing Dependencies**: Verify requirements.txt is complete
- **Port Issues**: Render uses $PORT automatically

### Frontend Issues:
- **API Connection**: Verify VITE_API_URL is set correctly
- **Build Failures**: Check npm install output
- **CORS Errors**: Ensure backend allows your Vercel domain

### Common Fixes:
```bash
# Rebuild backend
# In Render dashboard, click "Manual Deploy" → "Build & Deploy"

# Rebuild frontend
# In Vercel dashboard, click "Redeploy"
```

## 📈 Scaling (Optional)

### When to Scale:
- High traffic
- Slow response times
- Database bottlenecks

### Scaling Options:
- **Render**: Upgrade to paid tiers for more resources
- **Vercel**: Pro plan for more bandwidth and features
- **Database**: Consider managed PostgreSQL providers for production

## 🔄 CI/CD Pipeline

Both platforms automatically deploy when you push to GitHub:
- Push to `main` branch → Automatic deployment
- Pull requests → Preview deployments
- Environment variables are preserved across deployments

## 📝 Post-Deployment Checklist

- [ ] Backend URL is accessible
- [ ] Frontend loads without errors
- [ ] API endpoints respond correctly
- [ ] Database is connected
- [ ] Groq API is working
- [ ] All features are functional
- [ ] Error monitoring is set up
- [ ] SSL certificates are active

## 🎉 Your Application is Live!

Your AI-Powered Customer Complaint Management System is now deployed and accessible to users worldwide!

**Frontend URL**: Your Vercel URL  
**Backend URL**: Your Render URL  
**Database**: Render PostgreSQL  

For the demo video, you can use these live URLs instead of localhost!