import React, { useState, useEffect } from 'react';
import './HomePage.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [visibleProducts, setVisibleProducts] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);

  // Danh sách các banner
  const banners = [
    "https://hcm.fstorage.vn/phuclong/2025/02/image-20250228103044.jpeg",
    "https://hcm.fstorage.vn/phuclong/2025/02/image-20250228103102.jpeg",
    "https://hcm.fstorage.vn/images/2025/04/snapedit_1744181887589-20250409070007.jpeg"
  ];

  // Tự động chuyển slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 10000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Ánh xạ categoryId sang tên hiển thị
  const categoryNames = {
    1: "BESTSELLER - ĐỒ UỐNG BÁN CHẠY",
    2: "NƯỚC NGON NHẤT",
    3: "TOP BÁN CHẠY",
    4: "SẢN PHẨM THỊNH HÀNH"
  };

  // Xử lý xem thêm sản phẩm
  const loadMoreProducts = (categoryId) => {
    setVisibleProducts(prev => ({
      ...prev,
      [categoryId]: (prev[categoryId] || 5) + 5
    }));
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("http://localhost:8081/myapp/api/business/products");
        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu món ăn");
        }
        const data = await response.json();
        setProducts(data);

        const categories = data.reduce((acc, product) => {
          if (!acc[product.categoryId]) {
            acc[product.categoryId] = [];
          }
          acc[product.categoryId].push(product);
          return acc;
        }, {});

        setGroupedProducts(categories);
        
        // Khởi tạo số lượng sản phẩm hiển thị ban đầu
        const initialVisible = {};
        Object.keys(categories).forEach(catId => {
          initialVisible[catId] = 5;
        });
        setVisibleProducts(initialVisible);
      } catch (error) {
        console.error(error);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="home-container">
      {/* Banner Section */}
      <section className="banner-section">
        <div className="banner-slide">
          <img 
            src={banners[currentSlide]} 
            alt={`Banner ${currentSlide + 1}`} 
            className="banner-image"
          />
        </div>
        
        <div className="banner-dots">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        {Object.keys(groupedProducts).map((categoryId) => {
          const productsInCategory = groupedProducts[categoryId] || [];
          const visibleCount = visibleProducts[categoryId] || 5;
          const hasMoreProducts = productsInCategory.length > visibleCount;

          return (
            <div key={categoryId} className="category-row">
              <h2 className="category-title">{categoryNames[categoryId] || `Loại ${categoryId}`}</h2>
              <div className="products-row">
                {productsInCategory.slice(0, visibleCount).map((product) => (
                  <div key={product.productId} className="product-card">
                    <div className="product-image">
                      <img src={product.productImg} alt={product.productName} />
                    </div>
                    <div className="product-info">
                      <h3>{product.productName}</h3>
                      <p className="price">Giá: {product.productPrice} VND</p>
                      <button className="order-btn">Đặt mua</button>
                    </div>
                  </div>
                ))}
              </div>
              {hasMoreProducts && (
                <div className="load-more-container">
                  <button 
                    className="load-more-btn"
                    onClick={() => loadMoreProducts(categoryId)}
                  >
                    Xem thêm
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Best Seller Section */}
      <section className="best-seller-section">
        <h2>BEST SELLERS - TRÀ THƠM CHẤT LƯỢNG</h2>
      </section>
    </div>
  );
};

export default HomePage;