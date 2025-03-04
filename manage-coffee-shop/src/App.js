// import { Login, Order } from "./pages";
import EmployeeList from "./pages/Employee/EmployeeList";
import "./GlobalStyles.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmployeeForm from "./pages/Employee/EmployeeForm";

// test
// const Home = () => <h1>🏠 Home Page</h1>;
// const TaoHoaDon = () => <h1>tao-hoa-don</h1>;
// const LichSuDonHang = () => <h1>lich-su-don-hang</h1>;
// const DanhSachSanPham = () => <h1>danh-sach-san-pham</h1>;
// const TaiKhoan = () => <h1>tai-khoan</h1>;

function App() {
  return (
    <Router>
      <div style={{ padding: "10px" }}>
        <Routes>
          <Route path="/" element={<EmployeeForm />} />
          {/* <Route path="/" element={<EmployeeList />} /> */}
          {/* <Route path="/" element={<Login />} /> */}
          {/* <Route path="/home" element={<Home />} />
          <Route path="/tao-hoa-don" element={<Order />} />
          <Route path="/lich-su-don-hang" element={<LichSuDonHang />} />
          <Route path="/danh-sach-san-pham" element={<DanhSachSanPham />} />
          <Route path="/tai-khoan" element={<TaiKhoan />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
