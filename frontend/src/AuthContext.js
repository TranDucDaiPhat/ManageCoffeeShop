import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // console.log(decoded)
        return decoded.scope || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [accessToken, setAccessToken] = useState(
    () => sessionStorage.getItem("accessToken") || null
  );
  const [employeeId, setEmployeeId] = useState(null);

  // Hàm đăng xuất
  const logout = () => {
    console.log("Gọi logout, chuyển về trang login...");
    setRole(null);
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("role");
    window.location.href = "/";
  };

  const setUserInfo = async () => {
    if (!accessToken) return;

    try {
      const decoded = jwtDecode(accessToken);
      console.log(decoded);
      setRole(decoded.scope || null);
      setEmployeeId(decoded.employeeId);
    } catch (error) {
      console.warn("Không thể giải mã token:", error);
      logout();
    }
  };

  useEffect(() => {
    if (accessToken) {
      setUserInfo();
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{ role, accessToken, setAccessToken, logout, employeeId }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
