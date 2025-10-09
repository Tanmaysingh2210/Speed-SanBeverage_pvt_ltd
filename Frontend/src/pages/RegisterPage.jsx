import React from 'react';
import { useState } from 'react';
import './RegisterPage.css';

export function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className='register'>
            <div className="left">
                <div className='heading'>WELCOME!</div>
                <div className="empty"></div>
            </div>
            <div className="right">
                <div className="">


                    <div className="head">Register</div>
                    <div className="form-box">
                        <form method='post' className='form'>

                            <div className="input-group">
                                <input type="text" id="name" required />
                                <label htmlFor="name">Name</label>
                            </div>

                            <div className="input-group">
                                <input type="email" id="email" required />
                                <label htmlFor="email">Email</label>
                            </div>

                            {/* <div className="input-group">
                                <input type="password" id="password" required />
                                <label htmlFor="password">Password</label>
                            </div> */}

                            <div className="input-group password-group">
                                <input
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

                            <div className="input-group">
                                <input type="text" id="depo" required />
                                <label htmlFor="depo">Depo. Name</label>
                            </div>

                        </form>
                        <button className='btn'>Register</button>
                    </div>
                    <p>Already User? <a href="#">Sign in</a></p>
                </div>
            </div>
        </div>
    )
}

