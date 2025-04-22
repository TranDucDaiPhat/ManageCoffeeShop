import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { Sidebar } from "../../components";
import employeeApi from "../../API/employeeApi";
import styles from "./UpdateEmployeeForm.module.css";

const UpdateEmployeeForm = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    empPhone: "",
    empAccount: "",
    empPassword: "",
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await employeeApi.getById(id);
        setFormData(data);
      } catch (error) {
        toast.error("Không thể tải thông tin nhân viên.");
        navigate("/danh-sach-nhan-vien");
      }
    };
    fetchEmployee();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!formData.empPhone || !formData.empAccount || !formData.empPassword) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.empPhone)) {
      toast.error("Số điện thoại không hợp lệ. Vui lòng nhập lại.");
      return false;
    }

    if (formData.empPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await employeeApi.update(id, formData);
      toast.success("Cập nhật thành công!");
      navigate("/danh-sach-nhan-vien");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật.");
    }
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
