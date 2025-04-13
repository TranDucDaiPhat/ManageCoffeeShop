import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./EmployeeForm.module.css";
import { Sidebar } from "../../components";

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
  const [employees, setEmployees] = useState([]);

  const token =
"eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJzdHVkeWNvZmZlZXNob3AuY29tIiwic3ViIjoiYWRtaW4iLCJleHAiOjE3NDQ1NDYwMDQsImlhdCI6MTc0NDU0MjQwNCwic2NvcGUiOiJBRE1JTiJ9.Wtdd6lqKQSqYDz0xtB1AEe0J_Q7UTJ8DGcnyMXbejNp_HMQMXrpMQ4VZyGSkQAGloVpWgkiSra2uvUi7zrbpBA"  
useEffect(() => {
    axios
      .get("http://localhost:8081/myapp/api/business/employee", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the employees!", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8081/myapp/api/business/employee", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setEmployees([...employees, response.data]);
        alert("Thêm nhân viên thành công!");
      })
      .catch((error) => {
        console.error("There was an error adding the employee!", error);
        alert("Lỗi khi thêm nhân viên!");
      });
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
            <label className={styles.inputLabel}>Năm Sinh</label>
            <input
              type="text"
              name="empYearOfBirth"
              placeholder="Nhập năm sinh (VD: 1999)"
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
              placeholder="Nhập tên tài khoản..."
              value={formData.empAccount}
              onChange={handleChange}
              className={styles.inputField}
            />
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

          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.button}
              onClick={handleQuickCreate}
            >
              Nhập Lại
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
