import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from "../../AuthContext";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import { findCustomerById, addProductToCart } from '../../API';
import { Checkbox } from 'antd';

function Signin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { role, setAccessToken, setUser } = useAuth();
  const location = useLocation();
  const product = location?.state?.product || null;
  const [isEmployee, setIsEmployee] = useState(false)


  const handleLogin = async (e) => {
    e.preventDefault();
    if (username.trim() === '' || password.trim() === '') {
      toast.error("Vui lòng nhập username và password!");
      return;
    }
    setIsLoading(true); // Bắt đầu loading
    try {
      const API = isEmployee ? "http://localhost:8081/myapp/api/business/auth/login" : 'http://localhost:8081/myapp/api/business/authCustomer/login'
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password: password }),
        credentials: "include",
      });

      if (res.status === 429) {
        const errorData = await res.json();
        toast.error(errorData.token || "Bạn đã vượt quá số lần đăng nhập. Vui lòng thử lại sau.");
        return;
      }

      if (!res.ok) {
        throw new Error(`Lỗi đăng nhập: ${res.status}`);
      }

      const data = await res.json();
      console.log("token: ", data);
      sessionStorage.setItem("accessToken", data.token);
      setAccessToken(data.token);

      const decoded = jwtDecode(data.token);

      if (decoded.scope == 'ADMIN' || decoded.scope == 'USER') {
        navigate("/tao-hoa-don");
      } else {
        // lấy thông tin customer sau khi đăng nhập
        const cus = await handleFindCustomer(decoded.customerId)
        if (product) {
          const items = {
            "items": [
              {
                "productId": product.productId,
                "size": "M",
                "quantity": product.quantity,
                "sweet": "0%",
                "ice": "0%",
                "toppings": null
              }
            ],
            "discountCode": null,
            "paymentMethod": null
          };

          try {
            await addProductToCart(decoded.customerId, items);
            toast.success("Thêm vào giỏ hàng thành công!");
            navigate('/gio-hang');
          } catch (err) {
            toast.error("Thêm vào giỏ hàng thất bại!");
          }
        } else {
          navigate("/");
        }
      }

    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error.message);
      toast.error("Đăng nhập thất bại! Kiểm tra tài khoản và mật khẩu.");
    } finally {
      setIsLoading(false); // Tắt loading
    }
  };

  const handleFindCustomer = async (id) => {
    const data = await findCustomerById(id)
    console.log(data)
    if (data) {
      setUser(data)
    } else {
      console.log("lỗi, không tìm thấy khách hàng");
    }
  }

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
          <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
            <input
              type="checkbox"
              onChange={() => setIsEmployee(!isEmployee)}
              style={{width:15,height:15,margin:5}}
            />
            <span style={{fontSize:'95%', color:'gray'}}>Đăng nhập dành cho nhân viên</span>
          </div>
          <button type="submit" disabled={isLoading} style={styles.button}>
            {isLoading ? (
              <span className={styles.loading}>
                <FaSpinner className={styles.spinner} />
                &nbsp;Đang đăng nhập...
              </span>
            ) : (
              "Đăng Nhập"
            )}
          </button>
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
