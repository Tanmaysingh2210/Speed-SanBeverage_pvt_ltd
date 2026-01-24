import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await api.get('/auth/me');//check
                setUser(res.data.user || null);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    async function login(payload) {
        try {
            const res = await api.post('/auth/login', payload);
            if (res.data.user) {
                setIsAuthenticated(true);
                setUser(res.data.user);
            } else {
                const me = await api.get('/auth/me');
                setUser(me.data.user);
            }
            return res.data.message;
        } catch (err) {
            throw err.response?.data || { message: "Login Failed" };
        }
    }

    async function register(payload) {
        try {
            const res = await api.post('/auth/register', payload);
            const newUser = res.data.user;
            return newUser;
        } catch (err) {
            throw err;
        }
    }

    async function resendOtp(email) {
        try {
            const res = await api.post('/auth/resend_otp', { email });
            return res || { message: "Otp resended sucessfully" };
        } catch (err) {
            throw err.response?.data || { message: "Error resending otp" };
        }
    }

    async function verifyOtp(payload) {
        try {
            const res = await api.post('/auth/verify_otp', payload);
            const verifiedUser = res.data.user;
            return res.data.message; // "OTP verified successfully"
        } catch (err) {
            console.error("OTP verification failed:", err.response?.data || err.message);
            throw err.response?.data || { message: "OTP verification failed" };
        }
    }

    async function logout() {
        await api.post('/auth/logout');
        setIsAuthenticated(false);
        setUser(null);
        if (navigate) navigate('/signin');
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register, verifyOtp, resendOtp, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );

}

export function useAuth() {
    return useContext(AuthContext);
}