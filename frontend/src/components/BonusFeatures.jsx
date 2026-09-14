import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Grid,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Assignment as AssignmentIcon,
  Search as SearchIcon,
  Summarize as SummarizeIcon,
  Troubleshoot as TroubleshootIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { complaintAPI } from '../services/api';

const BonusFeatures = () => {
  const dispatch = useDispatch();
  const complaintData = useSelector((state) => state.complaint.formData);
  const riskAssessment = useSelector((state) => state.riskAssessment);
  
  const [loading, setLoading] = useState(false);
  const [feature, setFeature] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCheckCompleteness = async () => {
    setLoading(true);
    setFeature('completeness');
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/bonus/completeness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complaint_data: complaintData }),
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Failed to check completeness. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCAPA = async () => {
    setLoading(true);
    setFeature('capa');
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/bonus/capa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          complaint_data: complaintData,
          risk_assessment: riskAssessment 
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Failed to generate CAPA recommendations. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleRootCauses = async () => {
    setLoading(true);
    setFeature('root-causes');
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/bonus/root-causes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complaint_data: complaintData }),
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Failed to generate root cause suggestions. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckDuplicates = async () => {
    setLoading(true);
    setFeature('duplicates');
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/bonus/duplicates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complaint_data: complaintData }),
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Failed to check for duplicates. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    setLoading(true);
    setFeature('summary');
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/bonus/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          complaint_data: complaintData,
          risk_assessment: riskAssessment 
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Failed to generate summary. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    switch (feature) {
      case 'completeness':
        return (
          <Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Completeness Score: {result.completeness_score}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={result.completeness_score} 
                sx={{ mb: 2 }}
              />
              <Alert 
                severity={result.is_complete ? 'success' : 'warning'}
                icon={result.is_complete ? <CheckCircleIcon /> : <WarningIcon />}
              >
                {result.is_complete ? 'Complaint is complete!' : 'Complaint needs more information'}
              </Alert>
            </Box>
            
            {result.missing_required_fields.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="error" gutterBottom>
                  Missing Required Fields:
                </Typography>
                <List dense>
                  {result.missing_required_fields.map((field, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={field} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            
            {result.missing_recommended_fields.length > 0 && (
              <Box>
                <Typography variant="subtitle2" color="warning.main" gutterBottom>
                  Missing Recommended Fields:
                </Typography>
                <List dense>
                  {result.missing_recommended_fields.map((field, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={field} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        );

      case 'capa':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              CAPA Recommendations
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                Corrective Actions
              </Typography>
              <List>
                {result.corrective_actions?.map((action, index) => (
                  <Card key={index} sx={{ mb: 1 }}>
                    <CardContent sx={{ py: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        {action.action}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Chip size="small" label={action.priority} color={action.priority === 'High' ? 'error' : 'default'} />
                        <Chip size="small" label={action.timeline} />
                        <Chip size="small" label={action.responsible_party} variant="outlined" />
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </List>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" color="secondary" gutterBottom>
                Preventive Actions
              </Typography>
              <List>
                {result.preventive_actions?.map((action, index) => (
                  <Card key={index} sx={{ mb: 1 }}>
                    <CardContent sx={{ py: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        {action.action}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Chip size="small" label={action.priority} color={action.priority === 'High' ? 'error' : 'default'} />
                        <Chip size="small" label={action.timeline} />
                        <Chip size="small" label={action.responsible_party} variant="outlined" />
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </List>
            </Box>
            
            {result.root_cause_analysis && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Root Cause Analysis:</Typography>
                <Typography variant="body2">{result.root_cause_analysis}</Typography>
              </Alert>
            )}
            
            {result.impact_assessment && (
              <Alert severity="warning">
                <Typography variant="subtitle2">Impact Assessment:</Typography>
                <Typography variant="body2">{result.impact_assessment}</Typography>
              </Alert>
            )}
          </Box>
        );

      case 'root-causes':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Potential Root Causes
            </Typography>
            <List>
              {result.root_causes?.map((cause, index) => (
                <ListItem key={index}>
                  <ListItemText 
                    primary={`${index + 1}. ${cause}`}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        );

      case 'duplicates':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Duplicate Detection
            </Typography>
            {result.has_duplicates ? (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Found {result.duplicate_count} potential duplicate(s)
              </Alert>
            ) : (
              <Alert severity="success" sx={{ mb: 2 }}>
                No duplicates found
              </Alert>
            )}
            
            {result.potential_duplicates?.length > 0 && (
              <List>
                {result.potential_duplicates.map((dup, index) => (
                  <Card key={index} sx={{ mb: 1 }}>
                    <CardContent sx={{ py: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        Complaint #{dup.complaint_id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Product: {dup.product_name} | Batch: {dup.batch_number}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip 
                          size="small" 
                          label={`Similarity: ${dup.similarity_score * 100}%`}
                          color={dup.similarity_score > 0.7 ? 'error' : 'default'}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </List>
            )}
          </Box>
        );

      case 'summary':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Executive Summary
            </Typography>
            <Alert severity="info">
              <Typography variant="body2">
                {result.summary}
              </Typography>
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Bonus AI Features
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<CheckCircleIcon />}
            onClick={handleCheckCompleteness}
            disabled={loading}
          >
            Check Completeness
          </Button>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<AssignmentIcon />}
            onClick={handleGenerateCAPA}
            disabled={loading}
          >
            Generate CAPA
          </Button>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<TroubleshootIcon />}
            onClick={handleRootCauses}
            disabled={loading}
          >
            Root Causes
          </Button>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<SearchIcon />}
            onClick={handleCheckDuplicates}
            disabled={loading}
          >
            Check Duplicates
          </Button>
        </Grid>
        
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<SummarizeIcon />}
            onClick={handleGenerateSummary}
            disabled={loading}
          >
            Generate Summary
          </Button>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {result && !loading && (
        <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
          {renderResult()}
        </Box>
      )}

      {!result && !loading && (
        <Box sx={{ textAlign: 'center', color: 'text.secondary', py: 3 }}>
          <Typography variant="body2">
            Select a feature above to analyze the current complaint
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default BonusFeatures;