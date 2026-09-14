# Demo Guide - AI-Powered Customer Complaint Management System

This guide provides a comprehensive walkthrough for creating your demo video as required by the assignment.

## Demo Requirements

According to the assignment, you need to create a 5-10 minute demo video explaining:
1. Working demonstration of all implemented AI tools and frontend features
2. Demonstrate and explain the code by walking through the complete end-to-end workflow
3. Show user input (prompt or PDF/email upload) in the frontend
4. Show relevant frontend code, API endpoints, backend processing, AI/LangGraph workflow
5. Show how the response populates the Log Customer Complaint form and AI Copilot Risk Assessment

## Demo Structure (Recommended 8-10 minutes)

### Part 1: Introduction (1-2 minutes)
- Briefly introduce the project and its purpose
- Mention the technology stack (React, FastAPI, LangGraph, Groq, PostgreSQL)
- Show the GitHub repository
- Mention that this is built for pharmaceutical QMS compliance

### Part 2: System Architecture Overview (1 minute)
- Show the ARCHITECTURE.md file
- Explain the high-level system design
- Show the database schema
- Explain the LangGraph workflow

### Part 3: Backend Setup and Code Walkthrough (2-3 minutes)
- Show the backend structure
- Walk through key files:
  - `backend/main.py` - FastAPI application setup
  - `backend/app/api/complaints.py` - API endpoints
  - `backend/app/graph/complaint_graph.py` - LangGraph workflow
  - `backend/app/services/complaint_service.py` - Business logic
- Explain the Groq LLM integration
- Show the database models

### Part 4: Frontend Setup and Code Walkthrough (1-2 minutes)
- Show the frontend structure
- Walk through key files:
  - `frontend/src/App.jsx` - Main application component
  - `frontend/src/components/ComplaintForm.jsx` - Form component
  - `frontend/src/components/AICopilot.jsx` - Chat interface
  - `frontend/src/components/RiskAssessment.jsx` - Risk display
  - `frontend/src/redux/` - State management
- Explain the Redux store structure

### Part 5: Live Demonstration - Log Complaint Tool (2 minutes)
- Start both backend and frontend servers
- Show the application interface
- **Demonstrate the mandatory Log Complaint tool:**
  - Type in AI Copilot: "Apollo Pharmacy reported discolored capsules in amoxicylin capsules 500 mg"
  - Show the AI processing
  - Show the form being automatically populated
  - Show the risk assessment appearing
  - Explain the data flow from frontend → backend → AI → database → frontend

### Part 6: Live Demonstration - Document Extraction (1-2 minutes)
- **Demonstrate the Document Extraction tool:**
  - Click the attachment icon in AI Copilot
  - Upload one of the sample documents (e.g., `sample_complaint_1.txt`)
  - Show the AI extracting information
  - Show the form being populated with extracted data
  - Show the risk assessment
  - Explain the document processing workflow

### Part 7: Live Demonstration - Edit Complaint Tool (1 minute)
- **Demonstrate the Edit Complaint tool:**
  - After logging a complaint, type: "Sorry, the batch number is BMX24602 and affected quantity is 48 capsules"
  - Show the form updating with new values
  - Show the risk assessment being recalculated
  - Explain the edit workflow

### Part 8: Bonus Features Demonstration (1-2 minutes)
- Switch to the "Bonus Features" tab
- **Demonstrate the Complaint Completeness Checker:**
  - Click "Check Completeness"
  - Show the completeness score and missing fields
- **Demonstrate CAPA Recommendations:**
  - Click "Generate CAPA"
  - Show the corrective and preventive actions
- **Demonstrate other bonus features** (if time permits):
  - Root Causes
  - Duplicate Detection
  - Executive Summary

### Part 9: Conclusion (30 seconds)
- Summarize what was demonstrated
- Mention that all mandatory requirements have been met
- Highlight the bonus features implemented
- Thank the viewers

## Pre-Demo Checklist

Before recording your demo, ensure:

- [ ] Backend server is running (`cd backend && python main.py`)
- [ ] Frontend server is running (`cd frontend && npm run dev`)
- [ ] PostgreSQL database is running and initialized
- [ ] Groq API key is configured in `backend/.env`
- [ ] Sample documents are available in `sample-documents/`
- [ ] All code is pushed to GitHub
- [ ] You have tested all features at least once

## Screen Recording Tips

1. **Use a good screen recording tool** (OBS Studio, Loom, or built-in tools)
2. **Prepare your environment** - Close unnecessary apps and notifications
3. **Practice the flow** - Do a dry run before recording
4. **Speak clearly** - Explain what you're doing as you do it
5. **Show code clearly** - Zoom in on code when explaining
6. **Keep it smooth** - Avoid long pauses or mistakes
7. **Time it well** - Aim for 8-10 minutes total

## Code Highlights to Show

### Backend Code to Highlight:

**1. LangGraph Workflow (`backend/app/graph/complaint_graph.py`)**
```python
# Show the graph building
workflow.add_node("parse_intent", self._parse_intent)
workflow.add_node("extract_complaint_data", self._extract_complaint_data)
workflow.add_node("assess_risk", self._assess_risk)
```

**2. API Endpoints (`backend/app/api/complaints.py`)**
```python
@router.post("/log", response_model=ComplaintWithRiskResponse)
async def log_complaint(request: LogComplaintRequest, db: Session = Depends(get_db))
```

**3. Groq LLM Integration**
```python
self.llm = ChatGroq(
    model="gemma2-9b-it",
    api_key=settings.GROQ_API_KEY,
    temperature=0.1
)
```

### Frontend Code to Highlight:

**1. Redux Store (`frontend/src/redux/store.js`)**
```javascript
export const store = configureStore({
  reducer: {
    complaint: complaintReducer,
    riskAssessment: riskAssessmentReducer,
    chat: chatReducer,
  },
});
```

**2. AI Copilot Component (`frontend/src/components/AICopilot.jsx`)**
```javascript
const handleSendMessage = async () => {
  const response = await complaintAPI.logComplaint(userMessage);
  dispatch(updateFormData(complaintData));
  dispatch(setRiskAssessment(riskData));
};
```

## Demo Script Sample

### Introduction (1 minute)
"Hi, I'm [Your Name], and today I'll be demonstrating the AI-Powered Customer Complaint Management System that I've built for pharmaceutical quality management. This system uses React, FastAPI, LangGraph, and Groq LLMs to automate complaint logging and risk assessment through natural language processing."

### Architecture (30 seconds)
"Let me first show you the system architecture. The system consists of a React frontend with Redux for state management, a FastAPI backend with LangGraph for AI workflows, PostgreSQL for data storage, and Groq's gemma2-9b-it model for natural language processing."

### Backend Code (2 minutes)
"Now let me walk you through the backend code. Here's the main FastAPI application that sets up our API endpoints. The LangGraph workflow in complaint_graph.py processes user prompts through multiple nodes: intent parsing, data extraction, risk assessment, and response formatting. We use Groq's gemma2-9b-it model for all AI processing."

### Frontend Code (1 minute)
"The frontend is built with React and Material-UI. We use Redux Toolkit to manage the application state - complaint data, risk assessment, and chat history. The AI Copilot component handles natural language interactions and automatically updates the form based on AI responses."

### Live Demo - Log Complaint (2 minutes)
"Let me demonstrate the log complaint tool. I'll type 'Apollo Pharmacy reported discolored capsules in amoxicylin capsules 500 mg' in the AI Copilot. Watch how the AI extracts the product details, batch information, and automatically populates the form. It also generates a risk assessment with severity classification and recommended actions."

### Live Demo - Document Extraction (1 minute)
"Now let me show document extraction. I'll upload this sample complaint document. The AI parses the document, extracts all relevant information, and populates the form just like before, but this time from a structured document."

### Live Demo - Edit Complaint (1 minute)
"After logging a complaint, I can edit it using natural language. I'll say 'Sorry, the batch number is BMX24602 and affected quantity is 48 capsules.' The AI understands the change, updates only those fields, and recalculates the risk assessment."

### Bonus Features (1 minute)
"I've also implemented several bonus features. The completeness checker validates that all required fields are filled. The CAPA generator suggests corrective and preventive actions based on the complaint. There's also root cause analysis, duplicate detection, and executive summary generation."

### Conclusion (30 seconds)
"In summary, I've successfully implemented all mandatory AI tools - log complaint, edit complaint, and document extraction - along with several bonus features. The system demonstrates end-to-end AI-powered complaint management for pharmaceutical quality systems. Thank you for watching."

## Common Demo Issues and Solutions

### Issue: Backend won't start
**Solution:** Check that PostgreSQL is running and DATABASE_URL is correct in `.env`

### Issue: AI responses are slow
**Solution:** This is normal with LLMs. Mention that production would use caching

### Issue: Form doesn't update
**Solution:** Check browser console for errors, ensure backend is responding

### Issue: Document extraction fails
**Solution:** Ensure the document format is supported (txt, pdf, docx)

## Final Tips

1. **Be confident** - You built this system, you know it well
2. **Focus on the AI aspects** - That's what the assignment is about
3. **Show the workflow** - Emphasize the end-to-end data flow
4. **Mention the tech stack** - Show you followed the requirements
5. **Keep it engaging** - Show enthusiasm for the project

## Submission

After recording your demo:
1. Upload the video to YouTube (unlisted or private)
2. Submit using the Google Form: https://forms.gle/n8ukhVBtNEWnTydV7
3. Include the GitHub repository link
4. Include the video link in the submission

Good luck with your demo! 🚀