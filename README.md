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

### Mandatory AI Tools ✅
1. **Log Complaint Tool** - Natural language complaint logging with automatic form population
2. **Edit Complaint Tool** - Natural language editing of existing complaints  
3. **Document Extraction Tool** - PDF/Email parsing and information extraction

### Core Functionality ✅
- AI-powered risk assessment using LangGraph
- Automatic severity classification (Critical, Major, Minor)
- Recommended action generation
- Chat-based interaction interface
- Real-time form updates via Redux
- PostgreSQL database integration

### Bonus Features ✅
- **Complaint Completeness Checker** - Validates required and recommended fields
- **CAPA Recommendations** - AI-generated corrective and preventive actions
- **Root Cause Analysis** - Suggests potential root causes based on complaint details
- **Duplicate Complaint Detection** - Identifies similar existing complaints
- **Executive Summary** - Generates concise summaries for management review

## 🏗️ Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system architecture, database schema, and data flow diagrams.

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL 14+
- Groq API Key

### Quick Start

For detailed installation instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md).

1. Clone the repository:
```bash
git clone https://github.com/priyanshupundir/AI-Powered-Customer-Complaint-Management-System.git
cd AI-Powered-Customer-Complaint-Management-System
```

2. Set up environment variables:
```bash
cd backend
cp .env.example .env
# Edit .env with your Groq API key and database credentials
```

3. Install and run backend:
```bash
cd backend
pip install -r requirements.txt
python init_db.py create
python main.py
```

4. Install and run frontend (in another terminal):
```bash
cd frontend
npm install
npm run dev
```

5. Open your browser to `http://localhost:5173`

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
│   ├── init_db.py            # Database initialization
│   └── main.py
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── redux/            # Redux store and slices
│   │   ├── services/         # API services
│   │   └── utils/            # Utilities
│   ├── package.json
│   └── vite.config.js
├── sample-documents/         # Sample complaint documents for testing
├── ARCHITECTURE.md           # Detailed system architecture
├── SETUP_GUIDE.md            # Comprehensive setup instructions
├── DEMO_GUIDE.md             # Demo video creation guide
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

### Use Bonus Features
Switch to the "Bonus Features" tab to access:
- Complaint completeness checking
- CAPA recommendations
- Root cause analysis
- Duplicate detection
- Executive summary generation

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed system architecture, database schema, and data flow
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Comprehensive installation and configuration guide
- [DEMO_GUIDE.md](./DEMO_GUIDE.md) - Step-by-step guide for creating your demo video

## 🎥 Demo

For assignment submission, you need to create a 5-10 minute demo video. See [DEMO_GUIDE.md](./DEMO_GUIDE.md) for detailed instructions on:

- Demo structure and timing
- Code walkthrough highlights
- Live demonstration scripts
- Screen recording tips
- Submission guidelines

## 🤝 Contributing

This project is part of a technical challenge for AIVOA.ai. Contributions are welcome but please follow the assignment requirements.

## 📄 License

Proprietary - Assignment Project

## 📞 Contact

Company Website: https://aivoa.ai

---

**Built with ❤️ for pharmaceutical quality management**