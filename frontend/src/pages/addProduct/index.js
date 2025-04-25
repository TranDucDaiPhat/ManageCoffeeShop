// Import các hook và module cần thiết
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../../API/productAPI";
import { getCategories } from "../../API/categoryAPI";
import noImage from "../productList/no-image.jpg";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa"; 
import styles from "./product.module.css"

export default function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    productName: "",
    productPrice: "",
    productInventoryQuantity: "",
    productDescription: "",
    productImg: "",
    categoryId: null,
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // Cloudinary config
  const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dvpbtas1x/image/upload';
  const CLOUDINARY_UPLOAD_PRESET = 'coffeeShop';

  // Lấy danh sách danh mục khi component mount
  React.useEffect(() => {
    async function fetchCategories() {
      try {
        const categoryData = await getCategories();
        setCategories(categoryData);
      } catch (err) {
        setError("Không thể tải danh sách thể loại");
        console.error(err);
      }
    }
    fetchCategories();
  }, []);

  // Hàm xử lý upload ảnh lên Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Tạo preview ảnh
    setPreviewUrl(URL.createObjectURL(file));

    // Kiểm tra kích thước và định dạng file
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Chỉ chấp nhận file ảnh (JPEG, PNG, WEBP)");
      return;
    }
    setImage(file);
    setFormData({ ...formData, productImg: file.name })
  };

  // Clean up preview URL khi component unmount
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "categoryId" ? (value === "" ? null : Number(value)) : value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate dữ liệu
    if (!formData.categoryId || isNaN(formData.categoryId)) {
      toast.error("Vui lòng chọn thể loại hợp lệ");
      return;
    }
    if (!formData.productName?.trim()) {
      toast.error("Vui lòng nhập tên sản phẩm");
      return;
    }

    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    let newImageUrl = ''; // Dùng biến tạm để tránh lệ thuộc vào setState
    setIsLoading(true);
    try {
      const response = await axios.post(CLOUDINARY_URL, data);
      if (response.status === 200) {
        newImageUrl = response.data.secure_url;
        console.log(newImageUrl)
      }
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      toast.error("Có lỗi xảy ra khi upload ảnh. Vui lòng thử lại.");
      setIsLoading(false);
      return;
    }

    // Gửi dữ liệu cập nhật
    try {
      const dataToSend = {
        ...formData,
        productImg: newImageUrl, // Gán ảnh mới (hoặc cũ nếu không thay đổi)
        categoryId: Number(formData.categoryId),
      };

      console.log("Dữ liệu gửi lên server:", dataToSend);
      await addProduct(dataToSend);
      toast.success("Thêm sản phẩm thành công");
      navigate("/danh-sach-san-pham");
    } catch (err) {
      console.error("Add product error:", err);
      toast.error(`Lỗi khi thêm sản phẩm: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#2e7d32", textAlign: "center" }}>Thêm sản phẩm mới</h2>

      <div style={{ textAlign: "center" }}>
        {/* Hiển thị ảnh preview hoặc ảnh mặc định */}
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              width: "100%",
              maxHeight: "300px",
              objectFit: "cover",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              marginBottom: "20px"
            }}
          />
        ) : (
          <img
            src={formData.productImg || noImage}
            alt="Ảnh sản phẩm"
            style={{
              width: "100%",
              maxHeight: "300px",
              objectFit: "cover",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              marginBottom: "20px"
            }}
          />
        )}

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
            />
          </label>
        </div>
      </div>

      {/* Form thêm sản phẩm */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
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

        {/* <label style={{ display: "flex", flexDirection: "column" }}>
          Ảnh sản phẩm (URL):
          <input
            type="text"
            name="productImg"
            value={formData.productImg}
            onChange={handleInputChange}
            style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </label> */}

        <label style={{ display: "flex", flexDirection: "column" }}>
          Giá:
          <input
            type="number"
            name="productPrice"
            value={formData.productPrice}
            onChange={handleInputChange}
            required
            min="0"
            style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column" }}>
          Số lượng trong kho:
          <input
            type="number"
            name="productInventoryQuantity"
            value={formData.productInventoryQuantity}
            onChange={handleInputChange}
            required
            min="0"
            style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </label>

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

        <label style={{ display: "flex", flexDirection: "column" }}>
          Thể loại:
          <select
            name="categoryId"
            value={formData.categoryId ?? ""}
            onChange={handleInputChange}
            required
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
            type="submit"
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
            {isLoading ? (
              <span className={styles.loading}>
                <FaSpinner className={styles.spinner} />
                &nbsp;Đang Thêm SP...
              </span>
            ) : (
              "Thêm sản phẩm"
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate("/danh-sach-san-pham")}
            style={{
              flex: 1,
              backgroundColor: "#757575",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Hủy bỏ
          </button>
        </div>
      </form>
    </div>
  );
}
