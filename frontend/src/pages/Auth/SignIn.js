import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Signin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8081/myapp/api/business/authCustomer/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.authenticated) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('refreshToken', data.refreshToken);
          navigate('/homepage');
        } else {
          setMessage('Đăng nhập thất bại. Vui lòng thử lại.');
        }
      } else {
        const errorText = await response.text();
        setMessage(errorText || 'Đăng nhập thất bại.');
      }
    } catch (error) {
      setMessage('Không thể kết nối tới máy chủ.');
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <h2 style={styles.title}>Đăng nhập</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="text"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Đăng nhập</button>
        </form>
        {message && <p style={styles.error}>{message}</p>}
        <p style={styles.linkText}>
          Chưa có tài khoản? <Link to="/signup" style={styles.link}>Đăng ký</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  background: {
    minHeight: '100vh',
    background: 'linear-gradient(to right, #e0f8e9, #f3fff5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  container: {
    width: '100%',
    maxWidth: '480px', // tăng lên cho rộng hơn
    padding: '40px', // tăng padding
    borderRadius: '16px',
    backgroundColor: '#ffffff',
    boxShadow: '0 8px 20px rgba(0, 128, 0, 0.2)',
    textAlign: 'center',
  },
  title: {
    marginBottom: '25px',
    color: '#2e7d32',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  input: {
    padding: '14px',
    fontSize: '16px',
    borderRadius: '10px',
    border: '1px solid #a5d6a7',
    backgroundColor: '#f1fdf4',
  },
  button: {
    padding: '14px',
    fontSize: '16px',
    backgroundColor: '#66bb6a',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  error: {
    marginTop: '15px',
    color: 'red',
    fontSize: '14px',
  },
  linkText: {
    marginTop: '25px',
    fontSize: '14px',
    color: '#555',
  },
  link: {
    color: '#388e3c',
    textDecoration: 'none',
    fontWeight: 'bold',
  }
};


export default Signin;
