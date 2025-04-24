import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import styles from "./Login.module.css";

function Login() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const navigate = useNavigate();
  const { role, setAccessToken } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username.trim() == "" || password.trim() == "") {
      toast.error("Vui lòng nhập username và password!");
      return;
    }
    try {
      const res = await fetch(
        "http://localhost:8081/myapp/api/business/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username.trim(),
            password: password,
          }),
          credentials: "include", // Để nhận cookie từ server
        }
      );

      if (!res.ok) {
        throw new Error(`Lỗi đăng nhập: ${res.status}`);
      }

      const data = await res.json(); // Nhận phản hồi từ server
      console.log("token: ", data);
      sessionStorage.setItem("accessToken", data.token);
      setAccessToken(data.token);

      navigate("/tao-hoa-don");
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error.message);
      toast.error("Đăng nhập thất bại! Kiểm tra tài khoản và mật khẩu.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>The Study Coffee</h2>
      <div className={styles.content}>
        <div>
          <img alt="coffee shop" src="/image/coffee-shop.jpg" width={455} />
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
            <button type="submit">Đăng Nhập</button>
            <a href="#" className={styles.forgot_password}>
              Quên mật khẩu?
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
