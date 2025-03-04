import { useState } from "react";
import styles from "./EmployeeForm.module.css";
import { Sidebar } from "../../components";

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    birthDate: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "male",
    role: "employee",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
  };

  return (
    <div className="flex">
      <div className={styles.sidebar}>
        <Sidebar />
      </div>

      <div className={styles.container}>
        <h1
          style={{
            color: "red",
            fontSize: "30px",
            fontWeight: "bold",
            marginLeft: "650px",
          }}
        >
          Thêm Nhân Viên Mới
        </h1>

        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <h2 className={styles.formTitle}>Thông Tin Chung</h2>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Họ và Tên</label>
            <input
              type="text"
              name="fullName"
              placeholder="Nhập họ và tên..."
              value={formData.fullName}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Số Điện Thoại</label>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Nhập số điện thoại..."
              value={formData.phoneNumber}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              Nhập Ngày Tháng Năm Sinh
            </label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Giới Tính</label>
            <div className={styles.radioGroup}>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleChange}
                />
                Nam
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleChange}
                />
                Nữ
              </label>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Tài Khoản</label>
            <input
              type="text"
              name="username"
              placeholder="Nhập thông tin tài khoản..."
              value={formData.username}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Mật Khẩu</label>
            <input
              type="password"
              name="password"
              placeholder="Nhập mật khẩu..."
              value={formData.password}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Nhập Lại Mật Khẩu</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu..."
              value={formData.confirmPassword}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Chức Vụ</label>
            <div className={styles.radioGroup}>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="employee"
                  checked={formData.role === "employee"}
                  onChange={handleChange}
                />
                Nhân Viên
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="manager"
                  checked={formData.role === "manager"}
                  onChange={handleChange}
                />
                Quản Lý
              </label>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.button}>
              Tạo Nhanh
            </button>
            <button type="submit" className={styles.button}>
              Thêm nhân viên
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
