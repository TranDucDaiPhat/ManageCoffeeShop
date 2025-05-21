import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { Cart } from '../../components';
import Chatbox from '../../pages/Chatbox/chatbox';


const HomePage = () => {
  const [showChat, setShowChat] = useState(false);

  const [products, setProducts] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [visibleProducts, setVisibleProducts] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate()
  const branches = [
    {
      id: 1,
      name: "Chi nhánh 1",
      code: "BĐC-CH 44 Nguyen Dinh Chieu P.PC",
      address: "44 Nguyễn Đình Chiểu P. Phú Cường TP. Thủ Dầu Một T. Bình Dương",
      phone: "(029) 7100 1988 (Eat.20029)",
      hours: "07:00 - 22:30",
      status: "Đóng cửa",
      mapLink: "https://www.google.com/maps?q=44+Nguyễn+Đình+Chiểu+Phú+Cường+Thủ+Dầu+Một+Bình+Dương"
    },
    {
      id: 2,
      name: "Chi nhánh 2",
      code: "CTC-CH Vincom Hung Vuong Số 2 HV",
      address: "Vincom Hung Vuong Số 2 HV P. Thời gian Q. Ninh Kiều TP. Cần Thơ",
      phone: "(029) 2384 4444",
      hours: "06:30 - 22:20",
      status: "Đóng cửa",
      mapLink: "https://www.google.com/maps?q=Vincom+Hung+Vuong+Số+2+HV+Ninh+Kiều+Cần+Thơ"
    },
    {
      id: 3,
      name: "Chi nhánh 3",
      code: "CTC-CH 314 Đường 304 PHL Q.Ninh",
      address: "314 Đường 304 H. Hung Lợi Q. Ninh Kiều TP. Cần Thơ",
      phone: "(029) 2378 2555",
      hours: "07:00 - 22:30",
      status: "Đóng cửa",
      mapLink: "https://www.google.com/maps?q=314+Đường+304+Hung+Lợi+Ninh+Kiều+Cần+Thơ"
    }
  ];
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
    }, 3000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Ánh xạ categoryId sang tên hiển thị
  const categoryNames = {
    1: "BESTSELLER - ĐỒ UỐNG BÁN CHẠY",
    2: "THỨC UỐNG ĐƯỢC YÊU THÍCH",
    3: "TOP ĐỒ UỐNG ƯA CHUỘNG",
    4: "SẢN PHẨM HOT NHẤT"
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

      <Cart />

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
                      <button
                        className="order-btn"
                        onClick={() => { navigate('/product_customer', { state: { product } }) }}
                      >Đặt mua</button>
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


      <section className="store-locator">
        <h2>Danh sách cửa hàng Phúc Long</h2>

        <div className="store-map-container">
          <iframe
            className="google-map"
            title="Phuc Long Store Map - Chi nhánh 44 Nguyễn Đình Chiểu"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.802115425782!2d106.6636113153383!3d10.775403492304735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1c06f4e1dd%3A0x43900c842115f320!2s44%20Nguy%E1%BB%85n%20%C4%90%C3%ACnh%20Chi%E1%BB%83u%2C%20Ph%C3%BA%20C%C6%B0%E1%BB%9Dng%2C%20Th%E1%BB%A7%20D%E1%BA%A7u%20M%E1%BB%99t%2C%20B%C3%ACnh%20D%C6%B0%C6%A1ng%2C%20Vietnam!5e0!3m2!1sen!2s!4v1621234567890!5m2!1sen!2s"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

        <div className="store-list">
          {branches.map(branch => (
            <div key={branch.id} className="store-card">
              <h3>{branch.name}</h3>
              <p className="store-code">{branch.code}</p>
              <p className="store-address">{branch.address}</p>
              <p className="store-phone">Số điện thoại: {branch.phone}</p>
              <p className="store-hours">Giờ hoạt động: {branch.hours}</p>
              <p className="store-status">Trạng thái hoạt động: {branch.status}</p>
              <a
                href={branch.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="direction-btn"
              >
                🔍 Chỉ đường
              </a>
            </div>
          ))}
        </div>
      </section>
      {/* <footer className="phuclong-footer">
        <div className="footer-container">

          <div className="footer-column">
            <h3>CÔNG TY</h3>
            <p>Trụ sở chính: Công ty Cổ phần Phúc Long Heritage</p>
            <p>Địa chỉ: 44 Nguyễn Đình Chiểu, Phú Cường, Thủ Dầu Một, Bình Dương</p>
            <p>Văn phòng: Tầng 7, Tòa nhà Central Plaza, 91 Lê Duẩn, Quận 1, TP.HCM</p>
            <div className="qrcode">
              <img src="https://th.bing.com/th/id/OIP.yYUgQZ-BGc1OiHRbZKJKeQHaHa?w=185&h=185&c=7&r=0&o=5&dpr=1.4&pid=1.7" alt="QR Code" />
            </div>
          </div>

          <div className="footer-column">
            <h3>TỐC KHỨC</h3>
            <ul>
              <li><a href="/about">Giới thiệu</a></li>
              <li><a href="/news">Tin tức</a></li>
              <li><a href="/career">Tuyển dụng</a></li>
              <li><a href="/franchise">Nhượng quyền</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>HỖ TRỢ</h3>
            <ul>
              <li><a href="/faq">Câu hỏi thường gặp</a></li>
              <li><a href="/terms">Điều khoản sử dụng</a></li>
              <li><a href="/policy">Chính sách bảo mật</a></li>
              <li><a href="/store-locator">Hệ thống cửa hàng</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>LIÊN HỆ</h3>
            <div className="contact-info">
              <p>Hotline: <a href="tel:18001234">1800 1234</a></p>
              <p>Email: <a href="mailto:info@phuclong.com">info@phuclong.com</a></p>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <p>Design and content are copied from Phuc Long Heritage for study purposes only. All rights belong to Phuc Long.</p>
        </div>
      </footer> */}
      <button
        className="btnChat"
        onClick={() => setShowChat(!showChat)}
        aria-label="Open Chatbox"
      >
        💬
      </button>

      {showChat && (
        <div className="chatPanel">
          <button
            className="closeBtn"
            onClick={() => setShowChat(false)}
            aria-label="Close Chatbox"
          >

          </button>
          <div className="chatContent">
            <Chatbox />
          </div>
        </div>
      )}
    </div>

  );
};

export default HomePage;