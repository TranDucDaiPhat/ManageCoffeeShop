import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar-container">
      <div className="navbar-left">
        <img
          src="https://media.istockphoto.com/id/1604962651/vi/anh/%E1%BA%A3nh-minh-h%E1%BB%8Da-c%C3%A0-ph%C3%AA-t%C3%A1ch-c%C3%A0-ph%C3%AA-c%C3%B3-l%C3%A1-c%E1%BB%91c-c%C3%A0-ph%C3%AA-3d-c%C3%A0-ph%C3%AA-%C4%91%E1%BB%83-mang-%C4%91i.jpg?s=1024x1024&w=is&k=20&c=ndvo0s3GnDJASwGPW_Ki4o0BlB0SX1JYpNnKy2_9Q-s="
          alt="Cà phê minh họa"
          className="navbar-image"
        />

        <h2 className="navbar-title">Bạn muốn mua gì...</h2>
      </div>

      <nav className="navbar-menu">
        <ul>
          <li>
            <Link to="/homepage">TRANG CHỦ</Link>
          </li>
          <li>
            <Link to="/menu">MENU</Link>
          </li>
          <li>
            <Link to="/about">VỀ CHÚNG TÔI</Link>
          </li>
          <li>
            <Link to="/promotions">KHUYẾN MÃI</Link>
          </li>
          <li>
            <Link to="/membership">HỘI VIÊN</Link>
          </li>
        </ul>
      </nav>

      <div className="navbar-right">
        <div className="delivery-method">
          <span>Chọn Phương Thức Nhận Hàng</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
