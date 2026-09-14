# Setup Guide - AI-Powered Customer Complaint Management System

This guide will help you set up and run the AI-Powered Customer Complaint Management System on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.9 or higher** - [Download here](https://www.python.org/downloads/)
- **Node.js 18 or higher** - [Download here](https://nodejs.org/)
- **PostgreSQL 14 or higher** - [Download here](https://www.postgresql.org/download/)
- **Git** - [Download here](https://git-scm.com/downloads)
- **Groq API Key** - Get one from [https://console.groq.com](https://console.groq.com)

## Step 1: Clone the Repository

```bash
git clone https://github.com/priyanshupundir/AI-Powered-Customer-Complaint-Management-System.git
cd AI-Powered-Customer-Complaint-Management-System
```

## Step 2: Set Up PostgreSQL Database

### 2.1 Create Database

Open PostgreSQL command line or use pgAdmin to create a new database:

```sql
CREATE DATABASE complaint_db;
```

### 2.2 Create Database User (Optional)

If you want to create a dedicated user:

```sql
CREATE USER complaint_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE complaint_db TO complaint_user;
```

## Step 3: Backend Setup

### 3.1 Create Virtual Environment

```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate

# On Mac/Linux:
source venv/bin/activate
```

### 3.2 Install Dependencies

```bash
pip install -r requirements.txt
```

### 3.3 Configure Environment Variables

Copy the example environment file to the backend directory and update it with your configuration:

```bash
cd backend
cp .env.example .env
```

Edit the `backend/.env` file with your actual values:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/complaint_db

# Groq API Configuration
GROQ_API_KEY=your_actual_groq_api_key_here

# Application Configuration
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8000
ENVIRONMENT=development

# Secret Key for JWT (if needed)
SECRET_KEY=your_secret_key_here
```

### 3.4 Initialize Database

```bash
cd backend
python init_db.py create
```

You can verify the database setup:

```bash
python init_db.py verify
```

## Step 4: Frontend Setup

### 4.1 Install Dependencies

```bash
cd frontend
npm install
```

### 4.2 Configure Environment Variables

The frontend already has a `.env` file configured for local development:

```env
VITE_API_URL=http://localhost:8000
```

If your backend runs on a different port, update this value.

## Step 5: Run the Application

### 5.1 Start Backend Server

Open a terminal and run:

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
source venv/bin/activate  # On Mac/Linux
python main.py
```

The backend will start on `http://localhost:8000`

You can access the API documentation at: `http://localhost:8000/docs`

### 5.2 Start Frontend Development Server

Open another terminal and run:

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

## Step 6: Test the Application

1. Open your browser and navigate to `http://localhost:5173`
2. You should see the AI-Powered Customer Complaint Management System interface
3. Try the following test scenarios:

### Test Scenario 1: Log Complaint via Natural Language

In the AI Copilot chat, type:
```
Apollo Pharmacy reported discolored capsules in amoxicylin capsules 500 mg
```

Expected result:
- Form should be automatically populated with product details
- Risk assessment should appear on the right side

### Test Scenario 2: Document Extraction

1. Click the attachment icon in the AI Copilot
2. Select one of the sample documents from `sample-documents/` folder
3. The AI should extract complaint information and populate the form

### Test Scenario 3: Edit Complaint

After logging a complaint, type in the AI Copilot:
```
Sorry, the batch number is BMX24602 and affected quantity is 48 capsules
```

Expected result:
- The form should update with the new batch number and quantity
- Risk assessment should be recalculated

## Troubleshooting

### Database Connection Issues

If you get database connection errors:

1. Verify PostgreSQL is running
2. Check your DATABASE_URL in `.env` file
3. Ensure the database exists
4. Verify user credentials

### Groq API Issues

If you get API errors:

1. Verify your GROQ_API_KEY is correct
2. Check if you have available API credits
3. Ensure your network connection is stable

### Frontend-Backend Connection Issues

If the frontend can't connect to the backend:

1. Verify both servers are running
2. Check the VITE_API_URL in frontend `.env`
3. Ensure CORS is configured correctly in backend
4. Check browser console for specific error messages

### Port Conflicts

If ports are already in use:

**Backend (8000):**
```bash
# Change port in backend/main.py
uvicorn.run(app, host="0.0.0.0", port=8001)  # Use 8001 instead
```

**Frontend (5173):**
```bash
# Change port when starting dev server
npm run dev -- --port 3000
```

## Development Tips

### Backend Development

- Use `uvicorn main:app --reload` for auto-reload during development
- Access interactive API docs at `http://localhost:8000/docs`
- Check database state using pgAdmin or psql

### Frontend Development

- The frontend uses hot module replacement for instant updates
- Redux DevTools extension is recommended for debugging state
- Browser console will show API errors and network issues

### Testing

Use the sample documents in `sample-documents/` for testing document extraction:
- `sample_complaint_1.txt` - Amoxicylin capsules discoloration
- `sample_complaint_2.txt` - Metformin API quality issue
- `sample_complaint_3.txt` - Ciprofloxacin tablet hardness

## Production Deployment

For production deployment, consider:

1. **Environment Variables**: Use production-grade secrets management
2. **Database**: Use managed PostgreSQL service (AWS RDS, Google Cloud SQL, etc.)
3. **Backend**: Deploy using Docker containers or cloud services
4. **Frontend**: Build static files and deploy to CDN or hosting service
5. **Security**: Enable HTTPS, implement authentication, add rate limiting
6. **Monitoring**: Set up logging and monitoring services

## Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [Groq API Documentation](https://console.groq.com/docs)

## Support

For issues or questions:
- Check the [ARCHITECTURE.md](./ARCHITECTURE.md) for system design details
- Review the [README.md](./README.md) for project overview
- Contact support at https://aivoa.ai

---

**Happy Coding! 🚀**