import './SignInPage.css';
import { useState } from 'react';

export function SignInPage() {
const [showPassword, setShowPassword] = useState(false);

    return (

        <div className="signin">
            <div className="signin-section">
                <div className="content">
                    <div className="heading">Sign In</div>
                    <div className="form-entry">
                        <form method="post" className='form'>
                            {/* <label>Email</label>
                            <input type="email" name="email" required />
                            <label>Password</label>
                            <input type="password" name="Password" required /> */
                            }
                            <div className="input-group">
                                <input type="email" id="email" required />
                                <label htmlFor="email">Email</label>
                            </div>

                            
                            <div className="input-group password-group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    required
                                />
                                <label htmlFor="password">Password</label>
                                
                            </div>

                        </form>
                    </div>
                    <button className="submit">Sign In</button>
                    <p className="register">Did'nt have account? <a>Register</a></p>
                </div>
            </div>
            <div className="welcome-section">
                <span className="welcome">Welcome</span>
                <span className="back">Back!</span>
            </div>
        </div>

    );
}