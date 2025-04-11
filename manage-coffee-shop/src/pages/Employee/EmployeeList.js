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

  const token =
    "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJzdHVkeWNvZmZlZXNob3AuY29tIiwic3ViIjoiYWRtaW4iLCJleHAiOjE3NDQ0MDc0MDcsImlhdCI6MTc0NDQwMzgwNywic2NvcGUiOiJBRE1JTiJ9.pxwFwI7Gu6HqGQVGgFs8lefbn0hLlSsMlBhsU1KUZD43S_EjpRQtKw0TvDMw5fmAGXqSvEaXGPQNJA0t3LPe2A";
  const fetchEmployees = () => {
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
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = () => {
    if (!currentEmployee) return;
    const confirmDelete = window.confirm("Bạn có chắc muốn xoá nhân viên này?");
    if (!confirmDelete) return;

    axios
      .delete(
        `http://localhost:8081/myapp/api/business/employee/${currentEmployee.empId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )
      .then(() => {
        alert("Xoá thành công!");
        setCurrentEmployee(null);
        fetchEmployees();
      })
      .catch((error) => {
        console.error("Lỗi khi xoá nhân viên:", error);
        alert("Không thể xoá nhân viên!");
      });
  };

  const handleEdit = () => {
    if (currentEmployee) {
      navigate(`/cap-nhat-thong-tin/${currentEmployee.empId}`);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.empName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                [styles.disabledButton]: !currentEmployee,
              })}
              onClick={handleDelete}
              disabled={!currentEmployee}
              style={{ backgroundColor: "#ff2b5c" }}
            >
              Xoá
            </button>
            <button
              className={clsx(styles.customButton, {
                [styles.disabledButton]: !currentEmployee,
              })}
              onClick={handleEdit}
              disabled={!currentEmployee}
              style={{ backgroundColor: "#5985d7" }}
            >
              Chỉnh sửa
            </button>
            <button
              className={styles.customButton}
              onClick={() => navigate("/them-nhan-vien")}
            >
              Thêm Nhân Viên
            </button>
          </div>
        </div>

        <div className={styles.contentList}>
          <div className={styles.tableContainer}>
            <table className={styles.employeeTable}>
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Tên</th>
                  <th>Năm sinh</th>
                  <th>Điện thoại</th>
                  <th>Chức vụ</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.empId}
                    onClick={() => setCurrentEmployee(emp)}
                    className={
                      currentEmployee?.empId === emp.empId
                        ? styles.selectedRow
                        : ""
                    }
                  >
                    <td>{emp.empId}</td>
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
