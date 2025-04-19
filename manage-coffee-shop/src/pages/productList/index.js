import React, { useState, useEffect } from "react";
import { Sidebar } from "../../components";
import { useNavigate } from "react-router-dom";
import noImage from "./no-image.jpg";  // Ảnh mặc định
import { getMons } from "../../Api/productApi"; // đường dẫn đúng theo cấu trúc dự án của bạn
import { getCategories } from "../../Api/categoryApi";
const ProductList = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  /// phan trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;


/// lay du lieu trang hien tai 
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
const totalPages = Math.ceil(products.length / itemsPerPage);

  // Load dữ liệu sản phẩm và danh mục
  useEffect(() => {
      async function fetchData() {
        try {
          const data = await getMons(); // sản phẩm
          const categoryData = await getCategories(); // danh mục
    
          setAllProducts(data);
          setCategories(categoryData); // giữ selectedCategory là null
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu:", error);
        }
      }
      fetchData();
    }, []); 
  

    // tinh toans san pham o trang hien tai
    useEffect(() => {
      let filtered = selectedCategory
        ? allProducts.filter((p) => p.categoryId === selectedCategory)
        : allProducts;
    
      setProducts(filtered);
      setCurrentPage(1); // Reset về trang đầu mỗi khi chọn danh mục mới
    }, [allProducts, selectedCategory]);
  

  
  return (
    
    <div
    style={{
      display: "flex",
      height: "100vh",
      position: "relative",
      background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.9))",
      backdropFilter: "blur(10px)",
      boxShadow: "inset 0 0 50px rgba(0, 0, 0, 0.1)",
      paddingTop: "20px", // Cách phía trên 20px cho toàn bộ nội dung
      boxSizing: "border-box"
    }}
  >
    {openSidebar && (
      <div
        style={{
          width: "250px",
          transition: "width 0.5s ease",
          overflow: "hidden",
          marginLeft: "20px" // Cách lề trái một chút nếu bạn muốn cân đối hơn
        }}
      >
        <Sidebar openSidebar={openSidebar} onOpenSidebar={setOpenSidebar} />
      </div>
    )}
  
    <div
        style={{
          width: openSidebar ? `calc(100% - 250px)` : "100%",
          transition: "width 0.5s ease",
          margin: "0 20px", // Cách trái phải 20px
          backgroundColor: "black",
          borderRadius: "15px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          padding: "20px",
          overflowY: "auto",
          height: "calc(100% - 20px)", // Để không tràn container chính
          boxSizing: "border-box"
        }}
      >
          {!openSidebar && <button onClick={() => setOpenSidebar(true)}>☰</button>}

        {/* // noi dung */}
        <div style={{ width: "100%", height: "100vh", }}>

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
        <button
            style={{
              padding: "12px 24px",
              margin: "0 10px",
              background: selectedCategory === null ? "#8BC34A" : "#E8F5E9",
              color: selectedCategory === null ? "#fff" : "#2E7D32",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "background 0.3s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#689F38";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = selectedCategory === null ? "#8BC34A" : "#E8F5E9";
              e.currentTarget.style.transform = "scale(1)";
            }}
            onClick={() => setSelectedCategory(null)}
          >
            Tất Cả
        </button>
        {categories.map((category) => (
          <button
              key={category.categoryId}
              style={{
                padding: "12px 24px",
                margin: "0 10px",
                background: selectedCategory === category.categoryId ? "#8BC34A" : "#E8F5E9",
                color: selectedCategory === category.categoryId ? "#fff" : "#2E7D32",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                transition: "background 0.3s ease, transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#689F38";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  selectedCategory === category.categoryId ? "#8BC34A" : "#E8F5E9";
                e.currentTarget.style.transform = "scale(1)";
              }}
              onClick={() => setSelectedCategory(category.categoryId)}
            >
              {category.categoryName}
          </button>
        ))}
        
        </div>

        {/* Danh sách sản phẩm */}
<div style={{
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "20px",
  backgroundColor: "#ffffff", // nền trắng
  minHeight: "70vh", 
  maxHeight: "70vh", 
  overflowY: "auto",
  padding: "10px",
}}>
  {currentProducts.map((product, index) => (
    <div
      key={product.productId || index}

      style={{
        border: "1px solid #4CAF50", // viền xanh lá cây
        padding: "10px",
        backgroundColor: "#ffffff",
        textAlign: "center",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(76, 175, 80, 0.2)", // bóng xanh nhẹ
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "pointer",
        alignSelf: "start"
      }}
      onClick={() => {
  navigate(`/ProductInfo/${product.productId}`);
}}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = "0 6px 12px rgba(46, 125, 50, 0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 8px rgba(76, 175, 80, 0.2)";
      }}
    >
      <img
        src={
          product.productImg
            ? product.productImg.startsWith("http")
              ? product.productImg
              : `http://localhost:3001${product.productImg.replace("/public", "")}`
            : noImage
        }
        alt={product.productName}
        style={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
          borderRadius: "8px"
        }}
      />
      <h4 style={{ marginTop: "10px", fontSize: "16px", fontWeight: "bold", color: "#2e7d32" }}>
        {product.productName}
      </h4>
      <p style={{ color: "#388e3c", fontSize: "14px" }}>
        {product.productPrice} VND
      </p>
    </div>
  ))}
</div>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
  {Array.from({ length: totalPages }, (_, index) => (
    <button
      key={index}
      onClick={() => setCurrentPage(index + 1)}
      style={{
        margin: "0 5px",
        padding: "8px 16px",
        background: currentPage === index + 1 ? "#8BC34A" : "#E8F5E9",
        color: currentPage === index + 1 ? "#fff" : "#2E7D32",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold"
      }}
    >
      {index + 1}
    </button>
  ))}
</div>


        <button
          style={{
            padding: "12px 24px",
      margin: "0 10px",
      background: selectedCategory === null ? "#8BC34A" : "#E8F5E9",
      color: selectedCategory === null ? "#fff" : "#2E7D32",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "bold",
      transition: "background 0.3s ease, transform 0.2s ease",
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
