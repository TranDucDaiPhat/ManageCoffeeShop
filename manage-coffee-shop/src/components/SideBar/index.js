import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { useAuth } from "../../AuthContext";

const Sidebar = ({ openSidebar, onOpenSidebar }) => {
  const [openMenuItem, setOpenMenuItem] = useState({}); // Lưu trạng thái mở/đóng submenu
  const { logout, role } = useAuth();

  // Tạo danh sách menu dựa trên role (useMemo giúp tối ưu performance)
  const menuItems = useMemo(() => {
    const items = [
      {
        title: "Đơn Hàng",
        submenu: [
          { title: "Tạo Hoá Đơn", path: "/tao-hoa-don" },
          { title: "Lịch Sử Đơn Hàng", path: "/lich-su-don-hang" },
        ],
      },
      {
        title: "Sản Phẩm",
        submenu: [{ title: "Danh Sách Sản Phẩm", path: "/danh-sach-san-pham" }],
      },
      { title: "Khách Hàng", path: "/khach-hang" },
    ];

    // Chỉ thêm menu "Nhân Viên" nếu role KHÔNG phải là "Employee"
    if (role == "ADMIN") {
      items.push({
        title: "Nhân Viên",
        submenu: [
          { title: "Danh Sách Nhân Viên", path: "/danh-sach-nhan-vien" },
          { title: "Thêm Nhân Viên", path: "/them-nhan-vien" },
        ],
      },
      {
        title: "Thống Kê",
        submenu: [
          { title: "Thống Kê Doanh Thu", path: "/thong-ke-doanh-thu" },
          { title: "Thống Kê Sản Phẩm", path: "/thong-ke-san-pham" },
        ],
      });
    }

    // Thêm menu Thống Kê & Tài Khoản
    items.push(
      {
        title: "Tài Khoản",
        submenu: [
          { title: "Thông Tin", path: "/tai-khoan" },
          { title: "Đăng Xuất", action: logout }, // Dùng action thay vì path
        ],
      }
    );

    return items;
  }, [role, logout]); // Chỉ tính toán lại nếu role hoặc logout thay đổi

  const toggleSubmenu = (index) => {
    setOpenMenuItem((prev) => ({
      ...prev,
      [index]: !prev[index], // Đảo trạng thái submenu
    }));
  };

  return (
    <div className={styles.sidebar}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 className={styles.title}>Dashboard</h2>
        <button
          className={styles.toggleButton}
          onClick={() => onOpenSidebar(!openSidebar)}
        >
          {openSidebar ? "✖" : "☰"}
        </button>
      </div>

      {menuItems.map((item, index) => (
        <div key={index}>
          {item.submenu ? (
            <>
              <div className={styles.menuItem} onClick={() => toggleSubmenu(index)}>
                {item.title} ▾
              </div>
              <div className={`${styles.submenu} ${openMenuItem[index] ? styles.active : ""}`}>
                {item.submenu.map((subItem, subIndex) =>
                  subItem.action ? (
                    <button
                      key={subIndex}
                      className={styles.submenuItem}
                      onClick={subItem.action}
                      style={{
                        background: "none",
                        border: "none",
                        color: "inherit",
                        cursor: "pointer",
                      }}
                    >
                      {subItem.title}
                    </button>
                  ) : (
                    <Link key={subIndex} className={styles.submenuItem} to={subItem.path}>
                      {subItem.title}
                    </Link>
                  )
                )}
              </div>
            </>
          ) : (
            <Link className={styles.menuItem} to={item.path}>
              {item.title}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
