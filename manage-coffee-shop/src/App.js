import { Login, Order } from "./pages";
import './GlobalStyles.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./pages/productList";
import AddProduct from "./pages/addProduct";
import ProductInfo from "./pages/productInfo/productInfo";

// test
const Home = () => <h1>🏠 Home Page</h1>;
const TaoHoaDon = () => <h1>tao-hoa-don</h1>;
const LichSuDonHang = () => <h1>lich-su-don-hang</h1>;
const DanhSachSanPham = () => <h1>danh-sach-san-pham</h1>;
const TaiKhoan = () => <h1>tai-khoan</h1>;

function App() {
  
  return (
    <Router>
      <div style={{ padding: "10px" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/tao-hoa-don" element={<Order />} />
          <Route path="/lich-su-don-hang" element={<LichSuDonHang />} />
          <Route path="/danh-sach-san-pham" element={<ProductList />} />
          <Route path="/tai-khoan" element={<TaiKhoan />} />
          <Route path="/AddProduct" element={<AddProduct />} />
          <Route path="/ProductInfo/:id" element={<ProductInfo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
