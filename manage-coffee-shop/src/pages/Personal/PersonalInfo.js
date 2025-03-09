import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./PersonalInfo.module.css";
import { Sidebar } from "../../components";

const PersonalInfo = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the users!", error);
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
      {users.map((user) => (
        <div key={user.id} className={styles.userCard}>
          <p>
            <strong>Họ và Tên:</strong> {user.fullName}
          </p>
          <p>
            <strong>Tuổi:</strong> {user.age}
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
        </div>
      ))}
    </div>
  );
};

export default PersonalInfo;
