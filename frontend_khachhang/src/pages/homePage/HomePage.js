import React from 'react';
import './HomePage.css';

const HomePage = () => {
  // Danh sách sản phẩm
  const products = [
    {
      id: 1,
      name: "Hồng Trà Latte Máy (L)",
      price: "65.000 €",
      image: "/images/hong-tra-latte.jpg"
    },
    {
      id: 2,
      name: "Hồng Trà Latte Nguyên Vị (L)",
      price: "65.000 €",
      image: "/images/hong-tra-nguyen-vi.jpg"
    },
    {
      id: 3,
      name: "Bánh Cuộn Dầu",
      price: "42.000 €",
      image: "/images/banh-cuon-dau.jpg"
    },
    {
      id: 4,
      name: "Bánh Chuối Hạt Dinh Dưỡng",
      price: "38.000 €",
      image: "/images/banh-chuoi.jpg"
    }
  ];

  return (
    <div className="home-container">
      <section className="banner-section">
        <h1>BST Tea Latte - Bánh Banaberry mới!</h1>
      </section>
      
      <section className="products-section">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="price">{product.price}</p>
              <button className="order-btn">Đặt mua</button>
            </div>
          </div>
        ))}
      </section>
      
      <section className="best-seller-section">
        <h2>BEST SELLERS - TRÀ THƠM CHẤT LƯỢNG</h2>
        {/* Có thể thêm danh sách best sellers ở đây */}
      </section>
    </div>
  );
};

export default HomePage;