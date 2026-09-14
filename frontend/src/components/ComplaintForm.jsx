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
import { useSelector, useDispatch } from 'react-redux';
import { updateFormData } from '../redux/slices/complaintSlice';

const ComplaintForm = () => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.complaint.formData);

  const handleChange = (field) => (event) => {
    dispatch(updateFormData({ [field]: event.target.value }));
  };

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Log Customer Complaint
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Product Name"
            value={formData.productName}
            onChange={handleChange('productName')}
            variant="outlined"
            size="small"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Product Strength/Grade"
            value={formData.productStrength}
            onChange={handleChange('productStrength')}
            variant="outlined"
            size="small"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Batch/Lot Number"
            value={formData.batchNumber}
            onChange={handleChange('batchNumber')}
            variant="outlined"
            size="small"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Affected Quantity"
            value={formData.affectedQuantity}
            onChange={handleChange('affectedQuantity')}
            variant="outlined"
            size="small"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Manufacturing Date"
            type="date"
            value={formData.manufacturingDate}
            onChange={handleChange('manufacturingDate')}
            variant="outlined"
            size="small"
            InputLabelProps={{ 
              shrink: true,
              sx: { 
                backgroundColor: 'white',
                padding: '0 4px'
              }
            }}
            sx={{
              '& .MuiInputBase-root': {
                height: '40px'
              }
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Expiry Date"
            type="date"
            value={formData.expiryDate}
            onChange={handleChange('expiryDate')}
            variant="outlined"
            size="small"
            InputLabelProps={{ 
              shrink: true,
              sx: { 
                backgroundColor: 'white',
                padding: '0 4px'
              }
            }}
            sx={{
              '& .MuiInputBase-root': {
                height: '40px'
              }
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Complaint Details
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Complaint Description"
            value={formData.complaintDescription}
            onChange={handleChange('complaintDescription')}
            variant="outlined"
            multiline
            rows={3}
          />
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Customer Information
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Customer Name"
            value={formData.customerName}
            onChange={handleChange('customerName')}
            variant="outlined"
            size="small"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Customer Email"
            value={formData.customerEmail}
            onChange={handleChange('customerEmail')}
            variant="outlined"
            size="small"
          />
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Reporter Information
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Reporter Name"
            value={formData.reporterName}
            onChange={handleChange('reporterName')}
            variant="outlined"
            size="small"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Reporter Email"
            value={formData.reporterEmail}
            onChange={handleChange('reporterEmail')}
            variant="outlined"
            size="small"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary" fullWidth>
          Save Complaint
        </Button>
        <Button variant="outlined" color="secondary" fullWidth>
          Clear Form
        </Button>
      </Box>
    </Paper>
  );
};

export default ComplaintForm;