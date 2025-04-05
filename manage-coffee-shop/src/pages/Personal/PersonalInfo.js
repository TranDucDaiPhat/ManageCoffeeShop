import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./PersonalInfo.module.css";
import { Sidebar } from "../../components";

const PersonalInfo = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/user")
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the user!", error);
      });
  }, []);

  return (
    <div className={styles.container}>
      <button
        className={styles.toggleButton}
        onClick={() => setOpenSidebar(!openSidebar)}
      >
        ☰
      </button>
      {openSidebar ? (
        <Sidebar openSidebar onOpenSidebar={setOpenSidebar} />
      ) : null}
      <h1 className={styles.header}>Thông Tin Cá Nhân</h1>
      <div className={styles.userCard}>
        <img src={user.avatar} alt="Avatar" className={styles.avatar} />
        <p>
          <strong>Họ và Tên:</strong> {user.fullName}
        </p>
        <p>
          <strong>Ngày tháng năm sinh:</strong> {user.birthDate}
        </p>
        <p>
          <strong>Số điện thoại:</strong> {user.phoneNumber}
        </p>
        <p>
          <strong>Giới tính:</strong> {user.sex}
        </p>
        <p>
          <strong>Chức Vụ:</strong> {user.role}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Mật Khẩu:</strong> {user.password}
        </p>
        <Link to="/cap-nhat-thong-tin">
          <button className={styles.updateButton}>Cập Nhật Thông Tin</button>
        </Link>
      </div>
    </div>
  );
};

export default PersonalInfo;
