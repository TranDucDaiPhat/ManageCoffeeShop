import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import styles from "./UpdateEmployeeForm.module.css";
import { Sidebar } from "../../components";

const UpdateEmployeeForm = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    empPhone: "",
    empAccount: "",
    empPassword: "",
  });

  const token =
"eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJzdHVkeWNvZmZlZXNob3AuY29tIiwic3ViIjoiYWRtaW4iLCJleHAiOjE3NDUzMjk5NzMsImlhdCI6MTc0NTMyNjM3Mywic2NvcGUiOiJBRE1JTiJ9.Jki842RFAQZ88Ao2ilQn_K4jxsjKnw6L0CiMyY-efHXqaIHzBWCYvV1uVEYMk5zNl-Ax8CeJ2p5uAU41WRBtcw"
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
          navigate("/");
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
        navigate("/danh-sach-nhan-vien");
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          alert("Bạn không có quyền cập nhật. Vui lòng đăng nhập lại.");
          navigate("/danh-sach-nhan-vien");
        } else {
          alert("Có lỗi xảy ra khi cập nhật.");
        }
      });
  };

  return (
    <div className={styles.container}>
      <button
        className="toggleButtonSidebar"
        onClick={() => setOpenSidebar(!openSidebar)}
      >
        ☰
      </button>
      {openSidebar && (
        <Sidebar openSidebar={openSidebar} onOpenSidebar={setOpenSidebar} />
      )}
      <div className={styles.topBar}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/danh-sach-nhan-vien")}
          className={`${styles.backButton} ${
            openSidebar ? styles.shifted : ""
          }`}
        >
          Quay lại
        </Button>
        <h1 className={styles.header}>Chỉnh sửa nhân viên</h1>
      </div>
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
          Mật khẩu:
          <input
            type="password"
            name="empPassword"
            value={formData.empPassword}
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
