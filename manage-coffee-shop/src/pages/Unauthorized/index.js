import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🚫 Truy cập bị từ chối</h1>
      <p>Bạn không có quyền truy cập vào trang này.</p>
      <Link to="/">Quay lại trang chủ</Link>
    </div>
  );
};

export default Unauthorized;
