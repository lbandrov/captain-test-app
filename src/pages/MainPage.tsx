import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    AppBar,
    Toolbar,
    Typography,
    Tab,
    Tabs,
    IconButton
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useUser } from '../contexts/UserContext';
import PracticePage from './PracticePage';
import ExamPage from './ExamPage';

enum ViewMode {
    PRACTICE = 'practice',
    EXAM = 'exam'
}

const MainPage: React.FC = () => {
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.PRACTICE);
    const { currentUser, logout } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!currentUser) {
        navigate('/');
        return null;
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Welcome, {currentUser.username}
                    </Typography>
                    <IconButton color="inherit" onClick={handleLogout}>
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
                <Tabs
                    value={viewMode}
                    onChange={(_, newValue) => setViewMode(newValue)}
                    centered
                    sx={{ bgcolor: 'primary.dark' }}
                >
                    <Tab
                        label="Practice Questions"
                        value={ViewMode.PRACTICE}
                    />
                    <Tab
                        label="Test Examination"
                        value={ViewMode.EXAM}
                    />
                </Tabs>
            </AppBar>

            <Container maxWidth="md" sx={{ mt: 4 }}>
                {viewMode === ViewMode.PRACTICE ? (
                    <PracticePage />
                ) : (
                    <ExamPage onModeSwitch={() => setViewMode(ViewMode.PRACTICE)} />
                )}
            </Container>
        </Box>
    );
};

export default MainPage;
