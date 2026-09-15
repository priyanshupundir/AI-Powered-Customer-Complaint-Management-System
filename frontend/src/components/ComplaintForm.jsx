import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Grid,
  Button,
  Divider,
} from '@mui/material';
import {
  Inventory as ProductIcon,
  ReportProblem as ComplaintIcon,
  Person as CustomerIcon,
  AssignmentInd as ReporterIcon,
  Save as SaveIcon,
  RotateLeft as ClearIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { updateFormData, resetForm } from '../redux/slices/complaintSlice';

const ComplaintForm = () => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.complaint.formData);

  const handleChange = (field) => (event) => {
    dispatch(updateFormData({ [field]: event.target.value }));
  };

  const handleClear = () => {
    dispatch(resetForm());
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3.5 },
        borderRadius: '16px',
        bgcolor: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Header Title */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            bgcolor: '#e6f0ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0066ff',
          }}
        >
          <ComplaintIcon fontSize="medium" />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', letterSpacing: '-0.3px' }}>
            Log Customer Complaint
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Fill in the details below or use the AI Assistant to extract automatically
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Section 1: Product Information */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: '12px',
            bgcolor: '#f8fafc',
            border: '1px solid #f1f5f9',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <ProductIcon sx={{ color: '#0066ff', fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b' }}>
              Product Details
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Product Name"
                value={formData.productName || ''}
                onChange={handleChange('productName')}
                variant="outlined"
                size="small"
                placeholder="e.g. Amoxicillin"
                sx={{ bgcolor: '#ffffff' }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Strength / Grade"
                value={formData.productStrength || ''}
                onChange={handleChange('productStrength')}
                variant="outlined"
                size="small"
                placeholder="e.g. 500 mg"
                sx={{ bgcolor: '#ffffff' }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Batch / Lot Number"
                value={formData.batchNumber || ''}
                onChange={handleChange('batchNumber')}
                variant="outlined"
                size="small"
                placeholder="e.g. LOT-2024-89"
                sx={{ bgcolor: '#ffffff' }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Section 2: Complaint Details & Dates */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: '12px',
            bgcolor: '#f8fafc',
            border: '1px solid #f1f5f9',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <ComplaintIcon sx={{ color: '#0066ff', fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b' }}>
              Complaint & Batch Information
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Affected Quantity"
                value={formData.affectedQuantity || ''}
                onChange={handleChange('affectedQuantity')}
                variant="outlined"
                size="small"
                placeholder="e.g. 50 boxes"
                sx={{ bgcolor: '#ffffff' }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Manufacturing Date"
                type="date"
                value={formData.manufacturingDate || ''}
                onChange={handleChange('manufacturingDate')}
                variant="outlined"
                size="small"
                InputLabelProps={{ 
                  shrink: true,
                  sx: {
                    backgroundColor: '#ffffff',
                    padding: '0 4px',
                    fontSize: '0.85rem',
                    fontWeight: 500
                  }
                }}
                sx={{ 
                  bgcolor: '#ffffff',
                  '& .MuiInputBase-root': {
                    height: '40px'
                  },
                  '& .MuiInputLabel-root': {
                    transform: 'translate(14px, -10px) scale(0.75)',
                    backgroundColor: '#ffffff',
                    padding: '0 4px'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Expiry Date"
                type="date"
                value={formData.expiryDate || ''}
                onChange={handleChange('expiryDate')}
                variant="outlined"
                size="small"
                InputLabelProps={{ 
                  shrink: true,
                  sx: {
                    backgroundColor: '#ffffff',
                    padding: '0 4px',
                    fontSize: '0.85rem',
                    fontWeight: 500
                  }
                }}
                sx={{ 
                  bgcolor: '#ffffff',
                  '& .MuiInputBase-root': {
                    height: '40px'
                  },
                  '& .MuiInputLabel-root': {
                    transform: 'translate(14px, -10px) scale(0.75)',
                    backgroundColor: '#ffffff',
                    padding: '0 4px'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Complaint Description"
                value={formData.complaintDescription || ''}
                onChange={handleChange('complaintDescription')}
                variant="outlined"
                multiline
                rows={3.5}
                placeholder="Describe the complaint in detail..."
                sx={{ bgcolor: '#ffffff' }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Section 3: Customer Information */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: '12px',
            bgcolor: '#f8fafc',
            border: '1px solid #f1f5f9',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CustomerIcon sx={{ color: '#0066ff', fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b' }}>
              Customer Information
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Customer Name"
                value={formData.customerName || ''}
                onChange={handleChange('customerName')}
                variant="outlined"
                size="small"
                placeholder="e.g. Apollo Pharmacy"
                sx={{ bgcolor: '#ffffff' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Customer Email"
                value={formData.customerEmail || ''}
                onChange={handleChange('customerEmail')}
                variant="outlined"
                size="small"
                placeholder="e.g. contact@apollo.com"
                sx={{ bgcolor: '#ffffff' }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Section 4: Reporter Information */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: '12px',
            bgcolor: '#f8fafc',
            border: '1px solid #f1f5f9',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <ReporterIcon sx={{ color: '#0066ff', fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b' }}>
              Reporter Information
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Reporter Name"
                value={formData.reporterName || ''}
                onChange={handleChange('reporterName')}
                variant="outlined"
                size="small"
                placeholder="e.g. John Doe"
                sx={{ bgcolor: '#ffffff' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Reporter Email"
                value={formData.reporterEmail || ''}
                onChange={handleChange('reporterEmail')}
                variant="outlined"
                size="small"
                placeholder="e.g. john.doe@company.com"
                sx={{ bgcolor: '#ffffff' }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2, pt: 1 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              flex: 2,
              bgcolor: '#0066ff',
              py: 1.25,
              borderRadius: '10px',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.95rem',
              boxShadow: '0 4px 12px rgba(0, 102, 255, 0.25)',
              '&:hover': { bgcolor: '#0052cc' },
            }}
          >
            Save Complaint
          </Button>
          <Button
            variant="outlined"
            onClick={handleClear}
            startIcon={<ClearIcon />}
            sx={{
              flex: 1,
              borderColor: '#cbd5e1',
              color: '#64748b',
              py: 1.25,
              borderRadius: '10px',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.95rem',
              '&:hover': { borderColor: '#94a3b8', bgcolor: '#f8fafc' },
            }}
          >
            Clear Form
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ComplaintForm;