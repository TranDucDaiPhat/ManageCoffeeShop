import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [gender, setGender] = useState('Nam');
  const [birthDay, setBirthDay] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [accountCus, setAccountCus] = useState('');
  const [passwordCus, setPasswordCus] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOtpPanel, setShowOtpPanel] = useState(false);
  const [otp, setOtp] = useState('');

  const appContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordCus !== confirmPassword) {
      alert('Mật khẩu không khớp');
      return;
    }

    const requestData = {
      customerName,
      customerPhone,
      gender,
      birthDay,
      email,
      address,
      accountCus,
      passwordCus,
    };

    try {
      const response = await fetch('http://localhost:8081/myapp/api/business/authCustomer/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        let data;

        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }

        alert('Đã gửi OTP thành công!');
        console.log('Response:', data);
        setShowOtpPanel(true);
      } else {
        const errorText = await response.text();
        console.error('Gửi OTP thất bại:', errorText);
        alert('Gửi OTP thất bại');
      }
    } catch (error) {
      console.error('Lỗi:', error);
      alert('Lỗi khi gửi OTP');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const verifyData = {
      email,
      otp,
    };

    try {
      const response = await fetch('http://localhost:8081/myapp/api/business/authCustomer/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verifyData),
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        let data;

        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }

        alert('Xác minh OTP thành công!');
        console.log('Verify Response:', data);
        navigate('/signin');
      } else {
        const errorText = await response.text();
        console.error('Xác minh OTP thất bại:', errorText);
        alert('Xác minh OTP thất bại');
      }
    } catch (error) {
      console.error('Lỗi:', error);
      alert('Lỗi khi xác minh OTP');
    }
  };

  const handleSignInClick = () => {
    navigate('/signin');
  };

  const handleCancelOtp = () => {
    setShowOtpPanel(false);
    setOtp('');
  };

  return (
    <div className="app-container" ref={appContainerRef} style={styles.appContainer}>
      <div className="content-wrapper" style={styles.contentWrapper}>
        <div className="form-container" style={styles.formContainer}>
          <div className="auth-header" style={styles.authHeader}>
            <h2 style={styles.authTitle}>{showOtpPanel ? 'Xác minh OTP' : 'Tạo tài khoản'}</h2>
            <p style={styles.authSubtitle}>
              {showOtpPanel ? 'Nhập mã OTP đã gửi đến email của bạn' : 'Tham gia cùng chúng tôi'}
            </p>
          </div>

          {showOtpPanel ? (
            <form onSubmit={handleVerifyOtp} style={{ ...styles.form, opacity: showOtpPanel ? 1 : 0, transition: 'opacity 0.3s ease' }}>
              <div className="form-group" style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  style={{ ...styles.input, backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
                />
              </div>

              <div className="form-group" style={styles.formGroup}>
                <label style={styles.label}>Mã OTP</label>
                <input
                  type="text"
                  placeholder="Nhập mã OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div style={{ ...styles.formRow, justifyContent: 'center', gap: '1.5rem' }}>
                <button
                  type="button"
                  onClick={handleCancelOtp}
                  style={{
                    ...styles.authButton,
                    backgroundColor: '#6c757d',
                    ':hover': { backgroundColor: '#5a6268', transform: 'translateY(-2px)' },
                    flex: 1,
                    maxWidth: '200px',
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="auth-button"
                  style={{
                    ...styles.authButton,
                    flex: 1,
                    maxWidth: '200px',
                  }}
                >
                  Xác minh
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} style={{ ...styles.form, opacity: showOtpPanel ? 0 : 1, transition: 'opacity 0.3s ease' }}>
              <div className="form-row" style={styles.formRow}>
                <div className="form-group" style={styles.formGroup}>
                  <label style={styles.label}>Họ và tên</label>
                  <input
                    type="text"
                    placeholder="Nhập họ và tên"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    style={styles.input}
                  />
                </div>

                <div className="form-group" style={styles.formGroup}>
                  <label style={styles.label}>Số điện thoại</label>
                  <input
                    type="text"
                    placeholder="Nhập số điện thoại"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <div className="form-row" style={styles.formRow}>
                <div className="form-group" style={styles.formGroup}>
                  <label style={styles.label}>Giới tính</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    style={styles.select}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div className="form-group" style={styles.formGroup}>
                  <label style={styles.label}>Ngày sinh</label>
                  <input
                    type="date"
                    value={birthDay}
                    onChange={(e) => setBirthDay(e.target.value)}
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <div className="form-group" style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  placeholder="Nhập địa chỉ email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div className="form-group" style={styles.formGroup}>
                <label style={styles.label}>Địa chỉ</label>
                <input
                  type="text"
                  placeholder="Nhập địa chỉ"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div className="form-group" style={styles.formGroup}>
                <label style={styles.label}>Tên đăng nhập</label>
                <input
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  value={accountCus}
                  onChange={(e) => setAccountCus(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div className="form-row" style={styles.formRow}>
                <div className="form-group" style={styles.formGroup}>
                  <label style={styles.label}>Mật khẩu</label>
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={passwordCus}
                    onChange={(e) => setPasswordCus(e.target.value)}
                    required
                    style={styles.input}
                  />
                </div>

                <div className="form-group" style={styles.formGroup}>
                  <label style={styles.label}>Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} // Sửa lỗi từ setCustomerName
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <button type="submit" className="auth-button" style={styles.authButton}>
                Đăng ký
              </button>
            </form>
          )}

          {!showOtpPanel && (
            <div className="auth-footer" style={styles.authFooter}>
              <p style={styles.footerText}>
                Đã có tài khoản?{' '}
                <span onClick={handleSignInClick} style={styles.footerLink}>
                  Đăng nhập
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// CSS-in-JS styles
const styles = {
  appContainer: {
    minHeight: '100vh',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    backgroundImage: 'url(https://img6.thuthuatphanmem.vn/uploads/2022/02/25/background-cafe-3d_090020083.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
    boxSizing: 'border-box',
    position: 'relative',
    ':before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      zIndex: 1,
    },
  },
  contentWrapper: {
    width: '100%',
    maxWidth: '1080px', // Tăng để chứa form rộng hơn
    padding: '1.5rem',
    boxSizing: 'border-box',
    zIndex: 2,
  },
  formContainer: {
    maxWidth: '720px', // Tăng chiều rộng form
    margin: '0 auto',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
    padding: '2.5rem', // Tăng padding cho form rộng
    transition: 'transform 0.3s ease, opacity 0.3s ease',
    boxSizing: 'border-box',
  },
  authHeader: {
    textAlign: 'center',
    marginBottom: '2.5rem',
  },
  authTitle: {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#4a2c2a',
    marginBottom: '0.75rem',
  },
  authSubtitle: {
    fontSize: '1.1rem',
    color: '#4a2c2a',
    fontWeight: '400',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem', // Tăng gap cho form rộng
  },
  formRow: {
    display: 'flex',
    gap: '2rem',
    width: '100%',
    flexDirection: 'row',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: '1.5rem',
    },
  },
  formGroup: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#4a2c2a',
  },
  input: {
    padding: '1rem 1.25rem', // Tăng padding cho input rộng hơn
    borderRadius: '10px',
    border: '1px solid #ced4da',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    backgroundColor: '#f8f9fa',
    boxSizing: 'border-box',
    ':focus': {
      outline: 'none',
      borderColor: '#28a745',
      boxShadow: '0 0 0 4px rgba(40, 167, 69, 0.15)',
      backgroundColor: '#ffffff',
    },
  },
  select: {
    padding: '1rem 1.25rem',
    borderRadius: '10px',
    border: '1px solid #ced4da',
    fontSize: '1rem',
    backgroundColor: '#f8f9fa',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
    ':focus': {
      outline: 'none',
      borderColor: '#28a745',
      boxShadow: '0 0 0 4px rgba(40, 167, 69, 0.15)',
      backgroundColor: '#ffffff',
    },
  },
  authButton: {
    padding: '1rem 1.5rem', // Tăng padding cho nút
    borderRadius: '12px', // Bo góc lớn hơn
    border: 'none',
    backgroundColor: '#28a745',
    color: 'white',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '0.75rem',
    width: '100%',
    boxSizing: 'border-box',
    ':hover': {
      backgroundColor: '#218838',
      transform: 'translateY(-2px)',
    },
    ':active': {
      transform: 'scale(0.98)',
    },
  },
  authFooter: {
    marginTop: '2.5rem',
    textAlign: 'center',
  },
  footerText: {
    color: '#4a2c2a',
    fontSize: '1rem',
  },
  footerLink: {
    color: '#28a745',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    ':hover': {
      color: '#218838',
      textDecoration: 'underline',
    },
  },
};

export default SignUp;