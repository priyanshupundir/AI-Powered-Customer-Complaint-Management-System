import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Fab,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Drawer,
  AppBar,
  Toolbar,
  Divider,
  Button,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  SmartToy as RobotIcon,
  Close as CloseIcon,
  Chat as ChatIcon,
  Minimize as MinimizeIcon,
  Maximize as MaximizeIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage, setLoading, clearMessages } from '../redux/slices/chatSlice';
import { updateFormData, setComplaintId } from '../redux/slices/complaintSlice';
import { setRiskAssessment } from '../redux/slices/riskAssessmentSlice';
import { complaintAPI } from '../services/api';

const FloatingChatbot = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const isLoading = useSelector((state) => state.chat.isLoading);
  const [inputMessage, setInputMessage] = useState('');
  const [file, setFile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !file) return;

    const userMessage = inputMessage || (file ? `Uploaded file: ${file.name}` : '');
    
    dispatch(addMessage({ role: 'user', content: userMessage }));
    dispatch(setLoading(true));
    setInputMessage('');
    setFile(null);

    try {
      let response;
      
      if (file) {
        response = await complaintAPI.extractFromDocument(file);
        dispatch(addMessage({ 
          role: 'assistant', 
          content: 'I\'ve extracted the complaint information from your document and populated the form.' 
        }));
      } else {
        response = await complaintAPI.logComplaint(userMessage);
        dispatch(addMessage({ 
          role: 'assistant', 
          content: 'I\'ve logged the complaint and populated the form with the extracted information.' 
        }));
      }
      
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

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="chat"
        onClick={toggleChat}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          borderRadius: '50%',
          width: 56,
          height: 56,
          boxShadow: 3,
        }}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </Fab>

      {/* Chat Drawer */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={toggleChat}
        sx={{
          width: 400,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 400,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <AppBar position="static" sx={{ backgroundColor: 'primary.main' }}>
            <Toolbar>
              <RobotIcon sx={{ mr: 2 }} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                AI Copilot
              </Typography>
              <IconButton color="inherit" onClick={toggleMinimize} size="small">
                {isMinimized ? <MaximizeIcon /> : <MinimizeIcon />}
              </IconButton>
              <IconButton color="inherit" onClick={toggleChat} size="small">
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>

          {!isMinimized && (
            <>
              {/* Chat Messages */}
              <Box sx={{ 
                flex: 1, 
                overflow: 'auto', 
                p: 2, 
                bgcolor: 'grey.50',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {messages.length === 0 ? (
                  <Box sx={{ 
                    textAlign: 'center', 
                    color: 'text.secondary', 
                    mt: 4,
                    px: 2
                  }}>
                    <RobotIcon sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
                    <Typography variant="body1" gutterBottom>
                      AI-Powered Complaint Assistant
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Describe a complaint or upload a document to get started
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Example: "Apollo Pharmacy reported discolored capsules in amoxicylin capsules 500 mg"
                    </Typography>
                  </Box>
                ) : (
                  <List sx={{ py: 0 }}>
                    {messages.map((message, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                          py: 1,
                          px: 0,
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                maxWidth: '85%',
                                p: 2,
                                borderRadius: 2,
                                bgcolor: message.role === 'user' ? 'primary.main' : 'white',
                                color: message.role === 'user' ? 'white' : 'text.primary',
                                boxShadow: 1,
                                wordBreak: 'break-word',
                              }}
                            >
                              <Typography variant="body2">{message.content}</Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                    {isLoading && (
                      <ListItem sx={{ justifyContent: 'flex-start', px: 0 }}>
                        <CircularProgress size={24} />
                      </ListItem>
                    )}
                    <div ref={messagesEndRef} />
                  </List>
                )}
              </Box>

              {/* Input Area */}
              <Box sx={{ p: 2, bgcolor: 'white', borderTop: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.txt"
                  />
                  <IconButton 
                    onClick={() => fileInputRef.current?.click()} 
                    color="primary"
                    size="small"
                  >
                    <AttachFileIcon />
                  </IconButton>
                  
                  {file && (
                    <Chip
                      label={file.name}
                      onDelete={() => setFile(null)}
                      size="small"
                      sx={{ mt: 0.5 }}
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
                    sx={{ flex: 1 }}
                  />
                  
                  <IconButton
                    onClick={handleSendMessage}
                    color="primary"
                    disabled={isLoading || (!inputMessage.trim() && !file)}
                    size="small"
                  >
                    {isLoading ? <CircularProgress size={20} /> : <SendIcon />}
                  </IconButton>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Button 
                    size="small" 
                    onClick={handleClearChat}
                    color="secondary"
                  >
                    Clear Chat
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default FloatingChatbot;