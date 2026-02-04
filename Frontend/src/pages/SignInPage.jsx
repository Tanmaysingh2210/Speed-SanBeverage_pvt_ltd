import './SignInPage.css';
import './RegisterPage.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function SignInPage() {
    const { showToast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, forgotPass, verifyResetPassOtp, resetPassword, loading } = useAuth();
    const navigate = useNavigate();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [submitting, setSubmitting] = useState(false);
    const [step, setStep] = useState("login");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    const handleSubmit = async (e) => {
        e?.preventDefault();
        setSubmitting(true);
        try {
            const res = await login({ email, password });
            showToast(res.message || `Logged in sucsessfully!`, 'success');
            navigate('/', { replace: true });
        } catch (err) {
            const msg = err.message || 'Login failed';
            showToast(msg, 'error');
        } finally {
            setSubmitting(false);
        }
    };

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

    const handleSendOtp = async (e) => {
        e?.preventDefault();
        setSubmitting(true);
        try {
            const res = await forgotPass({ email });
            showToast(res || "Verify Otp sent", 'success');
            setStep("otp");
        } catch (err) {
            const errorMessage = err?.message || err?.data?.message || "Error sending otp";
            showToast(errorMessage, "error");
        } finally {
            setSubmitting(false);
        }
    }

    const handleVerifyOtp = async () => {
        try {
            const code = otp.join('');
            if (code.length !== 6) {
                showToast('Enter 6-digit OTP', 'error');
                return;
            }
            setSubmitting(true);
            const msg = await verifyResetPassOtp({ email, otp: code });
            showToast(msg || 'OTP verified successfully!', 'success');
            setStep("reset");

        } catch (err) {
            console.log(err);
            const backendMessage = err.message || 'Invalid OTP';
            showToast(backendMessage, 'error');
            throw err;
        } finally {
            setSubmitting(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            showToast("Fill all fields", "error");
            return;
        }

        if (newPassword !== confirmPassword) {
            showToast("Passwords do not match", "error");
            return;
        }

        setSubmitting(true);
        try {
            await resetPassword({
                email,
                newPassword
            });

            showToast("Password reset successfully", "success");

            setStep("login");
            setOtp(['', '', '', '', '', '']);
            setPassword("");
        } catch (err) {
            showToast(
                err.message || "Failed to reset password",
                "error"
            );
        } finally {
            setSubmitting(false);
        }
    };



    return (

        <div className="signin">
            <div className="signin-section">
                <div className="content">

                    {step === "login" && (
                        <>
                            <div className="heading">Sign In</div>
                            <div className="form-entry">
                                <form className='form' onSubmit={handleSubmit}>
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

                                    <button type="submit" disabled={submitting} className="submit">{submitting ? "Signing In..." : "Sign In"} </button>
                                    <a className='link' onClick={() => setStep("email")}>Forgot Password?</a>
                                </form>
                            </div>
                        </>
                    )}

                    {step === "email" && (
                        <>
                            <div className="heading">Sign In</div>
                            <div className="form-entry">
                                <form className='form' onSubmit={handleSendOtp} >
                                    <div className="input-group">
                                        <input value={email} onChange={e => setEmail(e.target.value)} type="email" id="email" required />
                                        <label htmlFor="email">Email</label>
                                    </div>
                                    <button type="submit" disabled={submitting} className="submit">{submitting ? "Sending Otp..." : "Send Otp"}</button>

                                    <p>Back to <a className='link' onClick={() => setStep("login")}>Sign In</a> </p>
                                </form>
                            </div>
                        </>
                    )}

                    {step === "otp" && (
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
                            </div>
                        </>
                    )}

                    {step === "reset" && (
                        <>
                            <div className="heading">Reset Password</div>

                            <form className="form" style={{width: "45%"}} onSubmit={handleResetPassword}>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        id='newPassword'
                                    />
                                    <label htmlFor='newPassword'>New Password</label>
                                </div>

                                <div className="input-group">
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        id='confirmPassword'
                                    />
                                    <label htmlFor='confirmPassword'>Confirm Password</label>
                                </div>

                                <button className="submit" disabled={submitting}>
                                    {submitting ? "Resetting..." : "Reset Password"}
                                </button>
                            </form>
                        </>
                    )}



                </div>
            </div>
            <div className="welcome-section">
                <span className="welcome">Welcome</span>
                <span className="back">Back!</span>
            </div>
        </div>

    );
}