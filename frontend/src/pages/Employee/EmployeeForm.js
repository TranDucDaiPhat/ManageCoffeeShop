import { useState } from "react";
import styles from "./EmployeeForm.module.css";
import { Sidebar } from "../../components";
import { useNavigate } from "react-router-dom";
import employeeApi from "../../API/employeeApi";

const EmployeeForm = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [formData, setFormData] = useState({
    empName: "",
    empPhone: "",
    empYearOfBirth: "",
    empAccount: "",
    empPassword: "",
    empRole: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const {
      empName,
      empPhone,
      empYearOfBirth,
      empAccount,
      empPassword,
      empRole,
    } = formData;

    if (
      !empName.trim() ||
      !empPhone.trim() ||
      !empYearOfBirth.trim() ||
      !empAccount.trim() ||
      !empPassword.trim() ||
      !empRole.trim()
    ) {
      alert("Vui lòng điền đầy đủ tất cả các trường!");
      return false;
    }

    // Tên không chứa số hoặc ký tự đặc biệt
    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(empName)) {
      alert("Họ và tên không được chứa số hoặc ký tự đặc biệt!");
      return false;
    }

    // Năm sinh gồm 4 số và không lớn hơn năm hiện tại
    const currentYear = new Date().getFullYear();
    if (!/^\d{4}$/.test(empYearOfBirth)) {
      alert("Năm sinh phải gồm 4 chữ số!");
      return false;
    }
    if (parseInt(empYearOfBirth) > currentYear) {
      alert("Năm sinh không được lớn hơn năm hiện tại!");
      return false;
    }

    // Số điện thoại phải đủ 10 chữ số
    if (!/^[0-9]{10}$/.test(empPhone)) {
      alert("Số điện thoại không hợp lệ!");
      return false;
    }

    // Mật khẩu ít nhất 6 ký tự
    if (empPassword.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("accessToken");
      await employeeApi.create(formData, token);
      alert("Thêm nhân viên thành công!");
      navigate("/danh-sach-nhan-vien");
    } catch (error) {
      console.error("Lỗi khi thêm nhân viên:", error);
      alert("Đã xảy ra lỗi, vui lòng thử lại!");
    }
  };

  const handleQuickCreate = () => {
    setFormData({
      empName: "",
      empPhone: "",
      empYearOfBirth: "",
      empAccount: "",
      empPassword: "",
      empRole: "",
    });
  };

  return (
    <div className={styles.flex}>
      <button
        className={styles.toggleButton}
        onClick={() => setOpenSidebar(!openSidebar)}
      >
        ☰
      </button>
      {openSidebar && (
        <Sidebar openSidebar={openSidebar} onOpenSidebar={setOpenSidebar} />
      )}

      <div className={styles.container}>
        <h1 className={styles.header}>Thêm Nhân Viên Mới</h1>

        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <h2 className={styles.formTitle}>Thông Tin Chung</h2>

          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Họ và Tên</label>
              <input
                type="text"
                name="empName"
                placeholder="Nhập họ và tên..."
                value={formData.empName}
                onChange={handleChange}
                className={styles.inputField}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Số Điện Thoại</label>
              <input
                type="text"
                name="empPhone"
                placeholder="Nhập số điện thoại..."
                value={formData.empPhone}
                onChange={handleChange}
                className={styles.inputField}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Nhập Năm Sinh</label>
              <input
                type="text"
                name="empYearOfBirth"
                placeholder="YYYY"
                value={formData.empYearOfBirth}
                onChange={handleChange}
                className={styles.inputField}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Tài Khoản</label>
              <input
                type="text"
                name="empAccount"
                placeholder="Nhập thông tin tài khoản..."
                value={formData.empAccount}
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
                    name="empRole"
                    value="USER"
                    checked={formData.empRole === "USER"}
                    onChange={handleChange}
                  />
                  Nhân Viên
                </label>
                <label>
                  <input
                    type="radio"
                    name="empRole"
                    value="ADMIN"
                    checked={formData.empRole === "ADMIN"}
                    onChange={handleChange}
                  />
                  Quản Lý
                </label>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Mật Khẩu</label>
              <input
                type="password"
                name="empPassword"
                placeholder="Nhập mật khẩu..."
                value={formData.empPassword}
                onChange={handleChange}
                className={styles.inputField}
              />
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.button}
              onClick={handleQuickCreate}
            >
              Tạo Lại
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
