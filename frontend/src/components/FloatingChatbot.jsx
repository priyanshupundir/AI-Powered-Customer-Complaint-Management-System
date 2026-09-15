import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Fab,
  Chip,
  CircularProgress,
  Button,
  Fade,
  Divider,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  SmartToy as RobotIcon,
  Close as CloseIcon,
  Chat as ChatIcon,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon,
  ForumOutlined as ForumIcon,
  ArrowBack as ArrowBackIcon,
  Apartment as BuildingIcon,
  Chat as ChatBubbleIcon,
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
  const currentFormData = useSelector((state) => state.complaint.formData);
  const currentComplaintId = useSelector((state) => state.complaint.currentComplaintId);
  const [inputMessage, setInputMessage] = useState('');
  const [file, setFile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'chat'
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, activeTab, isOpen]);

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
          content: "I've extracted the complaint information from your document and populated the form." 
        }));
      } else {
        // Check if this is an edit request or a new complaint
        const editKeywords = ['change', 'update', 'modify', 'replace', 'edit', 'correct', 'fix'];
        const isEditRequest = editKeywords.some(keyword => 
          userMessage.toLowerCase().includes(keyword)
        ) && (currentFormData.productName || currentFormData.batchNumber);
        
        if (isEditRequest && currentComplaintId) {
          // Use edit endpoint for existing complaints
          response = await complaintAPI.editComplaint(currentComplaintId, userMessage);
          dispatch(addMessage({ 
            role: 'assistant', 
            content: "I've updated the complaint based on your instructions." 
          }));
        } else {
          // Use log endpoint for new complaints
          response = await complaintAPI.logComplaint(userMessage);
          dispatch(addMessage({ 
            role: 'assistant', 
            content: "I've logged the complaint and populated the form with the extracted information." 
          }));
        }
      }
      
      if (response && response.complaint) {
        // For edits, completely replace with new data from backend
        // For new complaints, use the response data
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
  };

  const startChat = () => {
    setActiveTab('chat');
  };

  return (
    <>
      {/* Zoho-style Popup Widget Box */}
      <Fade in={isOpen} unmountOnExit mountOnEnter>
        <Paper
          elevation={12}
          sx={{
            position: 'fixed',
            bottom: 92,
            right: 24,
            width: 375,
            height: 560,
            zIndex: 1200,
            borderRadius: '24px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0px 12px 32px rgba(0, 82, 204, 0.18)',
            backgroundColor: '#ffffff',
            border: '1px solid rgba(0, 102, 204, 0.08)',
          }}
        >
          {/* Header Banner - Blue Zoho Style */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #0052cc 0%, #0066ff 100%)',
              color: '#ffffff',
              pt: 3,
              pb: activeTab === 'home' ? 4 : 2,
              px: 3,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Top row controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              {activeTab === 'chat' ? (
                <IconButton
                  size="small"
                  onClick={() => setActiveTab('home')}
                  sx={{ color: 'white', p: 0.5 }}
                >
                  <ArrowBackIcon fontSize="small" />
                </IconButton>
              ) : (
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <BuildingIcon sx={{ color: 'white', fontSize: 24 }} />
                </Box>
              )}

              <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.8rem' }}>
                {activeTab === 'chat' ? 'Conversation' : 'HelpDesk-AI'}
              </Typography>
            </Box>

            {/* Title / Header text */}
            {activeTab === 'home' ? (
              <Box sx={{ mt: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.3px', mb: 0.5 }}>
                  HelpDesk-Sales
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 400 }}>
                  We are here to help you!
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  AI Complaint Assistant
                </Typography>
                <Button
                  size="small"
                  onClick={handleClearChat}
                  sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', textTransform: 'none' }}
                >
                  Clear Chat
                </Button>
              </Box>
            )}
          </Box>

          {/* Main Body Area */}
          <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden', bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
            {activeTab === 'home' ? (
              /* HOME TAB CONTENT */
              <Box sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Zoho Chat Action Card - Overlapping effect */}
                <Paper
                  onClick={startChat}
                  elevation={2}
                  sx={{
                    mt: -3,
                    p: 2,
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    border: '1px solid #e2e8f0',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(0, 102, 255, 0.12)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        bgcolor: '#e6f0ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ChatBubbleIcon sx={{ color: '#0066ff' }} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                      Chat with us now
                    </Typography>
                  </Box>
                  <ChevronRightIcon sx={{ color: '#64748b' }} />
                </Paper>

                {/* Sub info / description */}
                <Box sx={{ mt: 3, px: 1, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                    Describe your complaint or upload documents directly. Our AI assistant will automatically fill out your complaint details.
                  </Typography>
                </Box>
              </Box>
            ) : (
              /* CONVERSATION TAB CONTENT */
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                {/* Chat Messages */}
                <Box
                  sx={{
                    flex: 1,
                    overflowY: 'auto',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                  }}
                >
                  {messages.length === 0 ? (
                    <Box sx={{ textAlign: 'center', color: '#64748b', my: 'auto', px: 2 }}>
                      <RobotIcon sx={{ fontSize: 44, color: '#0066ff', mb: 1, opacity: 0.8 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b', mb: 0.5 }}>
                        How can I help you today?
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        E.g., "Customer reported defective capsules in Lot #1024" or upload a file.
                      </Typography>
                    </Box>
                  ) : (
                    messages.map((message, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                        }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            maxWidth: '82%',
                            px: 2,
                            py: 1.25,
                            borderRadius: message.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                            bgcolor: message.role === 'user' ? '#0066ff' : '#ffffff',
                            color: message.role === 'user' ? '#ffffff' : '#1e293b',
                            border: message.role === 'user' ? 'none' : '1px solid #e2e8f0',
                            fontSize: '0.875rem',
                            lineHeight: 1.5,
                            boxShadow: message.role === 'user' ? '0 2px 8px rgba(0,102,255,0.25)' : '0 1px 3px rgba(0,0,0,0.05)',
                            wordBreak: 'break-word',
                          }}
                        >
                          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                            {message.content}
                          </Typography>
                        </Paper>
                      </Box>
                    ))
                  )}

                  {isLoading && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1, color: '#0066ff' }}>
                      <CircularProgress size={18} color="inherit" />
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        AI is thinking...
                      </Typography>
                    </Box>
                  )}
                  <div ref={messagesEndRef} />
                </Box>

                {/* File chip if selected */}
                {file && (
                  <Box sx={{ px: 2, pt: 1, bgcolor: '#ffffff' }}>
                    <Chip
                      label={file.name}
                      onDelete={() => setFile(null)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                )}

                {/* Input Controls */}
                <Box
                  sx={{
                    p: 1.5,
                    bgcolor: '#ffffff',
                    borderTop: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.txt"
                  />
                  <IconButton
                    onClick={() => fileInputRef.current?.click()}
                    size="small"
                    sx={{ color: '#64748b' }}
                  >
                    <AttachFileIcon fontSize="small" />
                  </IconButton>

                  <TextField
                    fullWidth
                    placeholder="Write a message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    variant="outlined"
                    size="small"
                    disabled={isLoading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '20px',
                        backgroundColor: '#f8fafc',
                        fontSize: '0.875rem',
                        '& fieldset': { borderColor: '#e2e8f0' },
                        '&:hover fieldset': { borderColor: '#cbd5e1' },
                        '&.Mui-focused fieldset': { borderColor: '#0066ff' },
                      },
                    }}
                  />

                  <IconButton
                    onClick={handleSendMessage}
                    disabled={isLoading || (!inputMessage.trim() && !file)}
                    sx={{
                      bgcolor: '#0066ff',
                      color: '#ffffff',
                      '&:hover': { bgcolor: '#0052cc' },
                      '&.Mui-disabled': { bgcolor: '#cbd5e1', color: '#ffffff' },
                      width: 36,
                      height: 36,
                    }}
                  >
                    <SendIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              </Box>
            )}
          </Box>

          {/* Zoho Style Navigation Footer */}
          <Divider sx={{ borderColor: '#f1f5f9' }} />
          <Box sx={{ bgcolor: '#ffffff', px: 2, pt: 0.5, pb: 0.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
              <Button
                onClick={() => setActiveTab('home')}
                sx={{
                  flex: 1,
                  flexDirection: 'column',
                  gap: 0.25,
                  textTransform: 'none',
                  py: 0.75,
                  color: activeTab === 'home' ? '#0066ff' : '#64748b',
                  borderBottom: activeTab === 'home' ? '2px solid #0066ff' : '2px solid transparent',
                  borderRadius: 0,
                }}
              >
                <HomeIcon fontSize="small" />
                <Typography variant="caption" sx={{ fontWeight: activeTab === 'home' ? 700 : 400, fontSize: '0.725rem' }}>
                  Home
                </Typography>
              </Button>

              <Button
                onClick={() => setActiveTab('chat')}
                sx={{
                  flex: 1,
                  flexDirection: 'column',
                  gap: 0.25,
                  textTransform: 'none',
                  py: 0.75,
                  color: activeTab === 'chat' ? '#0066ff' : '#64748b',
                  borderBottom: activeTab === 'chat' ? '2px solid #0066ff' : '2px solid transparent',
                  borderRadius: 0,
                }}
              >
                <ForumIcon fontSize="small" />
                <Typography variant="caption" sx={{ fontWeight: activeTab === 'chat' ? 700 : 400, fontSize: '0.725rem' }}>
                  Conversation
                </Typography>
              </Button>
            </Box>

            {/* Small Footer Branding */}
            <Typography
              variant="caption"
              display="block"
              align="center"
              sx={{ color: '#94a3b8', fontSize: '0.65rem', py: 0.5 }}
            >
              Driven by AI Copilot
            </Typography>
          </Box>
        </Paper>
      </Fade>

      {/* Floating Action Button (Zoho Style Round Button Bottom Right) */}
      <Fab
        onClick={toggleChat}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1300,
          bgcolor: '#0066ff',
          color: '#ffffff',
          width: 60,
          height: 60,
          boxShadow: '0 8px 24px rgba(0, 102, 255, 0.4)',
          '&:hover': {
            bgcolor: '#0052cc',
          },
        }}
      >
        {isOpen ? <CloseIcon sx={{ fontSize: 28 }} /> : <ChatIcon sx={{ fontSize: 28 }} />}
      </Fab>
    </>
  );
};

export default FloatingChatbot;