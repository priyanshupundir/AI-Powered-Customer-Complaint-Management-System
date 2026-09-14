import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  formData: {
    productName: '',
    productStrength: '',
    batchNumber: '',
    manufacturingDate: '',
    expiryDate: '',
    affectedQuantity: '',
    complaintDescription: '',
    customerName: '',
    customerEmail: '',
    reporterName: '',
    reporterEmail: '',
  },
  currentComplaintId: null,
  isSubmitting: false,
  error: null,
};

const complaintSlice = createSlice({
  name: 'complaint',
  initialState,
  reducers: {
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setComplaintId: (state, action) => {
      state.currentComplaintId = action.payload;
    },
    setSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.currentComplaintId = null;
      state.error = null;
    },
    loadComplaint: (state, action) => {
      state.formData = action.payload;
    },
  },
});

export const {
  updateFormData,
  setComplaintId,
  setSubmitting,
  setError,
  resetForm,
  loadComplaint,
} = complaintSlice.actions;

export default complaintSlice.reducer;