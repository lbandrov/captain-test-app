import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
    Container
} from '@mui/material';
import { useUser } from '../contexts/UserContext';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const { users, addUser, setCurrentUser } = useUser();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            addUser(username.trim());
            navigate('/practice');
        }
    };

    const handleUserSelect = (selectedUsername: string) => {
        const user = users.find(u => u.username === selectedUsername);
        if (user) {
            setCurrentUser(user);
            navigate('/practice');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Welcome to Practice Test
                </Typography>

                <Paper sx={{ p: 3, width: '100%', mb: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Enter username"
                            variant="outlined"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            margin="normal"
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={{ mt: 2 }}
                            disabled={!username.trim()}
                        >
                            Start Practice
                        </Button>
                    </form>
                </Paper>

                {users.length > 0 && (
                    <Paper sx={{ width: '100%' }}>
                        <Typography variant="h6" sx={{ p: 2 }}>
                            Previous Users
                        </Typography>
                        <List>
                            {users.map((user, index) => (
                                <ListItem key={index} disablePadding>
                                    <ListItemButton onClick={() => handleUserSelect(user.username)}>
                                        <ListItemText primary={user.username} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                )}
            </Box>
        </Container>
    );
};

export default LoginPage;
