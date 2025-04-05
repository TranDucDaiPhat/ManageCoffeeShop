import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { role } = useAuth();

  if (!role) return <h2>Loading...</h2>; // Hiển thị loading khi chưa có dữ liệu

  if (!allowedRoles.includes(role)) return <Navigate to="/unauthorized" />;

  return <Outlet />;
};

export default ProtectedRoute;
