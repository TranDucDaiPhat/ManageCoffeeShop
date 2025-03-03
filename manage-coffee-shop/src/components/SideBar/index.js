import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Sidebar.module.css";

const menuItems = [
    { title: "Đơn Hàng",
        submenu: [
            { title: "Tạo Hoá Đơn", path: "/tao-hoa-don" },
            { title: "Lịch Sử Đơn Hàng", path: "/lich-su-don-hang" },
        ],
    },

    { title: "Sản Phẩm",
        submenu: [
            { title: "Danh Sách Sản Phẩm", path: "/danh-sach-san-pham" },
        ],
    },

    { title: "Khách Hàng", path: "/khach-hang" },

    { title: "Tài Khoản",
        submenu: [
            { title: "Thông Tin", path: "/tai-khoan" },
            { title: "Đăng Xuất" },
        ],
    },
];

const Sidebar = ({openSidebar, onOpenSidebar}) => {
    const [openMenuItem, setOpenMenuItem] = useState({}); // Lưu trạng thái mở/đóng submenu

    const toggleSubmenu = (index) => {
        setOpenMenuItem((prev) => ({
            ...prev,
            [index]: !prev[index], // Đảo trạng thái submenu
        }));
    };

    return (
        <div className={styles.sidebar}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <h2 className={styles.title}>Dashboard</h2>
                <button className={styles.toggleButton} onClick={() => onOpenSidebar(!openSidebar)}>
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
                                {item.submenu.map((subItem, subIndex) => (
                                    <Link key={subIndex} className={styles.submenuItem} to={subItem.path}>
                                        {subItem.title}
                                    </Link>
                                ))}
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
