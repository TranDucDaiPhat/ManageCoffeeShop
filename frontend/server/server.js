
const express = require("express");
const cors = require("cors");
const app = express();

// Xác thực tài khoản bằng jwt
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const SECRET_KEY = "supersecret"; // Khóa bí mật để tạo token
app.use(cookieParser());
app.use(express.json());

const items = require("../src/ExampleData/MonAn")
const orders = require("../src/ExampleData/HoaDon")
const customers = require("../src/ExampleData/KhachHang")
const employees = require("../src/ExampleData/NhanVien")

app.use(
  cors({
    origin: "http://localhost:3000", // Chỉ cho phép frontend truy cập
    credentials: true, // Cho phép gửi cookie, token
  })
);

// API đăng nhập
app.post("/login", (req, res) => {
  const { tenTaiKhoan } = req.body;
  const user = employees.find(e => e.tenTaiKhoan === tenTaiKhoan);

  if (!user) return res.status(401).json({ message: "Sai tài khoản!" });

  const token = jwt.sign({ id: user.maNhanVien, role: user.quyen }, SECRET_KEY, { expiresIn: "3h" });

  res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Strict" });
  res.json({ message: "Đăng nhập thành công!" });
});

// API lấy thông tin người dùng (Dùng middleware xác thực)
const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Chưa đăng nhập!" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error("Token hết hạn hoặc không hợp lệ:", err.message);
      return res.status(401).json({ message: "Token đã hết hạn, vui lòng đăng nhập lại!" });
    }
    req.user = decoded;
    next();
  });
};

app.get("/user-info", authenticate, (req, res) => {
  res.json({ role: req.user.role });
});

// API đăng xuất
app.post("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: false, sameSite: "Lax" });
  res.json({ message: "Đã đăng xuất!" });
});

// API lấy danh sách món ăn
app.get("/items", (req, res) => {
  res.json(items);
});

// API lấy danh sách nhân viên
app.get("/employees", (req, res) => {
  res.json(employees);
});

// API login bằng tài khoản & mật khẩu -- chưa phân quyền
// app.post("/login", (req, res) => {
//   const { tenTaiKhoan, matKhau } = req.body;

//   // Tìm nhân viên theo tài khoản & mật khẩu
//   const user = employees.find(emp => emp.tenTaiKhoan === tenTaiKhoan && emp.matKhau === matKhau);

//   if (!user) {
//     return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu!" });
//   }

//   // Đăng nhập thành công, trả về thông tin nhân viên (không trả mật khẩu)
//   const { matKhau: _, ...userData } = user;
//   res.json({ message: "Đăng nhập thành công!", user: userData });
// });

// API lấy danh sách khách hàng
app.get("/customers", authenticate, (req, res) => {
  const { phone } = req.query;

  if (phone) {
    const customer = customers.find(c => c.phone === phone);
    if (!customer) {
      return res.status(404).json({ message: "Không tìm thấy khách hàng" });
    }
    return res.json(customer);
  }

  // Chỉ admin mới được truy cập toàn bộ danh sách khách hàng, nếu không là admin -> trả về mảng rỗng
  if (req.user.role !== "Manager") {
    return []
  }

  res.json(customers);
});

// API thêm khách hàng
app.post("/customers", (req, res) => {
  const newCustomer = req.body;

  customers.push(newCustomer); // Lưu khách hàng vào danh sách
  res.status(201).json({ message: "Khách hàng đã được thêm!", data: newCustomer });
});

// API lấy danh sách hoá đơn theo ngày
app.get("/orders", (req, res) => {
  const { ngayTao } = req.query;

  // Kiểm tra nếu ngày không hợp lệ
  if (!ngayTao || !/^\d{4}-\d{2}-\d{2}$/.test(ngayTao)) {
    return res.status(400).json({ message: "Ngày không hợp lệ! Vui lòng nhập đúng định dạng YYYY-MM-DD" });
  }

  // Không cần chuyển đổi, so sánh trực tiếp
  const filteredOrders = orders.filter(order => {
    if (!order.ngayTao || isNaN(Date.parse(order.ngayTao))) {
      return false; // Bỏ qua nếu ngày không hợp lệ
    }
    return order.ngayTao.startsWith(ngayTao); // So sánh trực tiếp chuỗi YYYY-MM-DD
  });

  res.json(filteredOrders);
});

// API thêm hóa đơn mới từ client
app.post("/orders", (req, res) => {
  const newOrder = req.body;

  if (!newOrder.maHoaDon || !newOrder.ngayTao || !newOrder.tongTien) {
    return res.status(400).json({ message: "Thiếu thông tin hóa đơn!" });
  }

  orders.push(newOrder); // Lưu hóa đơn vào danh sách
  res.status(201).json({ message: "Hóa đơn đã được thêm!", data: newOrder });
});


// Chạy server
app.listen(5000, () => console.log("Server chạy tại http://localhost:5000"));
