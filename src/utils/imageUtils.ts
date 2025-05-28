export const getQuestionImageUrl = (questionId: number): string | undefined => {
    // For simplicity and performance, return the path if it exists
    // The actual existence check will be handled by the img element's error handling
    return `/images/question-images/${questionId}.jpeg`;
};
