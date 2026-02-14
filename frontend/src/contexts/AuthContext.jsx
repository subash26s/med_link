import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Set base URL
    axios.defaults.baseURL = 'http://localhost:5000/api';

    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');

            if (token && savedUser && savedUser !== 'undefined') {
                setUser(JSON.parse(savedUser));
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Auth initialization error", error);
            localStorage.clear(); // Clear potentially corrupted state
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (username, password, role) => {
        try {
            const res = await axios.post('/auth/login', { username, password, role });
            if (res.data.auth) {
                const userData = { username: res.data.username, role: res.data.role, name: res.data.name };
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(userData));
                axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
                setUser(userData);
                return { success: true };
            }
            return { success: false, message: res.data.message || "Login failed" };
        } catch (error) {
            console.error("Login failed", error);
            const message = error.response?.data?.message || "Login failed. Please check your connection.";
            return { success: false, message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
