import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState('');

    useEffect(() => {
        const savedToken = localStorage.getItem('github_token');
        if (savedToken) {
            setToken(savedToken);
            setIsAuthenticated(true);
        }
    }, []);

    const login = (token) => {
        setToken(token);
        setIsAuthenticated(true);
        localStorage.setItem('github_token', token);
    };

    const logout = () => {
        setToken('');
        setIsAuthenticated(false);
        localStorage.removeItem('github_token');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
