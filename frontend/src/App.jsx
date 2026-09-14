import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { CssBaseline, Container, Grid, Box, Typography, Tabs, Tab } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ComplaintForm from './components/ComplaintForm';
import FloatingChatbot from './components/FloatingChatbot';
import RiskAssessment from './components/RiskAssessment';
import BonusFeatures from './components/BonusFeatures';

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  palette: {
    primary: {
      main: '#0066ff',
      dark: '#0052cc',
      light: '#e6f0ff',
    },
    secondary: {
      main: '#64748b',
    },
    background: {
      default: '#f8fafc',
    },
  },
});

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 1 }}>{children}</Box>}
    </div>
  );
}

function AppContent() {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Top Navigation Header Banner */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: 'white',
          py: 3,
          px: { xs: 2, md: 4 },
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
            AI-Powered Customer Complaint Management System
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 0.5, color: '#94a3b8', fontWeight: 400 }}>
            Pharmaceutical Quality Management & AI Auto-Extraction Solution
          </Typography>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container maxWidth="xl" sx={{ mt: 3, mb: 6 }}>
        <Box sx={{ borderBottom: 1, borderColor: '#e2e8f0', mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                color: '#64748b',
                '&.Mui-selected': {
                  color: '#0066ff',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#0066ff',
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
            }}
          >
            <Tab label="Main Dashboard" />
            <Tab label="Bonus Features" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={7} xl={8}>
              <ComplaintForm />
            </Grid>
            
            <Grid item xs={12} lg={5} xl={4}>
              <RiskAssessment />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <ComplaintForm />
            </Grid>
            
            <Grid item xs={12} lg={6}>
              <BonusFeatures />
            </Grid>
          </Grid>
        </TabPanel>
      </Container>

      {/* Zoho-style Floating Chatbot Widget */}
      <FloatingChatbot />
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