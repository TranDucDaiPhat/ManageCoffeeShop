import React, { useState, useEffect } from 'react';

function CustomerInfo() {
  const [userInfo, setUserInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      console.log('get customer...')
      const token = sessionStorage.getItem('accessToken');
      if (!token) {
        setErrorMessage('Token không hợp lệ hoặc chưa đăng nhập.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8081/myapp/api/business/customer/getInfo', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
        } else {
          const errorText = await response.text();
          console.error('Lỗi phản hồi từ server:', errorText);
          setErrorMessage('Không thể lấy thông tin người dùng.');
        }
      } catch (error) {
        console.error('Lỗi kết nối hoặc fetch:', error);
        setErrorMessage('Lỗi kết nối đến máy chủ.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Thông Tin Cá Nhân</h2>
          <div style={styles.divider} />
        </div>

        {errorMessage ? (
          <div style={styles.errorContainer}>
            <span style={styles.errorIcon}>⚠️</span>
            <p style={styles.error}>{errorMessage}</p>
          </div>
        ) : isLoading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner} />
            <p style={styles.loadingText}>Đang tải thông tin...</p>
          </div>
        ) : (
          <div style={styles.content}>
            <div style={styles.avatarContainer}>
              <img
                src="https://i.pravatar.cc/150?img=3"
                alt="Avatar"
                style={styles.avatar}
                onError={(e) => {
                  e.target.src = 'https://i.pravatar.cc/150?img=3';
                }}
              />
              <div style={styles.rankBadge}>{userInfo?.rank || 'Thành viên'}</div>
            </div>
            
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>👤 Họ và Tên</span>
                <span style={styles.infoValue}>{userInfo?.customerName || '--'}</span>
              </div>
              
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>📞 Số điện thoại</span>
                <span style={styles.infoValue}>{userInfo?.customerPhone || '--'}</span>
              </div>
              
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>✉️ Email</span>
                <span style={styles.infoValue}>{userInfo?.email || '--'}</span>
              </div>
              
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>🏠 Địa chỉ</span>
                <span style={styles.infoValue}>{userInfo?.address || '--'}</span>
              </div>
            </div>
            
            <button style={styles.editButton}>
              <span style={styles.editIcon}>✏️</span> Chỉnh sửa thông tin
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5fff7 0%, #e0f7e9 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    padding: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(46, 125, 50, 0.08)',
    width: '100%',
    maxWidth: '500px',
    padding: '40px',
    transition: 'all 0.3s ease',
    border: '1px solid #e8f5e9',
    '&:hover': {
      boxShadow: '0 15px 35px rgba(46, 125, 50, 0.12)',
    }
  },
  header: {
    marginBottom: '30px',
    textAlign: 'center',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#2e7d32',
    margin: '0 0 10px 0',
  },
  divider: {
    height: '3px',
    width: '60px',
    background: 'linear-gradient(to right, #81c784 0%, #66bb6a 100%)',
    margin: '0 auto',
    borderRadius: '3px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: '25px',
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #e8f5e9',
    boxShadow: '0 5px 15px rgba(46, 125, 50, 0.1)',
  },
  rankBadge: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    backgroundColor: '#66bb6a',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    boxShadow: '0 2px 5px rgba(46, 125, 50, 0.1)',
  },
  infoGrid: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '15px',
    marginBottom: '30px',
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px',
    backgroundColor: '#f1f8e9',
    borderRadius: '10px',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#e8f5e9',
      transform: 'translateY(-2px)',
    }
  },
  infoLabel: {
    fontWeight: '500',
    color: '#33691e',
  },
  infoValue: {
    fontWeight: '600',
    color: '#1b5e20',
    textAlign: 'right',
    maxWidth: '60%',
    wordBreak: 'break-word',
  },
  editButton: {
    backgroundColor: 'transparent',
    border: '2px solid #66bb6a',
    color: '#2e7d32',
    padding: '12px 25px',
    borderRadius: '30px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#66bb6a',
      color: 'white',
      boxShadow: '0 5px 15px rgba(102, 187, 106, 0.3)',
    }
  },
  editIcon: {
    fontSize: '16px',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#ffebee',
    borderRadius: '10px',
    marginBottom: '20px',
  },
  errorIcon: {
    fontSize: '40px',
    marginBottom: '10px',
  },
  error: {
    color: '#c62828',
    textAlign: 'center',
    margin: '0',
    fontWeight: '500',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px 0',
  },
  spinner: {
    border: '4px solid rgba(233, 245, 233, 0.8)',
    borderLeftColor: '#66bb6a',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    marginBottom: '15px',
  },
  loadingText: {
    color: '#689f38',
    fontWeight: '500',
    margin: '0',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
};

export default CustomerInfo;