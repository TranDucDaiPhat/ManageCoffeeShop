import React, { useState, useEffect } from "react";
import { Sidebar } from "../../components";
import { getMons } from "../servise/api";
import { useNavigate } from "react-router-dom";
import noImage from "./no-image.jpg";  // Ảnh mặc định


const ProductList = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getMons();
        setAllProducts(data);

        const uniqueCategories = [...new Set(data.map((product) => product.loai))];
        setCategories(uniqueCategories);

        if (!selectedCategory && uniqueCategories.length > 0) {
          setSelectedCategory(uniqueCategories[0]);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách sản phẩm:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const filteredProducts = allProducts.filter((product) => product.loai === selectedCategory);
      setProducts(filteredProducts.slice(0, 8));
    }
  }, [selectedCategory, allProducts]);


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

        {/* // noi dung */}
        <div style={{ // Màu nền
             // Bóng đổ
            //  borderRadius: "15px", // Bo góc
            // boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            width: "100%", // Đảm bảo full chiều ngang
            height: "100vh", // Chiều cao full màn hình
            }}>
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
            }}>Danh Sách Sản Phẩm</h1>
      

        
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" ,   }}>
          {categories.map((category) => (
            <button
                key={category}
                style={{
                    padding: "12px 24px",
                    margin: "0 10px",
                    background: selectedCategory === category ? "#8BC34A" : "#E8F5E9", // Xanh lá nhạt khi chọn, xanh lá rất nhạt khi chưa chọn
                    color: selectedCategory === category ? "#fff" : "#2E7D32", // Chữ trắng khi chọn, xanh đậm khi chưa chọn
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "bold",
                    transition: "background 0.3s ease, transform 0.2s ease",
                }}
                
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#689F38"; // Đổi thành xanh lá đậm khi hover
                    e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                    selectedCategory === category ? "#8BC34A" : "#E8F5E9";
                    e.currentTarget.style.transform = "scale(1)";
                }}
                onClick={() => setSelectedCategory(category)}
                >
                {category}
            </button>


          ))}
        </div>

        {/* Danh sách sản phẩm */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          backgroundColor: "#D9D9D9",
          maxHeight: "calc(4 * (150px + 10px + 20px))",
          overflowY: "auto",
          padding: "10px",
        }}>
          {products.map((product) => (
            <div key={product.id} style={{ border: "1px solid #ccc",padding: "10px",
                backgroundColor: "#fff",
                textAlign: "center",
                borderRadius: "10px", // Bo góc
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Phủ bóng
                transition: "transform 0.2s ease, box-shadow 0.2s ease", }}
                onClick={() => navigate(`/ProductInfo/${product.id}`)} 
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)"; // Phóng to nhẹ khi hover
                    e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.2)"; // Tăng độ bóng khi hover
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
                }}>
              <img
                 src={product.hinhAnh 
                  ? (product.hinhAnh.startsWith("http") 
                      ? product.hinhAnh 
                      : `http://localhost:3001${product.hinhAnh.replace("/public", "")} `) 
                  : noImage} 
                alt={product.ten}
                style={{ width: "100%", height: "150px", objectFit: "cover" }}
              />
              {/* <img src={product.hinhAnh ? product.hinhAnh : noImage} alt={product.ten} /> */}


              <h3>{product.ten}</h3>
              <p>{product.gia.toLocaleString()} ₫</p>
            </div>
          ))}
        </div>

        <button
          style={{
            position: "absolute",
            bottom: "10px", // Đưa về góc dưới
            right: "30px", // Đưa về góc phải
            padding: "12px 24px",
            background: "#8BC34A", // Màu xanh lá nhạt
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "background 0.3s ease, transform 0.2s ease",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Bóng đổ nhẹ
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#689F38"; // Đậm hơn khi hover
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#8BC34A";
            e.currentTarget.style.transform = "scale(1)";
          }}
          onClick={() => window.location.href = "/AddProduct"} // Chuyển hướng trang
        >
          THÊM SẢN PHẨM
        </button>


        </div>
      </div>
    </div>
  );
};

export default ProductList;
