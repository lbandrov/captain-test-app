import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    Paper,
    CircularProgress
} from '@mui/material';
import { useQuestions } from '../contexts/QuestionsContext';
import { useUser } from '../contexts/UserContext';
import { Question } from '../types';
import { QuestionImage } from '../components/QuestionImage';

export default function PracticePage() {
    const { questions, loading } = useQuestions();
    const { currentUser, updateUserProgress } = useUser();
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');
    const [showResult, setShowResult] = useState(false);

    const selectNextQuestion = React.useCallback(() => {
        if (!currentUser || !questions.length) return;

        const { practiceProgress } = currentUser;
        let availableQuestions: Question[];

        // If all questions are answered in this round, start fresh
        if (practiceProgress.answeredQuestions.length === questions.length) {
            practiceProgress.answeredQuestions = [];
        }

        // Get questions that haven't been answered in this round
        availableQuestions = questions.filter(q => 
            !practiceProgress.answeredQuestions.includes(q.id)
        );

        // If no questions available (shouldn't happen), use all questions
        if (availableQuestions.length === 0) {
            availableQuestions = questions;
        }

        // Select random question from available ones
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        setCurrentQuestion(availableQuestions[randomIndex]);
        setSelectedAnswer('');
        setShowResult(false);
    }, [currentUser, questions]);

    useEffect(() => {
        if (questions.length > 0 && currentUser && !currentQuestion) {
            selectNextQuestion();
        }
    }, [questions, currentUser, selectNextQuestion, currentQuestion]);

    const handleAnswerSubmit = () => {
        if (!currentQuestion || !currentUser) return;

        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
        const updatedUser = { ...currentUser };
        
        // Update last 10 answers
        updatedUser.practiceProgress.lastAnswers = [
            { questionId: currentQuestion.id, correct: isCorrect },
            ...updatedUser.practiceProgress.lastAnswers
        ].slice(0, 10);

        // Update progress tracking
        if (!updatedUser.practiceProgress.answeredQuestions.includes(currentQuestion.id)) {
            updatedUser.practiceProgress.answeredQuestions.push(currentQuestion.id);
        }

        // Update incorrect questions tracking
        const incorrectIndex = updatedUser.practiceProgress.incorrectQuestions.indexOf(currentQuestion.id);
        if (isCorrect && incorrectIndex !== -1) {
            updatedUser.practiceProgress.incorrectQuestions.splice(incorrectIndex, 1);
        } else if (!isCorrect && incorrectIndex === -1) {
            updatedUser.practiceProgress.incorrectQuestions.push(currentQuestion.id);
        }

        updateUserProgress(updatedUser);
        setShowResult(true);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (!currentQuestion) {
        return (
            <Box>
                <Typography color="error" gutterBottom>
                    No questions available.
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Debug info: Questions loaded: {questions.length}, Loading: {loading.toString()}, User: {currentUser ? 'yes' : 'no'}
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    {currentQuestion.text}
                </Typography>

                {/* Add image if it exists for this question */}
                <QuestionImage key={currentQuestion.id} questionId={currentQuestion.id} />

                <RadioGroup
                    value={selectedAnswer}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                >
                    {Object.entries(currentQuestion.options).map(([key, value]) => (
                        <FormControlLabel
                            key={key}
                            value={key}
                            control={<Radio />}
                            label={`${key}. ${value}`}
                            sx={{
                                ...(showResult && {
                                    color: key === currentQuestion.correctAnswer
                                        ? 'success.main'
                                        : key === selectedAnswer
                                            ? 'error.main'
                                            : 'inherit'
                                })
                            }}
                        />
                    ))}
                </RadioGroup>

                {!showResult ? (
                    <Button
                        variant="contained"
                        onClick={handleAnswerSubmit}
                        disabled={!selectedAnswer}
                        sx={{ mt: 2 }}
                    >
                        Check Answer
                    </Button>
                ) : (
                    <Box sx={{ mt: 2 }}>
                        <Typography
                            variant="h6"
                            color={selectedAnswer === currentQuestion.correctAnswer ? 'success.main' : 'error.main'}
                        >
                            {selectedAnswer === currentQuestion.correctAnswer ? 'CORRECT!' : 'WRONG!'}
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={selectNextQuestion}
                            sx={{ mt: 2 }}
                        >
                            Next Question
                        </Button>
                    </Box>
                )}
            </Paper>

            <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Last 10 Answers:
                </Typography>
                <Box display="flex" gap={1}>
                    {currentUser?.practiceProgress.lastAnswers.map((answer, index) => (
                        <Box
                            key={index}
                            sx={{
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                bgcolor: answer.correct ? 'success.main' : 'error.main'
                            }}
                        />
                    ))}
                </Box>
            </Paper>
        </Box>
    );
};
