// Import các hook và module cần thiết
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMonById, updateMonById, deleteMonById } from "../../Api/productApi"; // API sản phẩm
import { getCategories } from "../../Api/categoryApi"; // API thể loại
import noImage from "../productList/no-image.jpg"; // Ảnh mặc định nếu không có ảnh

export default function ProductInfo() {
  // Lấy id từ URL qua useParams
  const { id } = useParams();

  // Khai báo các state chính
  const [product, setProduct] = useState(null); // Dữ liệu sản phẩm gốc
  const [categories, setCategories] = useState([]); // Danh sách thể loại
  const [formData, setFormData] = useState({
    productName: "",
    productPrice: "",
    productInventoryQuantity: "",
    productDescription: "",
    productImg: "",
    categoryId: null, // ID thể loại - bắt đầu là null
  });
  const [error, setError] = useState(""); // Dùng để hiển thị lỗi nếu có
  const navigate = useNavigate(); // Điều hướng trang

  // useEffect dùng để lấy dữ liệu khi component mount
  useEffect(() => {
    async function fetchData() {
      try {
        // Gọi API lấy sản phẩm và thể loại
        const productData = await getMonById(id);
        const categoryData = await getCategories();

        // Debug log
        console.log("Product data:", productData);
        console.log("Category data:", categoryData);

        // Cập nhật state
        setProduct(productData);
        setCategories(categoryData);
        setFormData({
          productName: productData.productName,
          productPrice: productData.productPrice,
          productInventoryQuantity: productData.productInventoryQuantity,
          productDescription: productData.productDescription,
          productImg: productData.productImg,
          categoryId: productData.categoryId, // Gán thẳng ID từ backend
        });
      } catch (err) {
        setError("Không thể tải sản phẩm hoặc thể loại");
        console.error(err);
      }
    }

    fetchData(); // Gọi hàm khi component render lần đầu
  }, [id]);

  // Hàm xử lý khi thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Nếu là categoryId thì ép kiểu về số, ngược lại giữ nguyên
    setFormData({
      ...formData,
      [name]: name === "categoryId" ? (value ? parseInt(value, 10) : null) : value,
    });
  };

  // Hàm xử lý cập nhật sản phẩm
  const handleUpdate = async () => {
    console.log("Form data before submit:", formData);

    // Kiểm tra categoryId hợp lệ
    if (formData.categoryId === null || isNaN(formData.categoryId)) {
      alert("Vui lòng chọn thể loại hợp lệ");
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        categoryId: Number(formData.categoryId), // Đảm bảo categoryId là số
      };

      console.log("Data to be sent:", dataToSend);
      await updateMonById(id, dataToSend); // Gọi API cập nhật
      alert("Cập nhật sản phẩm thành công");
      navigate("/danh-sach-san-pham"); // Chuyển trang
    } catch (err) {
      console.error("Update error:", err);
      alert(`Lỗi khi cập nhật sản phẩm: ${err.message}`);
    }
  };

  // Hàm xử lý xóa sản phẩm
  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này?")) {
      try {
        await deleteMonById(id); // Gọi API xóa
        navigate("/danh-sach-san-pham", { state: { message: "Xoá sản phẩm thành công!" } });
      } catch (err) {
        alert(`Lỗi khi xoá sản phẩm: ${err.message}`);
        console.error("Lỗi xóa sản phẩm:", err);
      }
    }
  };

  // Nếu có lỗi hoặc dữ liệu chưa sẵn sàng
  if (error) return <p>{error}</p>;
  if (!product || categories.length === 0) return <p>Đang tải dữ liệu...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      {/* Hiển thị tên sản phẩm */}
      <h2 style={{ color: "#2e7d32" }}>{product.productName}</h2>

      {/* Hiển thị ảnh sản phẩm */}
      <img
        src={product.productImg || noImage}
        alt={product.productName}
        style={{
          width: "100%",
          maxHeight: "300px",
          objectFit: "cover",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          marginBottom: "20px"
        }}
      />

      {/* Thông tin sản phẩm */}
      <p style={{ fontSize: "18px" }}>
        <strong>Giá:</strong>{" "}
        <span style={{ color: "#388e3c" }}>{product.productPrice} VND</span>
      </p>
      <p style={{ fontSize: "16px" }}>
        <strong>Số lượng trong kho:</strong>{" "}
        {product.productInventoryQuantity > 0
          ? product.productInventoryQuantity
          : "Hết hàng"}
      </p>
      <p style={{ fontSize: "16px" }}>
        <strong>Mô tả:</strong>{" "}
        {product.productDescription || "Sản phẩm chưa có mô tả chi tiết."}
      </p>

      {/* Form chỉnh sửa sản phẩm */}
      <div>
        {/* Tên sản phẩm */}
        <label>
          Tên sản phẩm:
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
          />
        </label>

        {/* Link ảnh sản phẩm */}
        <label>
          Ảnh sản phẩm:
          <input
            type="text"
            name="productImg"
            value={formData.productImg}
            onChange={handleInputChange}
          />
        </label> 
        <br/><br />

        {/* Giá */}
        <label>
          Giá:
          <input
            type="number"
            name="productPrice"
            value={formData.productPrice}
            onChange={handleInputChange}
          />
        </label>
        <br />

        {/* Số lượng trong kho */}
        <label>
          Số lượng trong kho:
          <input
            type="number"
            name="productInventoryQuantity"
            value={formData.productInventoryQuantity}
            onChange={handleInputChange}
          />
        </label>
        <br />

        {/* Mô tả */}
        <label>
          Mô tả:
          <textarea
            name="productDescription"
            value={formData.productDescription}
            onChange={handleInputChange}
          />
        </label>
        <br />

        {/* Dropdown chọn thể loại */}
        <label>
          Thể loại:
          <select
            name="categoryId"
            value={formData.categoryId || ""}
            onChange={handleInputChange}
          >
            <option value="">Chọn thể loại</option>
            {categories.map((category) => (
              <option 
                key={category.categoryId}
                value={category.categoryId}
              >
                {category.categoryName}
              </option>
            ))}
          </select>
        </label>

        {/* Nút cập nhật */}
        <br />
        <button
          onClick={handleUpdate}
          style={{
            backgroundColor: "#388e3c",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            marginTop: "20px"
          }}
        >
          Cập nhật sản phẩm
        </button>
      </div>

      {/* Nút xoá */}
      <button
        onClick={handleDelete}
        style={{
          backgroundColor: "#d32f2f",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
          marginTop: "20px"
        }}
      >
        Xoá sản phẩm
      </button>
    </div>
  );
}
