# AI-Powered Customer Complaint Management System - Architecture

## System Overview

This system is an AI-powered Customer Complaint Management System designed for pharmaceutical manufacturing companies. It uses advanced AI capabilities to automate complaint logging, risk assessment, and document processing through natural language interactions.

## Technology Stack

### Frontend
- **Framework**: React 18+
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI (MUI) or Tailwind CSS
- **Font**: Google Inter
- **HTTP Client**: Axios
- **Build Tool**: Vite

### Backend
- **Framework**: FastAPI (Python)
- **AI Framework**: LangGraph
- **LLM Provider**: Groq (gemma2-9b-it, llama-3.3-70b-versatile)
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Document Processing**: PyPDF2, python-docx
- **OCR**: pytesseract (optional for images)

### DevOps
- **Version Control**: Git
- **Containerization**: Docker (optional)
- **API Documentation**: Swagger/OpenAPI

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌──────────────────────┐          │
│  │  Log Complaint Form   │  │   AI Copilot Chat     │          │
│  │  - Product Details    │  │   - Chat Interface    │          │
│  │  - Complaint Info     │  │   - History           │          │
│  │  - Customer Info      │  │   - Document Upload   │          │
│  └──────────────────────┘  └──────────────────────┘          │
│                              │                                 │
│  ┌──────────────────────────────────────────────────────┐     │
│  │              Redux Store (State Management)          │     │
│  │  - complaintData, riskAssessment, chatHistory       │     │
│  └──────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      Backend (FastAPI)                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐     │
│  │              API Layer (Endpoints)                     │     │
│  │  POST /api/complaint/log     - Log new complaint      │     │
│  │  POST /api/complaint/edit    - Edit existing complaint│     │
│  │  POST /api/complaint/extract - Extract from document   │     │
│  │  GET  /api/complaint/:id     - Get complaint details  │     │
│  │  POST /api/chat              - Chat with AI           │     │
│  └──────────────────────────────────────────────────────┘     │
│                              │                                 │
│  ┌──────────────────────────────────────────────────────┐     │
│  │              LangGraph AI Agent Layer                 │     │
│  │  ┌──────────────────────────────────────────────┐   │     │
│  │  │  Complaint Graph                             │   │     │
│  │  │  - Input Node: Parse user prompt            │   │     │
│  │  │  - Extraction Node: Extract structured data │   │     │
│  │  │  - Risk Assessment Node: Analyze severity   │   │     │
│  │  │  - Decision Node: Determine next actions     │   │     │
│  │  │  - Output Node: Format response              │   │     │
│  │  └──────────────────────────────────────────────┘   │     │
│  │                                                      │     │
│  │  ┌──────────────────────────────────────────────┐   │     │
│  │  │  Document Processing Graph                     │   │     │
│  │  │  - PDF/Email Parser Node                      │   │     │
│  │  │  - OCR Node (if needed)                       │   │     │
│  │  │  - Information Extraction Node                │   │     │
│  │  │  - Complaint Graph Integration                 │   │     │
│  │  └──────────────────────────────────────────────┘   │     │
│  └──────────────────────────────────────────────────────┘     │
│                              │                                 │
│  ┌──────────────────────────────────────────────────────┐     │
│  │              LLM Integration Layer                   │     │
│  │  - Groq API Client (gemma2-9b-it)                    │     │
│  │  - Prompt Templates                                  │     │
│  │  - Response Parsing                                  │     │
│  └──────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ SQLAlchemy ORM
                              │
┌─────────────────────────────────────────────────────────────────┐
│                   Database (PostgreSQL)                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐     │
│  │  Tables:                                             │     │
│  │  - complaints (main complaint records)                │     │
│  │  - risk_assessments (AI-generated risk data)        │     │
│  │  - chat_history (conversation logs)                  │     │
│  │  - documents (uploaded document metadata)            │     │
│  └──────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### Frontend Components

#### 1. Log Customer Complaint Form
- **Purpose**: Display and edit complaint details
- **Fields**:
  - Product Name
  - Product Strength/Grade
  - Batch/Lot Number
  - Manufacturing Date
  - Expiry Date
  - Affected Quantity
  - Complaint Description
  - Customer Information
  - Reporter Details
  - Attachment Upload

#### 2. AI Copilot Chat Interface
- **Purpose**: Natural language interface for complaint management
- **Features**:
  - Chat message display
  - Input field for prompts
  - Document upload button
  - Chat history
  - Loading states

#### 3. AI Risk Assessment Display
- **Purpose**: Show AI-generated risk analysis
- **Fields**:
  - Severity Classification (Critical, Major, Minor)
  - Risk Level
  - Recommended Actions
  - Regulatory Impact
  - Quality Impact Assessment
  - Timeline Recommendations

#### 4. Redux Store Structure
```javascript
{
  complaint: {
    formData: {
      productName: '',
      productStrength: '',
      batchNumber: '',
      // ... other fields
    },
    currentComplaintId: null,
    isSubmitting: false
  },
  riskAssessment: {
    severity: '',
    riskLevel: '',
    recommendedActions: [],
    regulatoryImpact: '',
    qualityImpact: '',
    timeline: ''
  },
  chat: {
    messages: [],
    isLoading: false,
    error: null
  }
}
```

### Backend Components

#### 1. API Endpoints

**POST /api/complaint/log**
- Input: Natural language prompt
- Process: LangGraph extraction → Risk assessment → Database storage
- Output: Structured complaint data + risk assessment

**POST /api/complaint/edit**
- Input: Natural language edit instructions
- Process: Parse changes → Update existing complaint → Re-assess risk
- Output: Updated complaint data + updated risk assessment

**POST /api/complaint/extract**
- Input: Uploaded file (PDF/Email/Image)
- Process: Document parsing → Information extraction → Complaint creation
- Output: Extracted complaint data + risk assessment

**GET /api/complaint/:id**
- Input: Complaint ID
- Process: Database query
- Output: Complete complaint details

**POST /api/chat**
- Input: Chat message
- Process: Context-aware response generation
- Output: AI response

#### 2. LangGraph Workflow

**Complaint Processing Graph**
```
Input Prompt → [Parse User Intent] → [Extract Complaint Data] 
                                      ↓
[Risk Assessment] → [Determine Actions] → [Format Response] → Output
```

**Nodes:**
1. **Parse Intent Node**: Understand user's request type (log/edit/extract)
2. **Extraction Node**: Use LLM to extract structured data from prompt
3. **Risk Assessment Node**: Analyze complaint severity and impact
4. **Decision Node**: Determine appropriate next actions
5. **Format Response Node**: Structure response for frontend consumption

**Document Processing Graph**
```
Document Upload → [Parse Document] → [Extract Text] → [Complaint Graph]
```

#### 3. Database Schema

**complaints table**
```sql
CREATE TABLE complaints (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    product_strength VARCHAR(100),
    batch_number VARCHAR(100),
    manufacturing_date DATE,
    expiry_date DATE,
    affected_quantity VARCHAR(100),
    complaint_description TEXT,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    reporter_name VARCHAR(255),
    reporter_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**risk_assessments table**
```sql
CREATE TABLE risk_assessments (
    id SERIAL PRIMARY KEY,
    complaint_id INTEGER REFERENCES complaints(id),
    severity VARCHAR(50), -- Critical, Major, Minor
    risk_level VARCHAR(50),
    recommended_actions TEXT[],
    regulatory_impact TEXT,
    quality_impact TEXT,
    timeline_recommendation VARCHAR(255),
    ai_reasoning TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) ON DELETE CASCADE
);
```

**chat_history table**
```sql
CREATE TABLE chat_history (
    id SERIAL PRIMARY KEY,
    complaint_id INTEGER REFERENCES complaints(id),
    user_message TEXT,
    ai_response TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) ON DELETE CASCADE
);
```

**documents table**
```sql
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    complaint_id INTEGER REFERENCES complaints(id),
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    file_type VARCHAR(50),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) ON DELETE CASCADE
);
```

## Data Flow

### 1. Log Complaint Flow
```
User: "Apollo Pharmacy reported discolored capsules in amoxicylin capsules 500 mg"
  ↓
Frontend: Send to POST /api/complaint/log
  ↓
Backend: LangGraph processes prompt
  ↓
LLM: Extracts complaint details + performs risk assessment
  ↓
Database: Stores complaint + risk assessment
  ↓
Frontend: Updates form with extracted data
  ↓
Display: Form populated, risk assessment shown
```

### 2. Edit Complaint Flow
```
User: "Sorry, the batch number is BMX24602 and affected quantity is 48 capsules"
  ↓
Frontend: Send to POST /api/complaint/edit with current complaint ID
  ↓
Backend: Parse changes, update database, re-assess risk
  ↓
Database: Update complaint record, update/create risk assessment
  ↓
Frontend: Update form with new data
  ↓
Display: Form updated, risk assessment refreshed
```

### 3. Document Extraction Flow
```
User: Uploads PDF/email
  ↓
Frontend: Send file to POST /api/complaint/extract
  ↓
Backend: Parse document, extract text
  ↓
LangGraph: Process extracted text → Extract complaint data → Risk assessment
  ↓
Database: Store complaint + risk assessment + document metadata
  ↓
Frontend: Update form with extracted data
  ↓
Display: Form populated, risk assessment shown
```

## AI Tools Implementation

### Tool 1: Log Complaint Tool
- **Trigger**: Natural language prompt
- **LLM Model**: gemma2-9b-it
- **Process**: 
  1. Parse complaint details from prompt
  2. Extract structured data (product, batch, dates, etc.)
  3. Perform risk assessment based on complaint type
  4. Generate recommended actions
- **Output**: Complete complaint form data + risk assessment

### Tool 2: Edit Complaint Tool
- **Trigger**: Natural language edit instruction
- **LLM Model**: gemma2-9b-it
- **Process**:
  1. Parse what fields need to be changed
  2. Update only specified fields
  3. Preserve all other data
  4. Re-run risk assessment with new data
- **Output**: Updated complaint data + updated risk assessment

### Tool 3: Document Extraction Tool
- **Trigger**: File upload (PDF/Email)
- **LLM Model**: llama-3.3-70b-versatile (for better context)
- **Process**:
  1. Parse document (PDF → text, Email → body/headers)
  2. Extract complaint information from document text
  3. Perform risk assessment
  4. Allow natural language edits after extraction
- **Output**: Extracted complaint data + risk assessment

## Security Considerations

1. **API Key Management**: Store Groq API key in environment variables
2. **Input Validation**: Validate all user inputs and file uploads
3. **SQL Injection Prevention**: Use parameterized queries via SQLAlchemy
4. **Rate Limiting**: Implement rate limiting on API endpoints
5. **File Upload Security**: Validate file types, scan for malware
6. **Data Encryption**: Encrypt sensitive data at rest

## Performance Considerations

1. **Caching**: Cache LLM responses for similar prompts
2. **Database Indexing**: Add indexes on frequently queried fields
3. **Async Processing**: Use FastAPI's async capabilities for I/O operations
4. **Connection Pooling**: Configure database connection pooling
5. **File Storage**: Use efficient file storage (S3 or local with optimization)

## Scalability Considerations

1. **Horizontal Scaling**: FastAPI can be deployed behind a load balancer
2. **Database Scaling**: PostgreSQL supports read replicas
3. **Queue System**: For heavy document processing, consider task queues (Celery)
4. **CDN**: Serve static assets via CDN
5. **Microservices**: Can split into separate services if needed

## Development Workflow

1. **Phase 1**: Backend setup (FastAPI + Database + LangGraph)
2. **Phase 2**: AI tools implementation (Log, Edit, Extract)
3. **Phase 3**: Frontend setup (React + Redux)
4. **Phase 4**: Frontend-backend integration
5. **Phase 5**: Testing and refinement
6. **Phase 6**: Bonus features (optional)
7. **Phase 7**: Demo preparation

## Bonus Features (Optional)

1. **Complaint Completeness Checker**: Validate required fields
2. **Root Cause Recommendation**: Suggest potential root causes
3. **Duplicate Complaint Detection**: Identify similar existing complaints
4. **CAPA Recommendation**: Suggest Corrective and Preventive Actions
5. **Complaint Summary**: Generate executive summaries
6. **AI Risk Classification**: Enhanced risk categorization
7. **Trend Analysis**: Identify patterns in complaints over time
8. **Multi-language Support**: Support for international pharmaceutical companies

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/complaint_db

# Groq API
GROQ_API_KEY=your_groq_api_key_here

# Application
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8000
```

## Next Steps

1. Set up project structure
2. Initialize database
3. Implement backend API endpoints
4. Create LangGraph workflows
5. Build frontend components
6. Integrate frontend with backend
7. Test all features
8. Deploy and create demo