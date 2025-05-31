import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import { ViewMode } from '../types/navigation';

const MainPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const initialMode = searchParams.get('mode') as ViewMode || ViewMode.PRACTICE;
    const [viewMode, setViewMode] = useState<ViewMode>(initialMode);
    const { currentUser, logout } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleViewChange = (newValue: ViewMode) => {
        if (newValue === ViewMode.DEBUG) {
            navigate('/debug');
        } else {
            setViewMode(newValue);
            const searchParams = new URLSearchParams(window.location.search);
            searchParams.set('mode', newValue);
            navigate(`?${searchParams.toString()}`);
        }
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
                    onChange={(_, newValue) => handleViewChange(newValue)}
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
                    {process.env.NODE_ENV === 'development' && (
                        <Tab
                            label="Debug"
                            value={ViewMode.DEBUG}
                        />
                    )}
                </Tabs>
            </AppBar>

            <Container maxWidth="md" sx={{ mt: 4 }}>
                {viewMode === ViewMode.PRACTICE ? (
                    <PracticePage />
                ) : viewMode === ViewMode.EXAM ? (
                    <ExamPage onModeSwitch={() => setViewMode(ViewMode.PRACTICE)} />
                ) : null}
            </Container>
        </Box>
    );
};

export default MainPage;
