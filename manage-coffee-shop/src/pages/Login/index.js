import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import styles from './Login.module.css'
import { FaSpinner } from "react-icons/fa";

function Login() {
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("admin");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { role, setAccessToken } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
    
        if (username.trim() === '' || password.trim() === '') {
            toast.error("Vui lòng nhập username và password!");
            return;
        }
    
        setIsLoading(true); // Bắt đầu loading
    
        try {
            const res = await fetch("http://localhost:8081/myapp/api/business/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: username.trim(), password: password }),
                credentials: "include",
            });
    
            if (!res.ok) {
                // Nếu response có status mà không phải kết nối lỗi mạng
                if (res.status === 401 || res.status === 403) {
                    toast.error("Đăng nhập thất bại! Kiểm tra tài khoản và mật khẩu.");
                } else {
                    toast.error(`Lỗi từ server: ${res.status}`);
                }
                return;
            }
    
            const data = await res.json();
            sessionStorage.setItem("accessToken", data.token);
            setAccessToken(data.token);
    
            navigate("/tao-hoa-don");
        } catch (error) {
            console.error("Lỗi khi đăng nhập:", error.message);
    
            // Nếu không có phản hồi từ server (ví dụ server tắt)
            toast.error("Không thể kết nối đến server!");
        } finally {
            setIsLoading(false); // Tắt loading
        }
    };
    
    

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>The Study Coffee</h2>
            <div className={styles.content}>
                <div>
                    <img alt='coffee shop' src='/image/coffee-shop.jpg' width={455} />
                </div>
                <div>
                    <form onSubmit={handleLogin} className={styles.login_form}>
                        <h3 style={{ marginBottom: 15 }}>Đăng Nhập</h3>
                        <input
                            type="text"
                            placeholder="Tên tài khoản"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FaSpinner className={styles.spinner} />
                                    Đang đăng nhập...
                                </span>
                            ) : (
                                "Đăng Nhập"
                            )}
                        </button>
                        <a href="#" className={styles.forgot_password}>Quên mật khẩu?</a>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;