import React, { useState, useEffect } from "react";
import "./EmployeeList.module.css";
import Sidebar from "../../components/SideBar";
const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const data = [
      {
        name: "Trần Thị Trang",
        gender: "nữ",
        phone: "0348576985",
        dob: "01/12/2001",
        role: "Nhân Viên",
      },
      {
        name: "Chu Nguyên Chương",
        gender: "nam",
        phone: "0708952364",
        dob: "15/01/1999",
        role: "Quản Lý",
      },
      {
        name: "Lưu Bá Ôn",
        gender: "nam",
        phone: "0854875236",
        dob: "07/01/2002",
        role: "Nhân Viên",
      },
    ];
    setEmployees(data);
  }, []);

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <Sidebar />

      <div className="content">
        <h2 className="title">Danh sách nhân viên</h2>

        <div className="stats-container">
          <div className="stats-box">
            <p className="stats-title">Tổng số nhân viên</p>
            <p className="stats-value">{employees.length}</p>
          </div>
          <div className="stats-box">
            <p className="stats-title">Tổng số quản lý</p>
            <p className="stats-value">
              {employees.filter((emp) => emp.role === "Quản Lý").length}
            </p>
          </div>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="add-button">Thêm Nhân Viên</button>
        </div>

        <table className="employee-table">
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
            {filteredEmployees.map((emp, index) => (
              <tr key={index}>
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
