
const express = require("express");
const cors = require("cors");
const app = express();
const items = require("../src/ExampleData/MonAn")
const orders = require("../src/ExampleData/HoaDon")

app.use(cors());
app.use(express.json());

// API lấy danh sách món ăn
app.get("/items", (req, res) => {
  res.json(items);
});

// API lấy danh sách hoá đơn theo ngày
app.get("/orders", (req, res) => {
  const { ngayTao } = req.query;

  // 🛑 Kiểm tra nếu ngày không hợp lệ
  if (!ngayTao || !/^\d{4}-\d{2}-\d{2}$/.test(ngayTao)) {
    return res.status(400).json({ message: "Ngày không hợp lệ! Vui lòng nhập đúng định dạng YYYY-MM-DD" });
  }

  // 🔥 Không cần chuyển đổi, so sánh trực tiếp
  const filteredOrders = orders.filter(order => {
    if (!order.ngayTao || isNaN(Date.parse(order.ngayTao))) {
      return false; // Bỏ qua nếu ngày không hợp lệ
    }
    return order.ngayTao.startsWith(ngayTao); // So sánh trực tiếp chuỗi YYYY-MM-DD
  });

  res.json(filteredOrders);
});

// API nhận hóa đơn mới từ client
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
