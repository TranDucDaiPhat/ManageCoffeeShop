import "./GlobalStyles.css";
import {
  BrowserRouter as Router,
  Routes,
  Navigate,
  Route,
} from "react-router-dom";
import ProductList from "./pages/productList";
import AddProduct from "./pages/addProduct";
import ProductInfo from "./pages/productInfo/productInfo";

import ProductStatic from "./pages/productStatic/productStatic";

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
          <Route element={<ProtectedRoute allowedRoles={["USER"]} />}></Route>

          {/* route cho ADMIN */}
          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/danh-sach-nhan-vien" element={<EmployeeList />} />
            <Route
              path="/cap-nhat-thong-tin/:id"
              element={<UpdateEmployeeForm />}
            />
          </Route>

          {/* route chung cho Employee và Manager*/}
          <Route element={<ProtectedRoute allowedRoles={["USER", "ADMIN"]} />}>
            <Route path="/tao-hoa-don" element={<Order />} />
          </Route>

          {/* Nếu không có quyền, chuyển hướng về login */}
          <Route path="*" element={<Navigate to="/" />} />

          <Route path="/khach-hang" element={<Customer />} />
          <Route path="/lich-su-don-hang" element={<OrderHistory />} />
          {/* <Route path="/danh-sach-san-pham" element={<DanhSachSanPham />} /> */}
          <Route path="/them-nhan-vien" element={<EmployeeForm />} />
          <Route path="/tai-khoan" element={<PersonalInfo />} />
          <Route path="/thong-ke-doanh-thu" element={<SalesStatistics />} />
          <Route path="/AddProduct" element={<AddProduct />} />
          <Route path="/ProductInfo/:id" element={<ProductInfo />} />
          <Route path="/productStatic" element={<ProductStatic />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
