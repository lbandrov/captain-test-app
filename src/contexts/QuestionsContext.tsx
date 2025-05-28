import React, { createContext, useContext, useState, useEffect } from 'react';
import { Question } from '../types';
import { readQuestionsFromExcel } from '../services/questionService';

interface QuestionsContextType {
    questions: Question[];
    loading: boolean;
    error: string | null;
}

const QuestionsContext = createContext<QuestionsContextType | undefined>(undefined);

export const QuestionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadQuestions = async () => {
            try {
                console.log('Starting to load questions...');
                const loadedQuestions = await readQuestionsFromExcel('./questions.json');
                console.log('Loaded questions:', loadedQuestions);
                
                if (loadedQuestions.length === 0) {
                    throw new Error('No questions were loaded from the Excel file');
                }
                
                setQuestions(loadedQuestions);
                setError(null);
                setLoading(false);
            } catch (err) {
                console.error('Error loading questions:', err);
                setError(err instanceof Error ? err.message : 'Failed to load questions');
                setQuestions([]);
                setLoading(false);
            }
        };

        loadQuestions();
    }, []);

    return (
        <QuestionsContext.Provider value={{ questions, loading, error }}>
            {children}
        </QuestionsContext.Provider>
    );
};

export const useQuestions = () => {
    const context = useContext(QuestionsContext);
    if (context === undefined) {
        throw new Error('useQuestions must be used within a QuestionsProvider');
    }
    return context;
};
