import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tabs,
  Tab
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useQuestions } from '../contexts/QuestionsContext';
import { useUser } from '../contexts/UserContext';
import { QuestionImage } from '../components/QuestionImage';
import { useNavigate } from 'react-router-dom';
import { ViewMode } from '../types/navigation';

export const DebugPage = () => {
  const [questionId, setQuestionId] = useState('');
  const { questions } = useQuestions();
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = () => {
    const id = parseInt(questionId);
    if (!isNaN(id)) {
      const question = questions.find(q => q.id === id);
      setCurrentQuestion(question || null);
    }
  };

  if (!currentUser) {
    navigate('/');
    return null;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Welcome, {currentUser.username}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
        <Box sx={{ bgcolor: 'primary.dark' }}>
          <Tabs
            value={ViewMode.DEBUG}
            onChange={(_, value) => {
              if (value === ViewMode.PRACTICE) {
                navigate('/practice');
              } else if (value === ViewMode.EXAM) {
                navigate('/practice?mode=exam');
              }
            }}
            centered
          >
            <Tab label="Practice Questions" value={ViewMode.PRACTICE} />
            <Tab label="Test Examination" value={ViewMode.EXAM} />
            {process.env.NODE_ENV === 'development' && (
              <Tab label="Debug" value={ViewMode.DEBUG} />
            )}
          </Tabs>
        </Box>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box 
            component="form" 
            sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <TextField
              label="Question ID"
              value={questionId}
              onChange={(e) => setQuestionId(e.target.value)}
              type="number"
              sx={{ width: 200 }}
              autoFocus
            />
            <Button variant="contained" type="submit">
              Search
            </Button>
          </Box>

          {currentQuestion ? (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1 }}>
                Question {currentQuestion.id}
              </Typography>

              <Typography variant="body1" paragraph>
                {currentQuestion.text}
              </Typography>

              {currentQuestion.id && (
                <Box sx={{ my: 2 }}>
                  <QuestionImage questionId={currentQuestion.id} />
                </Box>
              )}

              <RadioGroup>
                {currentQuestion.options && Object.entries(currentQuestion.options).map(([key, value]) => (
                  <FormControlLabel
                    key={key}
                    value={key}
                    disabled
                    control={<Radio checked={currentQuestion.correctAnswer === key} />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{`${key}. ${value}`}</span>
                        <CheckCircleIcon 
                          color="success" 
                          sx={{ visibility: currentQuestion.correctAnswer === key ? 'visible' : 'hidden' }}
                        />
                      </Box>
                    }
                    sx={{
                      color: currentQuestion.correctAnswer === key ? 'success.main' : 'inherit',
                      '.MuiFormControlLabel-label': {
                        color: currentQuestion.correctAnswer === key ? 'success.main' : 'inherit'
                      }
                    }}
                  />
                ))}
              </RadioGroup>

              <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1, display: 'inline-block' }}>
                <Typography variant="h6" color="success.main">
                  Correct Answer: {currentQuestion.correctAnswer}
                </Typography>
              </Box>
            </Box>
          ) : questionId !== '' && (
            <Typography color="error">
              Question not found
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
};
