import { configureStore } from '@reduxjs/toolkit';
import complaintReducer from './slices/complaintSlice';
import riskAssessmentReducer from './slices/riskAssessmentSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    complaint: complaintReducer,
    riskAssessment: riskAssessmentReducer,
    chat: chatReducer,
  },
});