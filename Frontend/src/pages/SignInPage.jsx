import './SignInPage.css'

export function SignInPage () {
    return(
        
            <div className="signin">
                <div className="signin-section">
                    <div className="heading">Sign In</div>
                    <div className="form-entry">
                        <form method="post" className='form'>
                            <label>Email</label>
                            <input type="email" name="email" required />
                            <label>Password</label>
                            <input type="password" name="Password" required />
                            
                        </form>
                    </div>
                    <button className="submit">Sign In</button>
                    <p className="register">Did'nt have account? <a>Register</a></p>
                </div>
                <div className="welcome-section">

                </div>
            </div>
        
    );
}