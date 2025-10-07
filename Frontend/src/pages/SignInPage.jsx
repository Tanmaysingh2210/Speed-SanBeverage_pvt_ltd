import './SignInPage.css'

export function SignInPage () {
    return(
        
            <div className="signin">
                <div className="signin-section">
                    <div className="heading">Sign In</div>
                    <div className="form-entry">
                        <form method="post" className='form'>
                            <input type="email" placeholder="Email" />
                            <input type="password" placeholder="Password" />
                            <input type="submit" value="Sign In" />
                        </form>
                    </div>
                    <p className="register">Did'nt have account? <button>Register</button></p>
                </div>
                <div className="welcome-section">

                </div>
            </div>
        
    );
}