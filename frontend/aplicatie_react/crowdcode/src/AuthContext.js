import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authToken, setAuthToken] = useState(""); // JWT
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedToken = localStorage.getItem("access_token");
        const savedUser = localStorage.getItem("user");

        if (savedToken) {
            setAuthToken(savedToken);
            setIsAuthenticated(true);
        }
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (token, userData = null) => {
        setAuthToken(token);
        setIsAuthenticated(true);
        if (userData) {
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
        }
        localStorage.setItem("access_token", token);
    };

    const logout = () => {
        setAuthToken("");
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, authToken, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}