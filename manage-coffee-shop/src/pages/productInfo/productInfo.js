import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMon,updateMon } from "../servise/api"; // Import API mới
import { Sidebar } from "../../components";

const ProductInfo = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const data = await getMon(id.toString());
        setProduct(data);
        setEditedProduct(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) return <h2>Đang tải sản phẩm...</h2>;
  if (!product || Object.keys(product).length === 0) return <h2>Không tìm thấy sản phẩm</h2>;

    // Xử lý đường dẫn hình ảnh
    const imageUrl = product.hinhAnh.startsWith("http")
        ? product.hinhAnh // Nếu đã là URL đầy đủ thì giữ nguyên
        : `http://localhost:3001${product.hinhAnh.replace("/public", "")} `; // Nếu lưu local thì sửa lại đường dẫn
    // const imageUrl = product.hinhAnh.startsWith("http")
    //     ? product.hinhAnh
    //     : `http://localhost:3001/${product.hinhAnh}`; // Bỏ "/public", chỉ cần thêm domain

    const toggleEdit = () => {
        if (isEditing) {
          setEditedProduct(product);
        }
        setIsEditing(!isEditing);
      };
      const handleSave = async () => {
        try {
          await updateMon(id, editedProduct);
          setProduct(editedProduct);
          setIsEditing(false);
          alert("Cập nhật sản phẩm thành công!");
        } catch (error) {
          console.error("Lỗi khi cập nhật sản phẩm:", error);
          alert("Cập nhật thất bại!");
        }
      };
      const handleChange = (e, field) => {
        setEditedProduct({ ...editedProduct, [field]: e.target.value });
      };

  return (
    <div style={{display: "flex",
           height: "100vh",
           position: "relative",
           background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.9))", // Hiệu ứng mờ dần
           backdropFilter: "blur(10px)", // L
           boxShadow: "inset 0 0 50px rgba(0, 0, 0, 0.1)", }}>
         {openSidebar && (
           <div style={{ width: "250px", transition: "width 0.5s ease", overflow: "hidden" }}>
             <Sidebar openSidebar={openSidebar} onOpenSidebar={setOpenSidebar} />
           </div>
         )}
   
         <div style={{ width: openSidebar ? `calc(100% - 250px)` : "100%", transition: "width 0.5s ease", padding: "20px", backgroundColor: "#D9D9D9", margin: "0 auto", borderRadius: "15px", // Bo góc
               boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", }}>
           {!openSidebar && <button onClick={() => setOpenSidebar(true)}>☰</button>}
           <h1 style={{ textAlign: "center",
            marginBottom: "20px",
            fontSize: "28px", // Tăng kích thước chữ
            fontWeight: "bold", // Đậm hơn
            color: "#8BC34A", // Màu chữ tối hơn để dễ đọc
            textTransform: "uppercase", // Chữ in hoa toàn bộ
            letterSpacing: "2px", // Giãn chữ cho đẹp hơn
            transition: "color 0.3s ease, transform 0.3s ease", }}
            onMouseEnter={(e) => {
                e.currentTarget.style.color = "#8BC34A"; // Chuyển màu xanh khi hover
                e.currentTarget.style.transform = "scale(1.1)"; // Phóng to nhẹ khi hover
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.color = "#333"; // Quay lại màu ban đầu
                e.currentTarget.style.transform = "scale(1)";
            }}>Thông Tin Sản Phẩm</h1>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "30px",
                margin: "0 auto",
                marginTop :70,
                
            }}>
                 {/* Hình ảnh bên trái */}
                <div style={{
                    width: "300px", 
                    height: "300px", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    borderRadius: "20px", 
                    overflow: "hidden", 
                    marginRight: "20px",
                    backgroundColor: "#fff", // Tạo nền cho ảnh
                    border: "1px solid #8BC34A" ,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)" // Đổ bóng nhẹ cho đẹp
                }}>
                    <img src={imageUrl} alt={product.ten} style={{ 
                        width: "100%", 
                        height: "100%", 
                        objectFit: "cover", 
                        borderRadius: "18px",
                        transition: "all 0.3s ease-in-out"
                    }} 
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.1)"; // Phóng to nhẹ
                        e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.3)"; // Đổ bóng
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                    />
                </div>

                <div
  style={{
    flex: 1,
    padding: "25px",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  }}
>
  {[
    { label: "Tên sản phẩm", field: "ten" },
    { label: "Loại sản phẩm", field: "loai" },
    { label: "Đơn vị", field: "donVi" },
    { label: "Giá bán", field: "gia" },
  ].map(({ label, field }, index) => (
    <p
      key={index}
      style={{
        fontSize: "16px",
        marginBottom: "15px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <strong style={{ width: "120px" }}>{label}:</strong>
      {isEditing ? (
        <input
          type="text"
          value={editedProduct[field]}
          onChange={(e) => handleChange(e, field)}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            outline: "none",
            transition: "0.3s",
          }}
        />
      ) : (
        <span style={{ marginLeft: "10px", color: "#333" }}>{product[field]}</span>
      )}
    </p>
  ))}

  <div style={{ marginTop: "20px" }}>
    <button
      onClick={toggleEdit}
      style={{
        padding: "8px 16px",
        borderRadius: "5px",
        border: "none",
        backgroundColor: isEditing ? "#ff4d4d" : "#007bff",
        color: "white",
        cursor: "pointer",
        fontSize: "14px",
        marginRight: "10px",
        transition: "0.3s",
      }}
    >
      {isEditing ? "HỦY" : "SỬA"}
    </button>
    {isEditing && (
      <button
        onClick={handleSave}
        style={{
          padding: "8px 16px",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "#28a745",
          color: "white",
          cursor: "pointer",
          fontSize: "14px",
          transition: "0.3s",
        }}
      >
        LƯU
      </button>
    )}
  </div>
</div>

          </div>

        </div>

    </div>
  );
};

export default ProductInfo;
