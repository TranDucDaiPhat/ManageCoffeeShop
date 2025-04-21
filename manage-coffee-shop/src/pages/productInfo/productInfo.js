// Import các hook và module cần thiết
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMonById, updateMonById, deleteMonById } from "../../Api/productApi"; // API sản phẩm
import { getCategories } from "../../Api/categoryApi"; // API thể loại
import noImage from "../productList/no-image.jpg"; // Ảnh mặc định nếu không có ảnh

import axios from "axios";
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
  // state upload hình ảnh
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  // Hàm xử lý upload ảnh lên Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Kiểm tra kích thước và định dạng file
    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert("File ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Chỉ chấp nhận file ảnh (JPEG, PNG, WEBP)");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "coffeeShop"); // Thay bằng upload preset của bạn
    formData.append("cloud_name", "ddfzgrs87"); // Thay bằng cloud name của bạn

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/ddfzgrs8/image/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      // Lấy URL từ response và cập nhật vào formData
      setFormData({
        ...formData,
        productImg: response.data.secure_url,
      });
      alert("Upload ảnh thành công!");
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      alert("Có lỗi xảy ra khi upload ảnh. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
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
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
  {/* Hiển thị tên sản phẩm */}
  <h2 style={{ color: "#2e7d32", textAlign: "center" }}>{product.productName}</h2>

  {/* Hiển thị ảnh sản phẩm */}
  {/* <div style={{ textAlign: "center" }}>
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
  </div> */}
  <div style={{ textAlign: "center" }}>
        <img
          src={formData.productImg || noImage}
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
        
        {/* Nút upload ảnh */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{
            display: "inline-block",
            padding: "8px 16px",
            backgroundColor: "#4CAF50",
            color: "white",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "10px"
          }}>
            Chọn ảnh từ máy tính
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
              disabled={isUploading}
            />
          </label>
          
          {isUploading && (
            <div style={{ marginTop: "10px" }}>
              <progress value={uploadProgress} max="100" style={{ width: "100%" }} />
              <p>Đang upload: {uploadProgress}%</p>
            </div>
          )}
        </div>
      </div>

      {/* Link ảnh sản phẩm (vẫn giữ để có thể chỉnh sửa thủ công) */}
      <label style={{ display: "flex", flexDirection: "column" }}>
        Ảnh sản phẩm (URL):
        <input
          type="text"
          name="productImg"
          value={formData.productImg}
          onChange={handleInputChange}
          style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
      </label>
  

  {/* Thông tin sản phẩm */}
  <div style={{ marginBottom: "30px", lineHeight: "1.6", fontSize: "16px" }}>
    <p><strong>Giá:</strong> <span style={{ color: "#388e3c" }}>{product.productPrice} VND</span></p>
    <p><strong>Số lượng trong kho:</strong> {product.productInventoryQuantity > 0 ? product.productInventoryQuantity : "Hết hàng"}</p>
    <p><strong>Mô tả:</strong> {product.productDescription || "Sản phẩm chưa có mô tả chi tiết."}</p>
  </div>

  {/* Form chỉnh sửa sản phẩm */}
  <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
    {/* Tên sản phẩm */}
    <label style={{ display: "flex", flexDirection: "column" }}>
      Tên sản phẩm:
      <input
        type="text"
        name="productName"
        value={formData.productName}
        onChange={handleInputChange}
        style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
      />
    </label>

    {/* Link ảnh sản phẩm */}
    <label style={{ display: "flex", flexDirection: "column" }}>
      Ảnh sản phẩm:
      <input
        type="text"
        name="productImg"
        value={formData.productImg}
        onChange={handleInputChange}
        style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
      />
    </label>

    {/* Giá */}
    <label style={{ display: "flex", flexDirection: "column" }}>
      Giá:
      <input
        type="number"
        name="productPrice"
        value={formData.productPrice}
        onChange={handleInputChange}
        style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
      />
    </label>

    {/* Số lượng trong kho */}
    <label style={{ display: "flex", flexDirection: "column" }}>
      Số lượng trong kho:
      <input
        type="number"
        name="productInventoryQuantity"
        value={formData.productInventoryQuantity}
        onChange={handleInputChange}
        style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
      />
    </label>

    {/* Mô tả */}
    <label style={{ display: "flex", flexDirection: "column" }}>
      Mô tả:
      <textarea
        name="productDescription"
        value={formData.productDescription}
        onChange={handleInputChange}
        rows={4}
        style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
      />
    </label>

    {/* Dropdown chọn thể loại */}
    <label style={{ display: "flex", flexDirection: "column" }}>
      Thể loại:
      <select
        name="categoryId"
        value={formData.categoryId || ""}
        onChange={handleInputChange}
        style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
      >
        <option value="">Chọn thể loại</option>
        {categories.map((category) => (
          <option key={category.categoryId} value={category.categoryId}>
            {category.categoryName}
          </option>
        ))}
      </select>
    </label>

    {/* Các nút */}
    <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
      <button
        onClick={handleUpdate}
        style={{
          flex: 1,
          backgroundColor: "#388e3c",
          color: "white",
          padding: "10px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px"
        }}
      >
        Cập nhật sản phẩm
      </button>

      <button
        onClick={handleDelete}
        style={{
          flex: 1,
          backgroundColor: "#d32f2f",
          color: "white",
          padding: "10px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px"
        }}
      >
        Xoá sản phẩm
      </button>
    </div>
  </div>
</div>

  );
}
