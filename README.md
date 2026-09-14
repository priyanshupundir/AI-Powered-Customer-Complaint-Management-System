# AI-Powered Customer Complaint Management System

An AI-powered Customer Complaint Management System for pharmaceutical manufacturing companies, built with React, FastAPI, LangGraph, and Groq LLMs.

## 🎯 Objective

Build an intelligent complaint management system that uses AI to automate complaint logging, risk assessment, and document processing through natural language interactions.

## 🛠️ Technology Stack

### Frontend
- **React 18+** - UI Framework
- **Redux Toolkit** - State Management
- **Material-UI** - UI Components
- **Google Inter** - Font
- **Vite** - Build Tool

### Backend
- **FastAPI** - Python Web Framework
- **LangGraph** - AI Agent Framework
- **Groq LLMs** - gemma2-9b-it, llama-3.3-70b-versatile
- **PostgreSQL** - Database
- **SQLAlchemy** - ORM

### DevOps
- **Git** - Version Control
- **Docker** - Containerization (optional)

## 📋 Features

### Mandatory AI Tools
1. **Log Complaint Tool** - Natural language complaint logging with automatic form population
2. **Edit Complaint Tool** - Natural language editing of existing complaints
3. **Document Extraction Tool** - PDF/Email parsing and information extraction

### Core Functionality
- AI-powered risk assessment
- Automatic severity classification
- Recommended action generation
- Chat-based interaction interface
- Real-time form updates

### Bonus Features (Optional)
- Complaint completeness checker
- Root cause recommendation
- Duplicate complaint detection
- CAPA recommendation
- Complaint summary generation
- Enhanced AI risk classification

## 🏗️ Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system architecture, database schema, and data flow diagrams.

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL 14+
- Groq API Key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/priyanshupundir/AI-Powered-Customer-Complaint-Management-System.git
cd AI-Powered-Customer-Complaint-Management-System
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

4. Install frontend dependencies:
```bash
cd frontend
npm install
```

5. Initialize database:
```bash
cd backend
python init_db.py
```

6. Run the application:
```bash
# Terminal 1 - Backend
cd backend
uvicorn main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 📁 Project Structure

```
AI-Powered-Customer-Complaint-Management-System/
├── backend/
│   ├── app/
│   │   ├── api/              # API endpoints
│   │   ├── core/             # Configuration
│   │   ├── models/           # Database models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── services/         # Business logic
│   │   └── graph/            # LangGraph workflows
│   ├── requirements.txt
│   └── main.py
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── redux/            # Redux store and slices
│   │   ├── services/         # API services
│   │   └── utils/            # Utilities
│   ├── package.json
│   └── vite.config.js
├── ARCHITECTURE.md
└── README.md
```

## 🎨 Usage

### Log a Complaint
Simply describe the complaint in natural language:
```
"Apollo Pharmacy reported discolored capsules in amoxicylin capsules 500 mg"
```

The AI will automatically:
- Extract product details (name, strength, batch, dates)
- Populate the complaint form
- Generate risk assessment
- Suggest next actions

### Edit a Complaint
Provide natural language corrections:
```
"Sorry, the batch number is BMX24602 and affected quantity is 48 capsules"
```

### Extract from Document
Upload a PDF or email, and the AI will:
- Parse the document
- Extract complaint information
- Populate the form
- Generate risk assessment

## 🤝 Contributing

This project is part of a technical challenge for AIVOA.ai. Contributions are welcome but please follow the assignment requirements.

## 📄 License

Proprietary - Assignment Project

## 📞 Contact

Company Website: https://aivoa.ai

---

**Built with ❤️ for pharmaceutical quality management**