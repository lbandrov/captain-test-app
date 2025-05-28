import React from 'react';
import { Box } from '@mui/material';
import { getQuestionImageUrl } from '../utils/imageUtils';

interface QuestionImageProps {
    questionId: number;
}

export const QuestionImage: React.FC<QuestionImageProps> = ({ questionId }) => {
    return (
        <Box 
            sx={{ 
                my: 2, 
                display: 'flex', 
                justifyContent: 'center',
                '& img': {
                    maxWidth: '100%',
                    height: 'auto'
                }
            }}
        >
            <img
                src={getQuestionImageUrl(questionId) || undefined}
                alt=""
                onError={(e) => {
                    // Hide the image container if image fails to load
                    const target = e.target as HTMLElement;
                    target.parentElement!.style.display = 'none';
                }}
            />
        </Box>
    );
};
