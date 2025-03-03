import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './Login.module.css'

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Tên tài khoản:", username);
        console.log("Mật khẩu:", password);
        navigate('/tao-hoa-don')
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>The Study Coffee</h2>
            <div className={styles.content}>
                <div>
                    <img alt='coffee shop' src='/image/coffee-shop.jpg' width={455} />
                </div>
                <div>
                    <form onSubmit={handleSubmit} className={styles.login_form}>
                        <h3 style={{marginBottom:15}}>Đăng Nhập</h3>
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
                        <a href="#" className={styles.forgot_password}>Quên mật khẩu?</a>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;