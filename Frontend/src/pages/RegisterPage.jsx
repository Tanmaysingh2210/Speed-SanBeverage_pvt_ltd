
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import './RegisterPage.css';
import { useDepo } from "../context/depoContext";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [depo, setDepo] = useState('');
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [otpStep, setOtpStep] = useState(false);
    const { depos, loading } = useDepo();
    // OTP state
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [countdown, setCountdown] = useState(10);

    const { register, verifyOtp, resendOtp, user } = useAuth();
    const navigate = useNavigate();


    const matchedDepo = Array.isArray(depos)
        ? depos.find((sm) => String(sm.depoName || '').toUpperCase() === String(depo || '').toUpperCase())
        : null;

    // Handle OTP input change
    const handleOtpChange = (index, value) => {
        if (/^\d?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto focus next
            if (value && index < 5) {
                document.getElementById(`otp-${index + 1}`).focus();
            }
        }
    };

    // Countdown for resend
    useEffect(() => {
        let timer;
        if (otpStep && countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown, otpStep]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        if (!matchedDepo) {
            toast.error("Please select a valid depo");
            setSubmitting(false);
            return;
        }
        try {
            await register({ name, email, password, depo: matchedDepo._id });
            toast.success(`OTP sent to ${email}`);
            setOtpStep(true);
            setCountdown(10);
        } catch (err) {
            const msg = err?.response?.data?.message || 'Registration failed';
            toast.error(msg);
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const code = otp.join('');
            if (code.length !== 6) {
                toast.error('Enter 6-digit OTP');
                return;
            }
            const msg = await verifyOtp({ email, otp: code });
            toast.success(msg || 'OTP verified successfully!');
            navigate('/dashboard');
        } catch (err) {
            console.log(err);
            const backendMessage = err?.response?.data?.message || err?.response?.data?.error || 'Invalid OTP';
            toast.error(backendMessage);
            throw err;
        }
    };

    const handleResendOtp = async () => {
        try {
            await resendOtp(email);
            toast.success(`OTP resent to ${email}`);
            setCountdown(10);
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to resend OTP');
        }
    };

    // Redirect if already logged in
    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);


    return (
        <div className='register'>
            <Toaster position="top-center" />

            <div className="left">
                <div className='heading'>WELCOME!</div>
                <div className="empty"></div>
            </div>

            <div className="right">
                <div>
                    {!otpStep ? (
                        <>
                            <div className="head">Register</div>
                            <div className="form-box">
                                <form method='post' onSubmit={handleSubmit} className='form'>
                                    <div className="input-group">
                                        <input value={name} onChange={e => setName(e.target.value)} type="text" id="name" required />
                                        <label htmlFor="name">Name</label>
                                    </div>

                                    <div className="input-group">
                                        <input value={email} onChange={e => setEmail(e.target.value)} type="email" id="email" required />
                                        <label htmlFor="email">Email</label>
                                    </div>

                                    <div className="input-group password-group">
                                        <input
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
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

                                    <div className="input-group depo-group">
                                        {/* <input value={depo} onChange={e => setDepo(e.target.value)} type="text" id="depo" required />
                                            <label htmlFor="depo">Depo. Name</label> */}
                                        {/* <label htmlFor = "depo">Depo. Name</label> */}
                                        <select
                                            value={depo}
                                            onChange={(e) => setDepo(e.target.value)}

                                        >
                                            <option value="">
                                                Depo. Name
                                            </option>
                                            {loading ? (
                                                <option disabled>Loading...</option>
                                            ) : (
                                                depos.map((c) => (
                                                    <option key={c._id || c} value={c.depoName || c}>{c.depoName || c}</option>
                                                ))
                                            )
                                            }
                                        </select>
                                    </div>

                                    <div style={{ marginTop: 12 }}>
                                        <button className='btn' type='submit' disabled={submitting}>
                                            {submitting ? 'Registering...' : 'Register'}
                                        </button>
                                    </div>

                                    {/* {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>} */}
                                </form>
                            </div>
                            <p>Already User? <Link to="/signin">Sign in</Link></p>
                        </>
                    ) : (
                        <>
                            <div className="head">OTP Verification</div>
                            <p className="otp-info">OTP sent to <b>{email}</b></p>

                            <div className="otp-box">
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        id={`otp-${i}`}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                        className="otp-input"
                                    />
                                ))}
                            </div>

                            <div className="otp-actions">
                                <button className="btn" onClick={handleVerifyOtp}>Verify OTP</button>
                                <button
                                    className="btn resend"
                                    onClick={handleResendOtp}
                                    disabled={countdown > 0}
                                >
                                    {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
