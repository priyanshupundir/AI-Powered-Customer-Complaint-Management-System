import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const RiskAssessment = () => {
  const riskAssessment = useSelector((state) => state.riskAssessment);

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return <ErrorIcon color="error" />;
      case 'major':
        return <WarningIcon color="warning" />;
      case 'minor':
        return <CheckCircleIcon color="success" />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'error';
      case 'major':
        return 'warning';
      case 'minor':
        return 'success';
      default:
        return 'default';
    }
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  if (!riskAssessment.severity && !riskAssessment.riskLevel) {
    return (
      <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          AI Copilot Risk Assessment
        </Typography>
        <Box sx={{ textAlign: 'center', color: 'text.secondary', mt: 4 }}>
          <Typography variant="body1">
            Log a complaint using the AI Copilot to see risk assessment
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        AI Copilot Risk Assessment
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Severity Classification
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          {getSeverityIcon(riskAssessment.severity)}
          <Chip
            label={riskAssessment.severity || 'Not Assessed'}
            color={getSeverityColor(riskAssessment.severity)}
            size="medium"
          />
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Risk Level
        </Typography>
        <Chip
          label={riskAssessment.riskLevel || 'Not Assessed'}
          color={getRiskLevelColor(riskAssessment.riskLevel)}
          size="medium"
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recommended Actions
        </Typography>
        {riskAssessment.recommendedActions && riskAssessment.recommendedActions.length > 0 ? (
          <List dense>
            {riskAssessment.recommendedActions.map((action, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${index + 1}. ${action}`} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No recommended actions available
          </Typography>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Impact Assessment
        </Typography>
        
        {riskAssessment.regulatoryImpact && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <AlertTitle>Regulatory Impact</AlertTitle>
            {riskAssessment.regulatoryImpact}
          </Alert>
        )}
        
        {riskAssessment.qualityImpact && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <AlertTitle>Quality Impact</AlertTitle>
            {riskAssessment.qualityImpact}
          </Alert>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Timeline Recommendation
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
          {riskAssessment.timelineRecommendation || 'Not specified'}
        </Typography>
      </Box>

      {riskAssessment.aiReasoning && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Typography variant="h6" gutterBottom>
              AI Reasoning
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {riskAssessment.aiReasoning}
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default RiskAssessment;