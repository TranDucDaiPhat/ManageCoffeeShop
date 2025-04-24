import React, { useState } from "react";
import { Sidebar } from "../../components";


const AddProduct = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [image, setImage] = useState("/img8.jpg"); // Ảnh mặc định

  // Xử lý khi chọn ảnh
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Hiển thị ảnh mới
    }
  };
  const [product, setProduct] = useState({
    ten: "",
    gia: "",
    loai: "",
    donVi: "ly",
    moTa: "",
    hinhAnh: "",
  });
  
  
  const handleAddProduct = () => {
    console.log("Sản phẩm thêm:", product);
  
    fetch("API_URL", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(product)
    })
    .then(response => response.json())
    .then(data => console.log("Phản hồi từ server:", data))
    .catch(error => console.error("Lỗi:", error));
  };
  
  
  // Nếu có API, bạn có thể gửi dữ liệu lên server ở đây
  fetch("API_URL", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(product)
  }).then(response => response.json())
    .then(data => console.log("Phản hồi từ server:", data));
  

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        position: "relative",
        background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.9))",
        backdropFilter: "blur(10px)",
        boxShadow: "inset 0 0 50px rgba(0, 0, 0, 0.1)",
      }}
    >
      {openSidebar && (
        <div style={{ width: "250px", transition: "width 0.5s ease", overflow: "hidden" }}>
          <Sidebar openSidebar={openSidebar} onOpenSidebar={setOpenSidebar} />
        </div>
      )}

      <div
        style={{
          width: openSidebar ? `calc(100% - 250px)` : "100%",
          transition: "width 0.5s ease",
          padding: "20px",
          backgroundColor: "#FFFFFF",
          margin: "0 auto",
        }}
      >
        {!openSidebar && <button onClick={() => setOpenSidebar(true)}>☰</button>}

        {/* Nội dung */}
        <div
          style={{
            backgroundColor: "#D9D9D9",
            borderRadius: "15px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            width: "100%",
            height: "100vh",
            padding: "20px",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              marginBottom: "20px",
              fontSize: "28px",
              fontWeight: "bold",
              color: "#8BC34A",
              textTransform: "uppercase",
              letterSpacing: "2px",
              transition: "color 0.3s ease, transform 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#8BC34A";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#333";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Thêm sản phẩm
          </h1>

          <div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
                Tên sản phẩm
            </label>
            <input
                type="text"
                placeholder="Nhập tên sản phẩm..."
                value={product.ten}
                onChange={(e) => setProduct({ ...product, ten: e.target.value })}
                style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
                transition: "border-color 0.3s",
                }}
                onFocus={(e) => e.target.style.borderColor = "#4CAF50"}
                onBlur={(e) => e.target.style.borderColor = "#ccc"}
            />
            </div>


            <div style={{ display: "flex", gap: "20px" }}>
              {/* Bên trái */}
              <div style={{ width: "100%", paddingRight: "20px" }}>
                 <div style={{ 
                    width: "100%", 
                    padding: "15px", 
                    borderRadius: "10px", 
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", 
                    backgroundColor: "#fff"
                    }}>
                    {/* Mã sản phẩm */}
                    <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
                        Phân loại:
                    </label>
                    <input
                        type="text"
                        placeholder="Nhập loại sản phẩm..."
                        value={product.loai}
                        onChange={(e) => setProduct({ ...product, loai: e.target.value })}
        
        
                        style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "15px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
                        transition: "border-color 0.3s",
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#4CAF50"}
                        onBlur={(e) => e.target.style.borderColor = "#ccc"}
                    />

                    {/* Giá */}
                    <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
                        Giá sản phẩm:
                    </label>
                    <input
                        type="number"
                        placeholder="Nhập giá..."
                        value={product.gia}
                        onChange={(e) => setProduct({ ...product, gia: e.target.value })}
        
                        style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "15px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
                        transition: "border-color 0.3s",
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#4CAF50"}
                        onBlur={(e) => e.target.style.borderColor = "#ccc"}
                    />

                    {/* Đơn vị */}
                    <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
                        Đơn vị
                    </label>
                    <select
                        style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "15px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                        }}
                    >
                        <option>Chai</option>
                        <option>Lon</option>
                        <option>Ly</option>
                    </select>

                    {/* Danh mục */}
                    <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
                        Danh mục
                    </label>
                    <select
                        style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "15px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                        }}
                    >
                        <option>Trà</option>
                        <option>Caffe</option>
                        <option>Nước ngọt</option>
                    </select>

                    {/* Mô tả */}
                    <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
                        Mô tả
                    </label>
                    <textarea
                        placeholder="Nhập mô tả..."
                        value={product.moTa}
                        onChange={(e) => setProduct({ ...product, moTa: e.target.value })}
                        style={{
                        width: "100%",
                        height: "100px",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
                        transition: "border-color 0.3s",
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#4CAF50"}
                        onBlur={(e) => e.target.style.borderColor = "#ccc"}
                    ></textarea>
                    </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                onClick={handleAddProduct}
                    style={{
                        padding: "12px 20px",
                        fontSize: "16px",
                        backgroundColor: "#8BC34A",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        marginRight: "10px",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#6a9e3b";
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#8BC34A";
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
                    }}
                    >
                    Thêm sản phẩm
                </button>

                <button
                    style={{
                        padding: "12px 20px",
                        fontSize: "16px",
                        backgroundColor: "#FF5252",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#D32F2F";
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#FF5252";
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
                        
                    }}
                    onClick={handleAddProduct}
                    >
                    Xóa
                </button>

                </div>
              </div>
              {/* Bên phải */}
              <div style={{ width: "50%" }}>
                <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
                    Hình ảnh
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ marginBottom: "10px" }}
                />
                <div
                    style={{
                    width: "350px",
                    height: "400px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "15px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    border: image ? "none" : "2px dashed #ccc",
                    backgroundColor: image ? "transparent" : "#f0f0f0",
                    }}
                    onMouseEnter={(e) => {
                    if (image) {
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.3)";
                    }
                    }}
                    onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
                    }}
                >
                    {image ? (
                    <img
                        src={image}
                        alt="Ảnh sản phẩm"
                        style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        borderRadius: "15px",
                        }}
                    />
                    ) : (
                    <span style={{ color: "#888" }}>Chưa có hình ảnh</span>
                    )}
                </div>
                </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
