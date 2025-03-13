const orders = [
    {
        "maHoaDon": "HD001",
        "maKhachHang": "KH001",
        "maNhanVien": "NV001",
        "ngayTao": "2025-03-10T10:30:00",
        "tongTien": 120000,
        "phuongThucThanhToan": "Tiền mặt",
        "chiTietHoaDon": [
            { "maMon": "M001", "tenMon": "Cà Phê Sữa", "soLuong": 2, "donGia": 30000 },
            { "maMon": "M002", "tenMon": "Trà Đào", "soLuong": 1, "donGia": 60000 },
            { "maMon": "M003", "tenMon": "Trà Đào", "soLuong": 1, "donGia": 60000 },
            { "maMon": "M004", "tenMon": "Trà Đào", "soLuong": 1, "donGia": 60000 },
            { "maMon": "M005", "tenMon": "Trà Đào", "soLuong": 1, "donGia": 60000 }
        ]
    },
    {
        "maHoaDon": "HD002",
        "maKhachHang": null,
        "maNhanVien": "NV002",
        "ngayTao": "2025-03-09T15:45:00",
        "tongTien": 85000,
        "phuongThucThanhToan": "Chuyển khoản",
        "chiTietHoaDon": [
            { "maMon": "M003", "tenMon": "Sinh Tố Bơ", "soLuong": 3, "donGia": 20000 },
            { "maMon": "M004", "tenMon": "Nước Cam", "soLuong": 1, "donGia": 25000 }
        ]
    },
    {
        "maHoaDon": "HD003",
        "maKhachHang": "KH002",
        "maNhanVien": "NV003",
        "ngayTao": "2025-03-08T08:20:00",
        "tongTien": 230000,
        "phuongThucThanhToan": "Thẻ tín dụng",
        "chiTietHoaDon": [
            { "maMon": "M005", "tenMon": "Nước Ép Ổi", "soLuong": 1, "donGia": 130000 },
            { "maMon": "M006", "tenMon": "Bia Heineken", "soLuong": 2, "donGia": 50000 }
        ]
    },
    {
        "maHoaDon": "HD004",
        "maKhachHang": "KH003",
        "maNhanVien": "NV001",
        "ngayTao": "2025-03-07T18:00:00",
        "tongTien": 50000,
        "phuongThucThanhToan": "Tiền mặt",
        "chiTietHoaDon": [
            { "maMon": "M007", "tenMon": "Trà Chanh Mật Ong", "soLuong": 1, "donGia": 50000 }
        ]
    },
    {
        "maHoaDon": "HD005",
        "maKhachHang": null,
        "maNhanVien": "NV004",
        "ngayTao": "2025-03-06T13:10:00",
        "tongTien": 78000,
        "phuongThucThanhToan": "Chuyển khoản",
        "chiTietHoaDon": [
            { "maMon": "M008", "tenMon": "Sữa Chua Nếp Cẩm", "soLuong": 3, "donGia": 26000 }
        ]
    },
    {
        "maHoaDon": "HD006",
        "maKhachHang": "KH004",
        "maNhanVien": "NV002",
        "ngayTao": "2025-03-05T09:50:00",
        "tongTien": 150000,
        "phuongThucThanhToan": "Tiền mặt",
        "chiTietHoaDon": [
            { "maMon": "M009", "tenMon": "Trà Sữa Trân Châu", "soLuong": 1, "donGia": 150000 }
        ]
    },
    {
        "maHoaDon": "HD007",
        "maKhachHang": "KH005",
        "maNhanVien": "NV005",
        "ngayTao": "2025-03-04T11:30:00",
        "tongTien": 92000,
        "phuongThucThanhToan": "Thẻ tín dụng",
        "chiTietHoaDon": [
            { "maMon": "M010", "tenMon": "Soda Bạc Hà", "soLuong": 4, "donGia": 23000 }
        ]
    },
    {
        "maHoaDon": "HD008",
        "maKhachHang": null,
        "maNhanVien": "NV003",
        "ngayTao": "2025-03-03T14:40:00",
        "tongTien": 310000,
        "phuongThucThanhToan": "Chuyển khoản",
        "chiTietHoaDon": [
            { "maMon": "M011", "tenMon": "Cacao Nóng", "soLuong": 2, "donGia": 150000 },
            { "maMon": "M012", "tenMon": "Nước Khoáng", "soLuong": 1, "donGia": 10000 }
        ]
    },
    {
        "maHoaDon": "HD009",
        "maKhachHang": "KH006",
        "maNhanVien": "NV001",
        "ngayTao": "2025-03-02T17:15:00",
        "tongTien": 120000,
        "phuongThucThanhToan": "Tiền mặt",
        "chiTietHoaDon": [
            { "maMon": "M013", "tenMon": "Nước Dừa", "soLuong": 2, "donGia": 60000 }
        ]
    },
    {
        "maHoaDon": "HD010",
        "maKhachHang": "KH007",
        "maNhanVien": "NV002",
        "ngayTao": "2025-03-01T12:05:00",
        "tongTien": 210000,
        "phuongThucThanhToan": "Thẻ tín dụng",
        "chiTietHoaDon": [
            { "maMon": "M014", "tenMon": "Chanh Dây Đá Xay", "soLuong": 3, "donGia": 70000 }
        ]
    },
    {
        "maHoaDon": "HD010",
        "maKhachHang": "KH007",
        "maNhanVien": "NV002",
        "ngayTao": "2025-03-12T12:05:00",
        "tongTien": 210000,
        "phuongThucThanhToan": "Thẻ tín dụng",
        "chiTietHoaDon": [
            { "maMon": "M014", "tenMon": "Chanh Dây Đá Xay", "soLuong": 3, "donGia": 70000 }
        ]
    }
]

module.exports = orders;
