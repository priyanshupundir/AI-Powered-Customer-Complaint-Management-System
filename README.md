# AI-Powered Customer Complaint Management System & AI Copilot

An enterprise-ready, AI-driven Customer Complaint Management System built with **React, Redux Toolkit, FastAPI, LangGraph, and Groq LLMs**. The application features an interactive **Zoho-style Floating AI Copilot Widget** that enables conversational form filling, document/image parsing (OCR & PDF extraction), risk assessment, and complaint record management.

---

## 🚀 Key Features

- 💬 **Conversational AI Copilot (Zoho SalesIQ-style Widget)**: Floating widget supporting interactive chat, quick prompts, document upload, and real-time form updates.
- 📋 **Card-Based Complaint Form**: Modern structured sections for Customer Information, Complaint Details, Product & Expiry Details, and Log Information.
- 🔄 **Preserved Form State & Multi-Turn Edits**: Smart state persistence ensuring existing form fields remain intact when making iterative prompt adjustments.
- 🔍 **Automated Risk Assessment**: Real-time severity scoring (Low, Medium, High, Critical) with regulatory compliance tracking and mitigation strategies.
- 📄 **Document & File Extraction**: Extract structured complaint data automatically from uploaded PDFs, emails, and images.
- 🗄️ **Flexible Data Storage**: Full support for PostgreSQL with automatic fallback to SQLite.

---

## 🏗️ System Architecture & Workflow

`
[ User Input / Prompt / File ] 
               │
               ▼
   [ Floating Chatbot / React UI ]
               │ (REST API / Axios)
               ▼
      [ FastAPI Backend ]
               │
               ▼
     [ LangGraph Agent Workflow ]
         ├── Structured Extraction Node
         ├── Risk Assessment Node
         └── ChatGroq LLM (openai/gpt-oss-20b)
               │
               ▼
   [ Form Payload & Database Sync ] (PostgreSQL / SQLite)
`

1. **User Interaction**: The user submits a prompt, text snippet, or uploads a file (PDF/Image) via the floating chatbot widget.
2. **LangGraph Processing**: FastAPI routes the request to a LangGraph state graph.
3. **LLM Orchestration**: Groq LLM parses the input, maps entities to compliant form fields, and performs risk scoring.
4. **State Persistence**: The backend merges newly extracted data with existing form fields without losing pre-filled information.
5. **UI Synchronization**: Redux updates the frontend state in real-time, instantly populating the complaint form and copilot cards.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Redux Toolkit, Material-UI (MUI), Lucide React, Axios
- **Backend**: FastAPI, Uvicorn, LangGraph, LangChain, ChatGroq
- **Database**: PostgreSQL / SQLite (SQLAlchemy ORM)
- **Deployment**: Render (Backend), Vercel (Frontend)

---

## ⚙️ Environment Variables

Create a .env file in the ackend/ directory:

`env
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=postgresql://postgres:1234@localhost:5432/complaint_db
`

*Note: If DATABASE_URL is omitted or PostgreSQL is unavailable, the system automatically falls back to SQLite (sqlite:///./complaints.db).*

---

## 📦 Quick Start & Local Setup

### 1. Repository Setup
`ash
git clone https://github.com/priyanshupundir/AI-Powered-Customer-Complaint-Management-System.git
cd AI-Powered-Customer-Complaint-Management-System
`

### 2. Backend Setup
`ash
cd backend
python -m venv venv
# On Windows:
venv\Scriptsctivate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python main.py
`
The FastAPI backend will start at http://localhost:8000. API Docs available at http://localhost:8000/docs.

### 3. Frontend Setup
`ash
cd ../frontend
npm install
npm run dev
`
The React frontend will start at http://localhost:5173 (or 5174).

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/chat | Process conversational prompt and extract form data |
| POST | /api/process-file | Extract complaint data from PDF or image files |
| POST | /api/complaints | Save finalized complaint to database |
| GET  | /api/complaints | Fetch all logged complaints |
| GET  | /api/health | Backend status check |

---

## 📄 License

This project is licensed under the MIT License.
