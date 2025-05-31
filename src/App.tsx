import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { UserProvider } from './contexts/UserContext';
import { QuestionsProvider } from './contexts/QuestionsContext';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import { DebugPage } from './pages/DebugPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <QuestionsProvider>
          <BrowserRouter basename={process.env.PUBLIC_URL}>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/practice" element={<MainPage />} />
              {process.env.NODE_ENV === 'development' && (
                <Route path="/debug" element={<DebugPage />} />
              )}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </QuestionsProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
