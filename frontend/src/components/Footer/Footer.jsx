import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.customFooter}>
      <div className={styles.footerContainer}>
        <div className={styles.footerColumn}>
          <h4>ĐỊA CHỈ</h4>
          <p>
            <strong>Địa chỉ:</strong> Số 1 Đường Xanh, Quận Bình An, TP. HCM
          </p>
          <p>
            <strong>Hotline Đặt hàng:</strong> 1800 9999
          </p>
          <p>
            <strong>Hotline Công ty:</strong> 1900 1234
          </p>
          <p>
            <strong>Email:</strong> contact@thestudycoffee.vn
          </p>
        </div>

        <div className={styles.footerColumn}>
          <h4>CÔNG TY</h4>
          <p>Giới thiệu công ty</p>
          <p>Thư viện hình ảnh</p>
          <p>Liên hệ</p>
          <p>Hình ảnh Menu</p>
        </div>

        <div className={styles.footerColumn}>
          <h4>TUYỂN DỤNG</h4>
          <p>Nhân viên bán hàng</p>
          <p>Quản lý cửa hàng</p>
          <p>Văn phòng</p>
        </div>

        <div className={styles.footerColumn}>
          <h4>HỘI VIÊN</h4>
          <p>FAQ</p>
          <p>Điều kiện hội viên</p>
          <p>Chính sách hoàn tiền</p>
        </div>

        <div className={styles.footerColumn}>
          <h4>ĐIỀU KHOẢN</h4>
          <p>Chính sách bảo mật</p>
          <p>Chính sách mua hàng</p>
        </div>
      </div>
      <div className={styles.footerBotttom}>
        <p>© 2025 TheStudyCoffee. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
