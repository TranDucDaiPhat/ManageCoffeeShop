import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./UpdateEmployeeForm.module.css";

const UpdateEmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    empName: "",
    empPhone: "",
    empYearOfBirth: "",
    empAccount: "",
    empRole: "",
  });

  const token = "YOUR_TOKEN_HERE";

  useEffect(() => {
    axios
      .get(`http://localhost:8081/myapp/api/business/employee/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setFormData(res.data);
      })
      .catch((err) => {
        alert("Không thể tải thông tin nhân viên");
        navigate("/");
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(
        `http://localhost:8081/myapp/api/business/employee/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        alert("Cập nhật thành công!");
        navigate("/");
      })
      .catch(() => {
        alert("Có lỗi xảy ra khi cập nhật.");
      });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Chỉnh sửa nhân viên</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Họ và tên:
          <input
            type="text"
            name="empName"
            value={formData.empName}
            onChange={handleChange}
          />
        </label>
        <label>
          Số điện thoại:
          <input
            type="text"
            name="empPhone"
            value={formData.empPhone}
            onChange={handleChange}
          />
        </label>
        <label>
          Năm sinh:
          <input
            type="text"
            name="empYearOfBirth"
            value={formData.empYearOfBirth}
            onChange={handleChange}
          />
        </label>
        <label>
          Tài khoản:
          <input
            type="text"
            name="empAccount"
            value={formData.empAccount}
            onChange={handleChange}
          />
        </label>
        <label>
          Chức vụ:
          <select
            name="empRole"
            value={formData.empRole}
            onChange={handleChange}
          >
            <option value="">-- Chọn --</option>
            <option value="USER">Nhân viên</option>
            <option value="ADMIN">Quản lý</option>
          </select>
        </label>
        <button type="submit">Lưu thay đổi</button>
      </form>
    </div>
  );
};

export default UpdateEmployeeForm;
