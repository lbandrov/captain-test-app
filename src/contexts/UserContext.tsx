import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface UserContextType {
    currentUser: User | null;
    users: User[];
    setCurrentUser: (user: User | null) => void;
    addUser: (username: string) => void;
    logout: () => void;
    updateUserProgress: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const savedUsers = localStorage.getItem('users');
        if (savedUsers) {
            setUsers(JSON.parse(savedUsers));
        }

        const savedCurrentUser = localStorage.getItem('currentUser');
        if (savedCurrentUser) {
            setCurrentUser(JSON.parse(savedCurrentUser));
        }
    }, []);

    const addUser = (username: string) => {
        const newUser: User = {
            username,
            practiceProgress: {
                answeredQuestions: [],
                incorrectQuestions: [],
                lastAnswers: []
            },
            examHistory: []
        };

        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        setCurrentUser(newUser);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
    };

    const updateUserProgress = (updatedUser: User) => {
        const updatedUsers = users.map(user => 
            user.username === updatedUser.username ? updatedUser : user
        );
        setUsers(updatedUsers);
        setCurrentUser(updatedUser);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
    };

    return (
        <UserContext.Provider value={{ 
            currentUser, 
            users, 
            setCurrentUser, 
            addUser, 
            logout,
            updateUserProgress
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
