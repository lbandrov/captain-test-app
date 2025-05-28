export const getQuestionImageUrl = (questionId: number): string | undefined => {
    // For simplicity and performance, return the path if it exists
    // The actual existence check will be handled by the img element's error handling
    const fullBasePath = window.location.pathname.includes('/captain-test-app') 
        ? '/captain-test-app' 
        : '';
    return `${fullBasePath}/images/question-images/${questionId}.jpeg`;
};
