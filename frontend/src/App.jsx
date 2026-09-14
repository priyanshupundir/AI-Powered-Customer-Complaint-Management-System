import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { CssBaseline, Container, Grid, Box, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ComplaintForm from './components/ComplaintForm';
import AICopilot from './components/AICopilot';
import RiskAssessment from './components/RiskAssessment';

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function AppContent() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100' }}>
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 3, mb: 3 }}>
        <Container maxWidth="xl">
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            AI-Powered Customer Complaint Management System
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9 }}>
            Pharmaceutical Quality Management Solution
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={5}>
            <ComplaintForm />
          </Grid>
          
          <Grid item xs={12} md={6} lg={4}>
            <AICopilot />
          </Grid>
          
          <Grid item xs={12} md={12} lg={3}>
            <RiskAssessment />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

export default App;