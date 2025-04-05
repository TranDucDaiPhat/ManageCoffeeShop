

import './GlobalStyles.css'
import { BrowserRouter as Router, Routes,Navigate, Route } from "react-router-dom";
import ProductList from "./pages/productList";
import AddProduct from "./pages/addProduct";
import ProductInfo from "./pages/productInfo/productInfo";


import { Login, Order, Customer, OrderHistory, Unauthorized } from "./pages";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";

import EmployeeForm from "./pages/Employee/EmployeeForm";
import EmployeeList from "./pages/Employee/EmployeeList";
import PersonalInfo from "./pages/Personal/PersonalInfo";
import UpdateEmployeeForm from "./pages/Employee/UpdateEmployeeForm";
import SalesStatistics from "./pages/Statistics/SalesStatistics";

import UploadImage from "./pages/UploadImage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* route cho Employee */}
          <Route element={<ProtectedRoute allowedRoles={["Employee"]} />}>

          </Route>

          {/* route cho Manager */}
          <Route element={<ProtectedRoute allowedRoles={["Manager"]} />}>
            <Route path="/danh-sach-nhan-vien" element={<EmployeeList />} />
            <Route path="/upload-image" element={<UploadImage />} />
          </Route>

          {/* route chung cho Employee và Managet*/}
          <Route element={<ProtectedRoute allowedRoles={["Employee","Manager"]} />}>
            <Route path="/tao-hoa-don" element={<Order />} />
          </Route>

          {/* Nếu không có quyền, chuyển hướng về login */}
          <Route path="*" element={<Navigate to="/login" />} />

          <Route path="/khach-hang" element={<Customer />} />
          <Route path="/lich-su-don-hang" element={<OrderHistory />} />
          {/* <Route path="/danh-sach-san-pham" element={<DanhSachSanPham />} /> */}
          <Route path="/them-nhan-vien" element={<EmployeeForm />} />
          <Route path="/tai-khoan" element={<PersonalInfo />} />
          <Route path="/cap-nhat-thong-tin" element={<UpdateEmployeeForm />} />
          <Route path="/thong-ke-doanh-thu" element={<SalesStatistics />} />
          <Route path="/AddProduct" element={<AddProduct />} />
          <Route path="/ProductInfo/:id" element={<ProductInfo />} />
          <Route path="/danh-sach-san-pham" element={<ProductList />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
