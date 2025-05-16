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

import { Login, Order, Customer, OrderHistory, Unauthorized } from "./pages";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";

import EmployeeForm from "./pages/Employee/EmployeeForm";
import EmployeeList from "./pages/Employee/EmployeeList";
import PersonalInfo from "./pages/Personal/PersonalInfo";
import UpdateEmployeeForm from "./pages/Employee/UpdateEmployeeForm";
import ProductStatic from "./pages/productStatic/productStatic";
import UploadImage from "./pages/UploadImage";
import Layout from "./components/Navbar/Layout";
// import  Navbar from "./components/Navbar/Navbar"
import HomePage from "./pages/homePage/HomePage";
import Menu from "./pages/menu/Menu";
import AboutUs from "./pages/About/AboutUs";
import MemberPage from "./pages/Member/MemberPage";

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
          {/* Các route cần Navbar */}
          <Route element={<Layout />}>
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/member" element={<MemberPage />} />
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
          <Route path="/AddProduct" element={<AddProduct />} />
          <Route path="/ProductInfo/:id" element={<ProductInfo />} />
          <Route path="/danh-sach-san-pham" element={<ProductList />} />
          <Route path="/productStatic" element={<ProductStatic />} />
          <Route path="/updateimg" element={<UploadImage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
