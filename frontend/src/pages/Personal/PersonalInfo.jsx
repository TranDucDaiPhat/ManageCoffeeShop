import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./PersonalInfo.module.css";
import { Sidebar } from "../../components";
import { message } from "antd";

const PersonalInfo = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    const empId = sessionStorage.getItem("employeeId"); // 👈 Lấy từ sessionStorage

    if (!token || !empId) {
      message.error("Vui lòng đăng nhập");
      return;
    }

    axios
      .get(`http://localhost:8081/myapp/api/business/employee/${empId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((error) => {
        console.error("Không thể tải thông tin cá nhân!", error);
        message.error("Lỗi tải thông tin cá nhân");
      });
  }, []);

  if (!user) return <div>Đang tải thông tin...</div>;

  return (
    <div className={styles.container}>
      <button
        className={styles.toggleButton}
        onClick={() => setOpenSidebar(!openSidebar)}
      >
        ☰
      </button>
      {openSidebar && <Sidebar openSidebar onOpenSidebar={setOpenSidebar} />}
      <h1 className={styles.header}>Thông Tin Cá Nhân</h1>
      <div className={styles.userCard}>
        <p>
          <strong>Mã nhân viên (ID):</strong> {user.empId}
        </p>
        <p>
          <strong>Họ và Tên:</strong> {user.empName}
        </p>
        <p>
          <strong>Năm sinh:</strong> {user.empYearOfBirth}
        </p>
        <p>
          <strong>Số điện thoại:</strong> {user.empPhone}
        </p>
        <p>
          <strong>Chức Vụ:</strong> {user.empRole}
        </p>
        <p>
          <strong>Tài khoản:</strong> {user.empAccount}
        </p>
      </div>
    </div>
  );
};

export default PersonalInfo;
