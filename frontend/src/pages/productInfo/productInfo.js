// Import các hook và module cần thiết
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMonById, updateMonById, deleteMonById } from "../../API/productAPI";
import { getCategories } from "../../API/categoryAPI";
import noImage from "../productList/no-image.jpg";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa"; 
import styles from "./product.module.css"

export default function ProductInfo() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
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
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Lấy dữ liệu sản phẩm và danh mục
  useEffect(() => {
    async function fetchData() {
      try {
        const productData = await getMonById(id);
        const categoryData = await getCategories();

        setProduct(productData);
        setCategories(categoryData);
        setFormData({
          productName: productData.productName,
          productPrice: productData.productPrice,
          productInventoryQuantity: productData.productInventoryQuantity,
          productDescription: productData.productDescription,
          productImg: productData.productImg,
          categoryId: productData.categoryId,
        });
      } catch (err) {
        setError("Không thể tải sản phẩm hoặc thể loại");
        console.error(err);
      }
    }

    fetchData();
  }, [id]);

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: name === "categoryId" ? (value ? parseInt(value, 10) : null) : value,
  //   });
  // };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "categoryId" ? (value === "" ? null : Number(value)) : value,
    });
  };

  // const handleUpdate = async () => {
  //   if (formData.categoryId === null || isNaN(formData.categoryId)) {
  //     toast.error("Vui lòng chọn thể loại hợp lệ");
  //     return;
  //   }

  //   try {
  //     const dataToSend = {
  //       ...formData,
  //       categoryId: Number(formData.categoryId),
  //     };

  //     await updateMonById(id, dataToSend);
  //     toast.success("Cập nhật sản phẩm thành công");
  //     navigate("/danh-sach-san-pham");
  //   } catch (err) {
  //     console.error("Update error:", err);
  //     toast.error(`Lỗi khi cập nhật sản phẩm: ${err.message}`);
  //   }
  // };
  const handleUpdate = async () => {
    if (!formData.categoryId || isNaN(formData.categoryId)) {
      toast.error("Vui lòng chọn thể loại hợp lệ");
      return;
    }
    console.log('product:', product)
    console.log('product update:', formData)
  
    let newImageUrl = product.productImg; // Dùng biến tạm để tránh lệ thuộc vào setState
    setIsLoading(true);
    // Nếu người dùng đổi ảnh, thì mới upload ảnh mới
    if (product.productImg != formData.productImg) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  
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
    }
  
    // Gửi dữ liệu cập nhật
    try {
      const dataToSend = {
        ...formData,
        productImg: newImageUrl, // Gán ảnh mới (hoặc cũ nếu không thay đổi)
        categoryId: Number(formData.categoryId),
      };
  
      console.log("Dữ liệu gửi lên server:", dataToSend);
      await updateMonById(id, dataToSend);
      toast.success("Cập nhật sản phẩm thành công");
      navigate("/danh-sach-san-pham");
    } catch (err) {
      console.error("Update error:", err);
      toast.error(`Lỗi khi cập nhật sản phẩm: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này?")) {
      try {
        await deleteMonById(id);
        navigate("/danh-sach-san-pham", { state: { message: "Xoá sản phẩm thành công!" } });
      } catch (err) {
        toast.error(`Lỗi khi xoá sản phẩm: ${err.message}`);
        console.error("Lỗi xóa sản phẩm:", err);
      }
    }
  };

  if (error) return <p>{error}</p>;
  if (!product || categories.length === 0) return <p>Đang tải dữ liệu...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#2e7d32", textAlign: "center" }}>{product.productName}</h2>

      <div style={{ textAlign: "center" }}>
        {/* Hiển thị ảnh preview hoặc ảnh hiện tại */}
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

      {/* Form chỉnh sửa sản phẩm */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {/* Các trường input khác giữ nguyên */}
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
            disabled={isLoading}
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
            {isLoading ? (
              <span className={styles.loading}>
                <FaSpinner className={styles.spinner} />
                &nbsp;Đang cập nhật...
              </span>
            ) : (
              "Cập nhật sản phẩm"
            )}
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
