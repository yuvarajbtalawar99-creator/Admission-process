import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { forceLogout } from '../utils/auth.utils';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const bootstrap = async () => {
            if (token) {
                try {
                    const res = await api.get('/auth/status');
                    if (res.data.success) {
                        const { user: backendUser } = res.data.data;
                        setUser({
                            userId: backendUser.id,
                            role: backendUser.role,
                            name: backendUser.name,
                            profileImage: backendUser.profileImage
                        });
                    } else {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        setUser(null);
                        setToken(null);
                    }
                } catch (error) {
                    console.error("Failed to decode token/verify session on boot", error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                    setToken(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        };

        bootstrap();
    }, [token]);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        forceLogout(false);
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading context...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
