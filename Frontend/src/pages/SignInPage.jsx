import './SignInPage.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

export default function SignInPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, user, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e?.preventDefault();
        try {
            await login({ email, password });
            toast.success(`Logged in sucsessfully!`);
        } catch (err) {
            const msg = err?.response?.data?.message || 'Login failed';
            toast.error(msg);
            console.log(err);
        }
    };

    // If already authenticated, redirect away from sign-in
    useEffect(() => {
        if (!loading && user) navigate('/');
    }, [user, loading, navigate]);


    // Redirect if already logged in
    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);


    return (

        <div className="signin">
            <Toaster position="top-center" />
            <div className="signin-section">
                <div className="content">
                    <div className="heading">Sign In</div>
                    <div className="form-entry">
                        <form method="post" className='form' >
                            {/* <label>Email</label>
                            <input type="email" name="email" required />
                            <label>Password</label>
                            <input type="password" name="Password" required /> */
                            }
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
                        <p className="register-link">Did'nt have account? <Link to={`/register`}>Register</Link></p>
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