import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.mainFooter}>
      <div className={styles.footerContainer}>
        {/* Company Info Column */}
        <div className={styles.footerColumn}>
          <h3>CÔNG TY</h3>
          <p>Trụ sở chính: Công ty Cổ phần Phúc Long Heritage</p>
          <p>
            Địa chỉ: 44 Nguyễn Đình Chiểu, Phú Cường, Thủ Dầu Một, Bình Dương
          </p>
          <p>
            Văn phòng: Tầng 7, Tòa nhà Central Plaza, 91 Lê Duẩn, Quận 1, TP.HCM
          </p>
          <div className={styles.qrcode}>
            <img
              src="https://th.bing.com/th/id/OIP.yYUgQZ-BGc1OiHRbZKJKeQHaHa?w=185&h=185&c=7&r=0&o=5&dpr=1.4&pid=1.7"
              alt="QR Code"
            />
          </div>
        </div>

        {/* Quick Links Column */}
        <div className={styles.footerColumn}>
          <h3>TỐC KHỨC</h3>
          <ul>
            <li>
              <a href="/about">Giới thiệu</a>
            </li>
            <li>
              <a href="/news">Tin tức</a>
            </li>
            <li>
              <a href="/career">Tuyển dụng</a>
            </li>
            <li>
              <a href="/franchise">Nhượng quyền</a>
            </li>
          </ul>
        </div>

        {/* Support Column */}
        <div className={styles.footerColumn}>
          <h3>HỖ TRỢ</h3>
          <ul>
            <li>
              <a href="/faq">Câu hỏi thường gặp</a>
            </li>
            <li>
              <a href="/terms">Điều khoản sử dụng</a>
            </li>
            <li>
              <a href="/policy">Chính sách bảo mật</a>
            </li>
            <li>
              <a href="/store-locator">Hệ thống cửa hàng</a>
            </li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className={styles.footerColumn}>
          <h3>LIÊN HỆ</h3>
          <div className={styles.contactInfo}>
            <p>
              Hotline: <a href="tel:18001234">1800 1234</a>
            </p>
            <p>
              Email: <a href="mailto:info@phuclong.com">info@phuclong.com</a>
            </p>
            {/* <div className="social-links">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
            </div> */}
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>
          Design and content are copied from Phuc Long Heritage for study
          purposes only. All rights belong to Phuc Long.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
