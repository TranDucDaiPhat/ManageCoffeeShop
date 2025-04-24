import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import styles from './Login.module.css'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Login() {
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("admin");
    const [showPassword, setShowPassword] = useState(false); // ✅ Thêm state để hiển thị mật khẩu

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { role, setAccessToken } = useAuth();

    // const handleLogin = async (e) => {
    //     e.preventDefault();

    
    //     if (username.trim() === '' || password.trim() === '') {
    //         toast.error("Vui lòng nhập username và password!");
    //         return;
    //     }
    
    //     setIsLoading(true); // Bắt đầu loading
    
    //     try {
    //         const res = await fetch("http://localhost:8081/myapp/api/business/auth/login", {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ username: username.trim(), password: password }),
    //             credentials: "include",
    //         });
    
    //         if (!res.ok) {
    //             // Nếu response có status mà không phải kết nối lỗi mạng
    //             if (res.status === 401 || res.status === 403) {
    //                 toast.error("Đăng nhập thất bại! Kiểm tra tài khoản và mật khẩu.");
    //             } else {
    //                 toast.error(`Lỗi từ server: ${res.status}`);
    //             }
    //             return;
    //         }
    
    //         const data = await res.json();
    //         sessionStorage.setItem("accessToken", data.token);
    //         setAccessToken(data.token);
    
    //         navigate("/tao-hoa-don");
    //     } catch (error) {
    //         console.error("Lỗi khi đăng nhập:", error.message);
    
    //         // Nếu không có phản hồi từ server (ví dụ server tắt)
    //         toast.error("Không thể kết nối đến server!");
    //     } finally {
    //         setIsLoading(false); // Tắt loading

    //     }
    // };
    
    const handleLogin = async (e) => {
        e.preventDefault();
        if (username.trim() === '' || password.trim() === '') {
            toast.error("Vui lòng nhập username và password!");
            return;
        }
    
        try {
            const res = await fetch("http://localhost:8081/myapp/api/business/auth/login", {
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
    
            navigate("/tao-hoa-don");
        } catch (error) {
            console.error("Lỗi khi đăng nhập:", error.message);
            toast.error("Đăng nhập thất bại! Kiểm tra tài khoản và mật khẩu.");
        }
    };
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                        
                       <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nhập mật khẩu"
                                style={{ paddingRight: '30px' }} // Đảm bảo có khoảng trống cho icon
                            />
                            <div
                                style={{
                                position: 'absolute',
                                right: '8px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer',
                                }}
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </div>
                        </div>
                        <button type="submit">Đăng Nhập</button>
                        <a href="#" className={styles.forgot_password}>Quên mật khẩu?</a>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
