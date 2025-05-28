import { Question } from '../types';

export const readQuestionsFromExcel = async (file: string): Promise<Question[]> => {
    try {
        // Get the full base URL for GitHub Pages
        const fullBasePath = window.location.pathname.includes('/captain-test-app') 
            ? '/captain-test-app' 
            : '';
        const url = `${fullBasePath}/questions.json`;
        console.log('Attempting to load questions from:', url);
        
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
        if (!response.ok) {
            console.error('Failed to load questions.json:', {
                status: response.status,
                statusText: response.statusText
            });
            throw new Error(`Failed to load questions.json: ${response.status} ${response.statusText}`);
        }
        
        const jsonData = await response.json();
        console.log('Questions loaded successfully, first question:', jsonData[0]);
        
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
