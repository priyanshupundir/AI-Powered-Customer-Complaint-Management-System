import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  SmartToy as RobotIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage, setLoading, clearMessages } from '../redux/slices/chatSlice';
import { updateFormData, setComplaintId } from '../redux/slices/complaintSlice';
import { setRiskAssessment } from '../redux/slices/riskAssessmentSlice';
import { complaintAPI } from '../services/api';

const AICopilot = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const isLoading = useSelector((state) => state.chat.isLoading);
  const [inputMessage, setInputMessage] = useState('');
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !file) return;

    const userMessage = inputMessage || (file ? `Uploaded file: ${file.name}` : '');
    
    // Add user message to chat
    dispatch(addMessage({ role: 'user', content: userMessage }));
    dispatch(setLoading(true));
    setInputMessage('');
    setFile(null);

    try {
      let response;
      
      if (file) {
        // Handle file upload
        response = await complaintAPI.extractFromDocument(file);
        dispatch(addMessage({ 
          role: 'assistant', 
          content: 'I\'ve extracted the complaint information from your document and populated the form.' 
        }));
      } else {
        // Handle text message - try to determine if it's a log or edit
        // For now, always log as new complaint (edit functionality can be added later)
        response = await complaintAPI.logComplaint(userMessage);
        dispatch(addMessage({ 
          role: 'assistant', 
          content: 'I\'ve logged the complaint and populated the form with the extracted information.' 
        }));
      }
      
      // Update Redux store with complaint data
      if (response && response.complaint) {
        const complaintData = {
          productName: response.complaint.product_name || '',
          productStrength: response.complaint.product_strength || '',
          batchNumber: response.complaint.batch_number || '',
          manufacturingDate: response.complaint.manufacturing_date || '',
          expiryDate: response.complaint.expiry_date || '',
          affectedQuantity: response.complaint.affected_quantity || '',
          complaintDescription: response.complaint.complaint_description || '',
          customerName: response.complaint.customer_name || '',
          customerEmail: response.complaint.customer_email || '',
          reporterName: response.complaint.reporter_name || '',
          reporterEmail: response.complaint.reporter_email || '',
        };
        dispatch(updateFormData(complaintData));
        dispatch(setComplaintId(response.complaint.id));
      }
      
      // Update Redux store with risk assessment
      if (response && response.risk_assessment) {
        const riskData = {
          severity: response.risk_assessment.severity || '',
          riskLevel: response.risk_assessment.risk_level || '',
          recommendedActions: response.risk_assessment.recommended_actions || [],
          regulatoryImpact: response.risk_assessment.regulatory_impact || '',
          qualityImpact: response.risk_assessment.quality_impact || '',
          timelineRecommendation: response.risk_assessment.timeline_recommendation || '',
          aiReasoning: response.risk_assessment.ai_reasoning || '',
        };
        dispatch(setRiskAssessment(riskData));
      }
      
    } catch (error) {
      dispatch(addMessage({ 
        role: 'assistant', 
        content: `Error: ${error.message || 'Failed to process your request'}` 
      }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    dispatch(clearMessages());
  };

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <RobotIcon color="primary" />
          AI Copilot
        </Typography>
        <Button size="small" onClick={handleClearChat}>
          Clear Chat
        </Button>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', mb: 2, bgcolor: 'grey.50', borderRadius: 1, p: 2 }}>
        {messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', color: 'text.secondary', mt: 4 }}>
            <RobotIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="body1">
              Start a conversation to log or edit complaints
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Try: "Apollo Pharmacy reported discolored capsules in amoxicylin capsules 500 mg"
            </Typography>
          </Box>
        ) : (
          <List>
            {messages.map((message, index) => (
              <React.Fragment key={index}>
                <ListItem
                  sx={{
                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                    py: 1,
                  }}
                >
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          maxWidth: '80%',
                          p: 2,
                          borderRadius: 2,
                          bgcolor: message.role === 'user' ? 'primary.main' : 'white',
                          color: message.role === 'user' ? 'white' : 'text.primary',
                          boxShadow: 1,
                        }}
                      >
                        <Typography variant="body2">{message.content}</Typography>
                      </Box>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
            {isLoading && (
              <ListItem sx={{ justifyContent: 'flex-start' }}>
                <CircularProgress size={24} />
              </ListItem>
            )}
            <div ref={messagesEndRef} />
          </List>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.txt"
        />
        <IconButton onClick={() => fileInputRef.current?.click()} color="primary">
          <AttachFileIcon />
        </IconButton>
        
        {file && (
          <Chip
            label={file.name}
            onDelete={() => setFile(null)}
            size="small"
            sx={{ mt: 1 }}
          />
        )}
        
        <TextField
          fullWidth
          multiline
          maxRows={3}
          placeholder="Describe the complaint or upload a document..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          variant="outlined"
          size="small"
          disabled={isLoading}
        />
        
        <IconButton
          onClick={handleSendMessage}
          color="primary"
          disabled={isLoading || (!inputMessage.trim() && !file)}
        >
          {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </Box>
    </Paper>
  );
};

export default AICopilot;