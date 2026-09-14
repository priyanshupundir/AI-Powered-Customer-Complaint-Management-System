import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  severity: '',
  riskLevel: '',
  recommendedActions: [],
  regulatoryImpact: '',
  qualityImpact: '',
  timelineRecommendation: '',
  aiReasoning: '',
  isLoading: false,
  error: null,
};

const riskAssessmentSlice = createSlice({
  name: 'riskAssessment',
  initialState,
  reducers: {
    setRiskAssessment: (state, action) => {
      return { ...state, ...action.payload };
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetRiskAssessment: (state) => {
      return initialState;
    },
  },
});

export const {
  setRiskAssessment,
  setLoading,
  setError,
  resetRiskAssessment,
} = riskAssessmentSlice.actions;

export default riskAssessmentSlice.reducer;