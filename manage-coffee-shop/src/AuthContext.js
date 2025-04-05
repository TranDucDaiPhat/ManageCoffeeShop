import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(() => sessionStorage.getItem("role") || null);

  // Hàm lấy role từ backend nếu có token
  const fetchUserRole = async () => {
    try {
      const res = await fetch("http://localhost:5000/user-info", {
        credentials: "include",
      });

      if (res.status === 401) {
        console.warn("Token hết hạn, chuyển hướng về login...");
        logout(); // Xóa role và chuyển hướng login
        return;
      }

      if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status}`);

      const data = await res.json();
      setRole(data.role);
    } catch (error) {
      console.warn("Không thể lấy role, có thể do chưa đăng nhập:", error.message);
      logout();
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    console.log("Gọi logout, chuyển về trang login...");
  
    fetch("http://localhost:5000/logout", { method: "POST", credentials: "include" })
      .then(() => {
        setRole(null);
        sessionStorage.removeItem("role");
  
        // Chỉ chuyển hướng nếu chưa ở trang login
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      })
      .catch(err => console.error("Lỗi khi đăng xuất:", err));
  };

  // Chỉ gọi API nếu đã có session đăng nhập (không tự động gọi nếu không có token)
  useEffect(() => {
    fetchUserRole();
  }, []);

  return <AuthContext.Provider value={{ role, fetchUserRole, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
