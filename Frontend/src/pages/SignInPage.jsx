import './SignInPage.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function SignInPage() {
    const { showToast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e?.preventDefault();
        try {
            await login({ email, password });
            showToast(`Logged in sucsessfully!`, 'success');
            navigate('/', { replace: true });
        } catch (err) {
            const msg = err?.response?.data?.message || 'Login failed';
            showToast(msg, 'error');
        }
    };


    return (

        <div className="signin">
            <div className="signin-section">
                <div className="content">
                    <div className="heading">Sign In</div>
                    <div className="form-entry">
                        <form method="post" className='form' >
                            <div className="input-group">
                                <input value={email} onChange={e => setEmail(e.target.value)} type="email" id="email" required />
                                <label htmlFor="email">Email</label>
                            </div>


                            <div className="input-group password-group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                                <label htmlFor="password">Password</label>
                                <span
                                    className="toggle-eye"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </span>
                            </div>

                            <button type="submit" onClick={handleSubmit} className="submit">Sign In</button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="welcome-section">
                <span className="welcome">Welcome</span>
                <span className="back">Back!</span>
            </div>
        </div>

    );
}