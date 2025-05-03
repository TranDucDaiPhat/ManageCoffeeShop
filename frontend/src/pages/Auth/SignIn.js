import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignInPage.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true); // Mặc định là SignIn
  const appContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Add a small timeout to ensure ref is attached
    const timer = setTimeout(() => {
      if (appContainerRef.current) {
        appContainerRef.current.classList.add('signin-active');
      }
    }, 50);
    
    return () => {
      if (appContainerRef.current) {
        appContainerRef.current.classList.remove('signin-active');
      }
      clearTimeout(timer);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password, rememberMe });
  };

  const handleSignUpClick = () => {
    if (appContainerRef.current) {
      appContainerRef.current.classList.remove('signin-active');
      appContainerRef.current.classList.add('signup-active');
      setTimeout(() => navigate('/signup'), 800);
    }
  };

  const toggleSignInSignUp = () => {
    setIsSignIn(!isSignIn); // Toggle between SignIn and SignUp
  };

  return (
    <div className={`app-container ${isSignIn ? 'signin-active' : 'signup-active'}`} ref={appContainerRef}>
      <nav className="nav-menu">
        <div className="nav-logo">YourLogo</div>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>

      <div className="content-wrapper">
        {/* Background Side - LEFT for SignIn */}
        <div className={`background-side ${isSignIn ? 'left-side' : 'right-side'}`}>
          <div className="background-overlay"></div>
          <div className="background-content">
            <h2>{isSignIn ? 'Welcome Back' : 'Join Us'}</h2>
            <p>{isSignIn ? 'We\'re glad to see you again' : 'Become part of our community'}</p>
          </div>
        </div>

        {/* Form Side */}
        <div className="form-side">
          <div className="auth-card">
            <h1>{isSignIn ? 'Welcome Back' : 'Join Us'}</h1>
            <p>{isSignIn ? 'Enter your email and password to sign in' : 'Enter your details to sign up'}</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="remember-me">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember">Remember me</label>
              </div>

              <button type="submit" className="auth-button">{isSignIn ? 'Sign In' : 'Sign Up'}</button>
            </form>

            <div className="auth-switch">
              {isSignIn ? 'Don\'t have an account? ' : 'Already have an account? '}
              <span onClick={toggleSignInSignUp}>{isSignIn ? 'Sign Up' : 'Sign In'}</span>
            </div>

            <footer className="footer">
              <div className="footer-divider"></div>
              <p>© 2025, Made with 👍 by Creative Tim & Simmpple for a better web</p>
              <div className="footer-links">
                <a href="#">Creative Tim</a>
                <a href="#">Simmpple</a>
                <a href="#">Blog</a>
                <a href="#">License</a>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
