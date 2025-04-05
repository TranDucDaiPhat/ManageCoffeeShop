import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./UpdateEmployeeForm.module.css";

const UpdateEmployeeForm = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullName: "",
    birthDate: "",
    phoneNumber: "",
    sex: "",
    role: "",
    email: "",
    password: "",
    avatar: "",
  });
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/user")
      .then((response) => {
        setUser(response.data);
        setAvatarPreview(response.data.avatar);
      })
      .catch((error) => {
        console.error("There was an error fetching the user!", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setUser({ ...user, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:5000/user", user)
      .then(() => {
        navigate("/tai-khoan");
      })
      .catch((error) => {
        console.error("There was an error updating the user!", error);
      });
  };

  const handleCancel = () => {
    navigate("/tai-khoan");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Cập Nhật Thông Tin</h1>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Họ và Tên</label>
          <input
            type="text"
            name="fullName"
            value={user.fullName}
            onChange={handleChange}
            className={styles.inputField}
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Ngày tháng năm sinh</label>
          <input
            type="date"
            name="birthDate"
            value={user.birthDate}
            onChange={handleChange}
            className={styles.inputField}
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Số điện thoại</label>
          <input
            type="text"
            name="phoneNumber"
            value={user.phoneNumber}
            onChange={handleChange}
            className={styles.inputField}
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Giới tính</label>
          <input
            type="text"
            name="sex"
            value={user.sex}
            onChange={handleChange}
            className={styles.inputField}
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Chức Vụ</label>
          <input
            type="text"
            name="role"
            value={user.role}
            onChange={handleChange}
            className={styles.inputField}
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className={styles.inputField}
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Mật Khẩu</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            className={styles.inputField}
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Avatar</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className={styles.inputField}
          />
          {avatarPreview && (
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className={styles.avatarPreview}
            />
          )}
        </div>
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.button}>
            Cập Nhật
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={handleCancel}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEmployeeForm;
