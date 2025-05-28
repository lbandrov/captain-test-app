export interface Question {
    id: number;
    text: string;
    options: {
        А: string;
        Б: string;
        В: string;
        Г: string;
    };
    correctAnswer: 'А' | 'Б' | 'В' | 'Г';
}

export interface User {
    username: string;
    practiceProgress: {
        answeredQuestions: number[];
        incorrectQuestions: number[];
        lastAnswers: Array<{
            questionId: number;
            correct: boolean;
        }>;
    };
    examHistory: Array<{
        date: string;
        passed: boolean;
        score: number;
        totalQuestions: number;
        timeSpent: string;
    }>;
}

export interface ExamQuestion extends Question {
    userAnswer?: 'А' | 'Б' | 'В' | 'Г';
}

export interface ExamState {
    questions: ExamQuestion[];
    startTime: string;
    currentQuestionIndex: number;
    isComplete: boolean;
}
