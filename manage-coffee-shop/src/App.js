import "./GlobalStyles.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmployeeForm from "./pages/Employee/EmployeeForm";
import EmployeeList from "./pages/Employee/EmployeeList";
import PersonalInfo from "./pages/Personal/PersonalInfo";
function App() {
  return (
    <Router>
      <div style={{ padding: "10px" }}>
        <Routes>
          {/* <Route path="/" element={<Login />} /> */}
          {/* <Route path="/home" element={<Home />} /> */}
          {/* <Route path="/tao-hoa-don" element={<Order />} /> */}
          {/* <Route path="/lich-su-don-hang" element={<LichSuDonHang />} /> */}
          {/* <Route path="/danh-sach-san-pham" element={<DanhSachSanPham />} /> */}
          <Route path="/them-nhan-vien" element={<EmployeeForm />} />
          <Route path="/danh-sach-nhan-vien" element={<EmployeeList />} />
          <Route path="/tai-khoan" element={<PersonalInfo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
