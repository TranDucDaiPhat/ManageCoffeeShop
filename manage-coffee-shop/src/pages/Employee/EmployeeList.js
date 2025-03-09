import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./EmployeeList.module.css";
import { Sidebar } from "../../components";

const EmployeeList = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/employees")
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the employees!", error);
      });
  }, []);

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div className={styles.content}>
        <h2 className={styles.title}>Danh sách nhân viên</h2>

        <div className={styles.statsContainer}>
          <div className={styles.statsBox}>
            <p className={styles.statsTitle}>Tổng số nhân viên</p>
            <p className={styles.statsValue}>{employees.length}</p>
          </div>
          <div className={styles.statsBox}>
            <p className={styles.statsTitle}>Tổng số quản lý</p>
            <p className={styles.statsValue}>
              {employees.filter((emp) => emp.role === "Quản Lý").length}
            </p>
          </div>
        </div>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="🔍 Tìm kiếm"
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className={styles.addButton}>Thêm Nhân Viên</button>
        </div>

        <table className={styles.employeeTable}>
          <thead>
            <tr>
              <th>Tên Nhân Viên</th>
              <th>Giới Tính</th>
              <th>Số Điện Thoại</th>
              <th>Ngày Tháng Năm Sinh</th>
              <th>Chức Vụ</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>{emp.gender}</td>
                <td>{emp.phone}</td>
                <td>{emp.dob}</td>
                <td>{emp.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
