import { Question } from '../types';

export const readQuestionsFromExcel = async (file: string): Promise<Question[]> => {
    try {
        console.log('Loading questions from JSON file');
        const response = await fetch('./questions.json');
        if (!response.ok) {
            throw new Error('Failed to load questions.json');
        }
        
        const jsonData = await response.json();
        
        // Map the JSON structure to our Question interface
        const validQuestions = jsonData
            .filter((q: any) => q.correct !== null)
            .map((q: any): Question => ({
                id: q.id,
                text: q.question,
                options: q.answers,
                correctAnswer: q.correct
            }));

        console.log(`Successfully loaded ${validQuestions.length} valid questions`);
        
        return validQuestions;
    } catch (error) {
        console.error('Error loading questions:', error);
        throw error;
    }
};
