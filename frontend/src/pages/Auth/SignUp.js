import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignInPage.css';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const appContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Add a small timeout to ensure ref is attached
    const timer = setTimeout(() => {
      if (appContainerRef.current) {
        appContainerRef.current.classList.add('signup-active');
      }
    }, 50);
    
    return () => {
      if (appContainerRef.current) {
        appContainerRef.current.classList.remove('signup-active');
      }
      clearTimeout(timer);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, email, password, confirmPassword });
  };

  const handleSignInClick = () => {
    if (appContainerRef.current) {
      appContainerRef.current.classList.remove('signup-active');
      appContainerRef.current.classList.add('signin-active');
      setTimeout(() => navigate('/signin'), 800);
    }
  };

  return (
    <div className="app-container" ref={appContainerRef}>
      <nav className="nav-menu">
        <div className="nav-logo">YourLogo</div>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>

      <div className="content-wrapper">
        {/* Form Side */}
        <div className="form-side">
          <div className="auth-card">
            <h1>Create Account</h1>
            <p>Fill in your details to get started</p>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

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

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <button type="submit" className="auth-button">SIGN UP</button>
            </form>
            
            <div className="auth-switch">
              Already have an account? <span onClick={handleSignInClick}>Sign In</span>
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

        {/* Background Side - RIGHT for SignUp */}
        <div className={`background-side`}>
          <div className="background-overlay"></div>
          <div className="background-content">
            <h2>Join Us</h2>
            <p>Become part of our community</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SignInSignUp = () => {
  const [isSignIn, setIsSignIn] = useState(true); // Mặc định là SignIn

  const toggleSignInSignUp = () => {
    setIsSignIn(!isSignIn); // Chuyển đổi giữa SignIn và SignUp
  };

  return (
    <div className={`app-container ${isSignIn ? 'signin-active' : 'signup-active'}`}>
      <nav className="nav-menu">
        <div className="nav-logo">YourLogo</div>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>

      <div className="content-wrapper">
        {/* Form Side */}
        <div className="form-side">
          <div className="auth-card">
            <h1>{isSignIn ? 'Sign In' : 'Create Account'}</h1>
            <p>{isSignIn ? 'Sign in to continue' : 'Fill in your details to get started'}</p>
            
            {/* Tùy thuộc vào isSignIn, render SignIn hoặc SignUp Form */}
            {isSignIn ? (
              <div>Sign In Form Goes Here</div> // Placeholder for Sign In form
            ) : (
              <div>Sign Up Form Goes Here</div> // Placeholder for Sign Up form
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
