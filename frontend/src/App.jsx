import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { CssBaseline, Container, Grid, Box, Typography, Tabs } from '@mui/material';
import Tab from '@mui/material/Tab';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ComplaintForm from './components/ComplaintForm';
import AICopilot from './components/AICopilot';
import RiskAssessment from './components/RiskAssessment';
import BonusFeatures from './components/BonusFeatures';

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

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function AppContent() {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
        <Box sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Main Dashboard" />
            <Tab label="Bonus Features" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
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
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ComplaintForm />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <BonusFeatures />
            </Grid>
          </Grid>
        </TabPanel>
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