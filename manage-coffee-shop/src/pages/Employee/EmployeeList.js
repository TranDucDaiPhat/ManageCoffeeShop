import React, { useState, useEffect } from "react";
import axios from "axios";
import clsx from "clsx";
import styles from "./EmployeeList.module.css";
import { Sidebar } from "../../components";
import { useNavigate } from "react-router-dom";

const EmployeeList = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentEmployee, setCurrentEmployee] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/employees")
      .then((response) => {
        const data = response.data;

        setEmployees(data.filter((emp) => emp.quyen != "Manager"));
      })
      .catch((error) => {
        console.error("There was an error fetching the employees!", error);
      });
  }, []);
  const handleSubmit = () => {
    navigate("/them-nhan-vien");
  };

  return (
    <div className={styles.container}>
      <button
        className="toggleButtonSidebar"
        onClick={() => setOpenSidebar(!openSidebar)}
      >
        ☰
      </button>
      {openSidebar ? (
        <Sidebar openSidebar onOpenSidebar={setOpenSidebar} />
      ) : null}

      <div className={styles.content}>
        <h2 className={styles.title}>Danh sách nhân viên</h2>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="🔍 Tìm kiếm"
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div>
            <button
              className={clsx(styles.customButton, {
                [styles.enableButton]: currentEmployee ? false : true
              })}
              style={{ backgroundColor: '#ff2b5c' }}
            >
              Xoá
            </button>
            <button
              style={{ backgroundColor: '#5985d7' }}
              className={clsx(styles.customButton, {
                [styles.enableButton]: currentEmployee ? false : true
              })}
            >
              Chỉnh sửa
            </button>
            <button className={styles.customButton} onClick={handleSubmit}>
              Thêm Nhân Viên
            </button>
          </div>
        </div>

        <div className={styles.contentList}>
          <div className={styles.tableContainer}>
            <table className={styles.employeeTable}>
              <thead>
                <tr>
                  <th>Mã Nhân Viên</th>
                  <th>Tên Nhân Viên</th>
                  <th>Năm Sinh</th>
                  <th>Số Điện Thoại</th>
                  <th>Giới Tính</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.maNhanVien}
                    onClick={() => setCurrentEmployee(emp)}
                    className={currentEmployee?.maNhanVien === emp.maNhanVien ? styles.selectedRow : ""}
                  >
                    <td>{emp.maNhanVien}</td>
                    <td>{emp.tenNhanVien}</td>
                    <td>{emp.namSinh}</td>
                    <td>{emp.soDienThoai}</td>
                    <td>{emp.gioiTinh}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* <div className={styles.tableContainer}>
          <table className={styles.headerTable}>
            <thead>
              <tr>
                <th>Mã Nhân Viên</th>
                <th>Tên Nhân Viên</th>
                <th>Năm Sinh</th>
                <th>Số Điện Thoại</th>
                <th>Giới Tính</th>
              </tr>
            </thead>
            <tbody className={styles.bodyTable}>
              {employees.map((emp) => (
                <tr key={emp.maNhanVien} onClick={() => setCurrentEmployee(emp)}>
                  <td>{emp.maNhanVien}</td>
                  <td>{emp.tenNhanVien}</td>
                  <td>{emp.namSinh}</td>
                  <td>{emp.soDienThoai}</td>
                  <td>{emp.gioiTinh}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}
      </div>
    </div>
  );
};

export default EmployeeList;
