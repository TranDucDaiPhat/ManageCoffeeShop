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
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token =
      "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJzdHVkeWNvZmZlZXNob3AuY29tIiwic3ViIjoiYWRtaW4iLCJleHAiOjE3NDQzNzA1NjQsImlhdCI6MTc0NDM2Njk2NCwic2NvcGUiOiJBRE1JTiJ9.qpM4TV72wPhS1wwoBBfIqQa6T_NvNQCyp5FqDL-21A7zu3zS8GCYL3sLzN-hyfXaqmnOjmTQYQhmEzBqceWdXA";
    axios
      .get("http://localhost:8081/myapp/api/business/employee", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        const filteredData = response.data.filter((emp) => emp.empRole !== "");
        setEmployees(filteredData);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách nhân viên:", error);
      });
  }, [navigate]);

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter employees based on the search term
  const filteredEmployees = employees.filter((emp) =>
    emp.empName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle when clicking "Thêm Nhân Viên"
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
        <Sidebar openSidebar={openSidebar} onOpenSidebar={setOpenSidebar} />
      ) : null}

      <div className={styles.content}>
        <h2 className={styles.title}>Danh sách nhân viên</h2>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="🔍 Tìm kiếm"
            className={styles.searchInput}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div>
            <button
              className={clsx(styles.customButton, {
                [styles.enableButton]: !currentEmployee,
              })}
              style={{ backgroundColor: "#ff2b5c" }}
              disabled={!currentEmployee}
            >
              Xoá
            </button>
            <button
              className={clsx(styles.customButton, {
                [styles.enableButton]: !currentEmployee,
              })}
              style={{ backgroundColor: "#5985d7" }}
              disabled={!currentEmployee}
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
                  <th>Tên Nhân Viên</th>
                  <th>Năm Sinh</th>
                  <th>Số Điện Thoại</th>
                  <th>Chức Vụ</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.empName}
                    onClick={() => setCurrentEmployee(emp)}
                    className={
                      currentEmployee?.empName === emp.empName
                        ? styles.selectedRow
                        : ""
                    }
                  >
                    <td>{emp.empName}</td>
                    <td>{emp.empYearOfBirth}</td>
                    <td>{emp.empPhone}</td>
                    <td>{emp.empRole}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
