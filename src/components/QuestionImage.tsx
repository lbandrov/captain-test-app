import React from 'react';
import { Box } from '@mui/material';
import { getQuestionImageUrl } from '../utils/imageUtils';

interface QuestionImageProps {
    questionId: number;
}

export const QuestionImage: React.FC<QuestionImageProps> = ({ questionId }) => {
    // We'll use a ref to track image load status
    const imgRef = React.useRef<HTMLImageElement | null>(null);
    const [hasError, setHasError] = React.useState(false);

    // Reset error state when question changes
    React.useEffect(() => {
        setHasError(false);
        if (imgRef.current) {
            imgRef.current.style.display = 'block';
        }
    }, [questionId]);

    if (hasError) return null;

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
                ref={imgRef}
                key={questionId}
                src={getQuestionImageUrl(questionId)}
                alt=""
                onError={() => setHasError(true)}
            />
        </Box>
    );
};
