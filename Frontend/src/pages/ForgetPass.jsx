import React from 'react';
import { useState } from 'react';
import './ForgetPass.css'

export function ForgetPass() {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className='forgetpass'>
            <div className="left">
                <div className="">
                    <div className="head">Forgot Password</div>
                    <div className="form-box">
                        <form method='post' className='form'>


                            <div className="input-group otp-grp">
                                <input type="email" id="email" required />
                                <label htmlFor="email">Email</label>
                                <button className='sendotp'>Send otp</button>
                            </div>


                            {/* <div className="input-group">
                                <input type="password" id="password" required />
                                <label htmlFor="password">Password</label>
                            </div> */}
                            <div className="input-group otp-grp">
                                <input type="number" id="otp" required />
                                <label htmlFor="number">Otp</label>
                                <button className='sendotp'>Verify otp</button>
                            </div>




                            <div className="input-group password-group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password1"
                                    required
                                />
                                <label htmlFor="password">New Password</label>
                                <span
                                    className="toggle-eye"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </span>
                            </div>
                            <div className="input-group password-group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password2"
                                    required
                                />
                                <label htmlFor="password">Confirm Password</label>
                                <span
                                    className="toggle-eye"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </span>
                            </div>

                        </form>
                        <button className='btn'>Change Password</button>
                    </div>
                    <p>Remembered your password <a href="#">Back to Sign in</a></p>
                </div>
            </div>
            <div className="right">
                <div className='heading'>
                    <div>WELCOME</div>
                    <div >BACK!</div>
                </div>
                <div className="empty"></div>
            </div>
        </div>
    )
}

