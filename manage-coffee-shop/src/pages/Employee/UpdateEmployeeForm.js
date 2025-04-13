import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./UpdateEmployeeForm.module.css";

const UpdateEmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    empPhone: "",
    empAccount: "",
    empPassword: ""
  });

  const token =
    "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJzdHVkeWNvZmZlZXNob3AuY29tIiwic3ViIjoiYWRtaW4iLCJleHAiOjE3NDQ1NDYwMDQsImlhdCI6MTc0NDU0MjQwNCwic2NvcGUiOiJBRE1JTiJ9.Wtdd6lqKQSqYDz0xtB1AEe0J_Q7UTJ8DGcnyMXbejNp_HMQMXrpMQ4VZyGSkQAGloVpWgkiSra2uvUi7zrbpBA";

  useEffect(() => {
    axios
      .get(`http://localhost:8081/myapp/api/business/employee/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, 
      })
      .then((res) => {
        setFormData(res.data);
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          navigate("/login");
        } else {
          alert("Không thể tải thông tin nhân viên");
          navigate("/");
        }
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
          withCredentials: true,
        }
      )
      .then(() => {
        alert("Cập nhật thành công!");
        navigate("/");
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          alert("Bạn không có quyền cập nhật. Vui lòng đăng nhập lại.");
          navigate("/");
        } else {
          alert("Có lỗi xảy ra khi cập nhật.");
        }
      });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Chỉnh sửa nhân viên</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Số điện thoại:
          <input
            type="text"
            name="empPhone"
            value={formData.empPhone}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Tài khoản:
          <input
            type="text"
            name="empAccount"
            value={formData.empAccount}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Tài khoản:
          <input
            type="passwordpassword"
            name="empAccoun"
            value={formData.empAccount}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Lưu thay đổi</button>
      </form>
    </div>
  );
};

export default UpdateEmployeeForm;
