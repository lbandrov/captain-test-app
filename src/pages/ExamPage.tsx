import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    Paper,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    LinearProgress
} from '@mui/material';
import { format } from 'date-fns';
import { useQuestions } from '../contexts/QuestionsContext';
import { useUser } from '../contexts/UserContext';
import { ExamState } from '../types';
import { QuestionImage } from '../components/QuestionImage';

const QUESTIONS_PER_EXAM = 60; // Configurable
const MAX_WRONG_ANSWERS = 9; // Configurable

export default function ExamPage({ onModeSwitch }: { onModeSwitch: () => void }) {
    const { questions, loading } = useQuestions();
    const { currentUser, updateUserProgress } = useUser();
    const [examState, setExamState] = useState<ExamState | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [navigateAction, setNavigateAction] = useState<(() => void) | null>(null);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (examState && !examState.isComplete) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [examState]);

    const startNewExam = () => {
        if (!questions.length) return;

        const shuffled = [...questions]
            .sort(() => Math.random() - 0.5)
            .slice(0, QUESTIONS_PER_EXAM)
            .map(q => ({ ...q }));

        setExamState({
            questions: shuffled,
            startTime: new Date().toISOString(),
            currentQuestionIndex: 0,
            isComplete: false
        });
    };

    const handleNavigate = (action: () => void) => {
        if (examState && !examState.isComplete) {
            setNavigateAction(() => action);
            setShowConfirmDialog(true);
        } else {
            action();
        }
    };

    const handleAnswer = (answer: string) => {
        if (!examState) return;

        const updatedQuestions = [...examState.questions];
        updatedQuestions[examState.currentQuestionIndex] = {
            ...updatedQuestions[examState.currentQuestionIndex],
            userAnswer: answer as 'А' | 'Б' | 'В' | 'Г'
        };

        setExamState({
            ...examState,
            questions: updatedQuestions
        });
    };

    const navigate = (direction: 'prev' | 'next') => {
        if (!examState) return;

        const newIndex = direction === 'next'
            ? examState.currentQuestionIndex + 1
            : examState.currentQuestionIndex - 1;

        if (newIndex >= 0 && newIndex < examState.questions.length) {
            setExamState({
                ...examState,
                currentQuestionIndex: newIndex
            });
        }
    };

    const completeExam = () => {
        if (!examState || !currentUser) return;

        const endTime = new Date();
        const startTime = new Date(examState.startTime);
        const timeSpent = format(
            new Date(endTime.getTime() - startTime.getTime()),
            'HH:mm:ss'
        );

        const correctAnswers = examState.questions.filter(
            q => q.userAnswer === q.correctAnswer
        ).length;

        const wrongAnswers = QUESTIONS_PER_EXAM - correctAnswers;
        const passed = wrongAnswers <= MAX_WRONG_ANSWERS;

        const updatedUser = {
            ...currentUser,
            examHistory: [
                {
                    date: new Date().toISOString(),
                    passed,
                    score: correctAnswers,
                    totalQuestions: QUESTIONS_PER_EXAM,
                    timeSpent
                },
                ...currentUser.examHistory
            ].slice(0, 10)
        };

        updateUserProgress(updatedUser);
        setExamState({
            ...examState,
            isComplete: true
        });
    };

    const currentQuestion = examState?.questions[examState.currentQuestionIndex];
    const canComplete = examState?.questions.every(q => q.userAnswer);

    const handleModeSwitch = () => {
        handleNavigate(onModeSwitch);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (!examState) {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={startNewExam}
                >
                    Start New Examination
                </Button>

                {currentUser && currentUser.examHistory && currentUser.examHistory.length > 0 && (
                    <Paper sx={{ p: 2, width: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                            Last 10 Examinations:
                        </Typography>
                        <Box display="flex" gap={1}>
                            {currentUser.examHistory.map((exam, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: '50%',
                                        bgcolor: exam.passed ? 'success.main' : 'error.main'
                                    }}
                                />
                            ))}
                        </Box>
                    </Paper>
                )}
            </Box>
        );
    }

    if (examState.isComplete) {
        const results = {
            correct: examState.questions.filter(q => q.userAnswer === q.correctAnswer).length,
            total: examState.questions.length,
            timeSpent: format(
                new Date(new Date().getTime() - new Date(examState.startTime).getTime()),
                'HH:mm:ss'
            )
        };

        return (
            <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
                <Paper sx={{ p: 3, width: '100%' }}>
                    <Typography variant="h5" gutterBottom>
                        Examination Results
                    </Typography>
                    <Typography variant="h6">
                        Score: {results.correct} / {results.total}
                    </Typography>
                    <Typography variant="body1">
                        Time taken: {results.timeSpent}
                    </Typography>
                    <Typography
                        variant="h4"
                        color={results.total - results.correct <= MAX_WRONG_ANSWERS ? 'success.main' : 'error.main'}
                        sx={{ mt: 2 }}
                    >
                        {results.total - results.correct <= MAX_WRONG_ANSWERS ? 'PASSED' : 'FAILED'}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={startNewExam}
                        sx={{ mt: 2 }}
                    >
                        Start New Examination
                    </Button>
                </Paper>
            </Box>
        );
    }

    return (
        <Box>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ mb: 2 }}>
                    <LinearProgress
                        variant="determinate"
                        value={(examState.questions.filter(q => q.userAnswer).length / QUESTIONS_PER_EXAM) * 100}
                    />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Question {examState.currentQuestionIndex + 1} of {QUESTIONS_PER_EXAM}
                    </Typography>
                </Box>

                <Typography variant="h6" gutterBottom>
                    {currentQuestion?.text}
                </Typography>

                {currentQuestion && <QuestionImage questionId={currentQuestion.id} />}

                <RadioGroup
                    value={currentQuestion?.userAnswer || ''}
                    onChange={(e) => handleAnswer(e.target.value)}
                >
                    {currentQuestion && Object.entries(currentQuestion.options).map(([key, value]) => (
                        <FormControlLabel
                            key={key}
                            value={key}
                            control={<Radio />}
                            label={`${key}. ${value}`}
                        />
                    ))}
                </RadioGroup>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('prev')}
                        disabled={examState.currentQuestionIndex === 0}
                    >
                        Previous
                    </Button>
                    {examState.currentQuestionIndex === examState.questions.length - 1 ? (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={completeExam}
                            disabled={!canComplete}
                        >
                            Complete Examination
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={() => navigate('next')}
                        >
                            Next
                        </Button>
                    )}
                </Box>
            </Paper>

            <Dialog
                open={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
            >
                <DialogTitle>
                    Warning
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Your examination progress will be lost. Are you sure you want to continue?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowConfirmDialog(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            setShowConfirmDialog(false);
                            if (navigateAction) {
                                navigateAction();
                            }
                        }}
                        color="error"
                    >
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
