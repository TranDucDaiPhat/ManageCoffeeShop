import { useState, useEffect } from 'react';
import clsx from 'clsx';
import axios from "axios";
import { toast } from 'react-toastify';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays } from "date-fns";
import styles from './OrderHistory.module.css'
import { Sidebar } from '../../components';
import { useAuth } from "../../AuthContext";
import { getOrdersByDate } from '../../API';

function OrderHistory() {
    const [openSidebar, setOpenSidebar] = useState(false);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const [showConfirm, setShowConfirm] = useState(false); // Hiển thị xác nhận xóa
    const [countdown, setCountdown] = useState(5); // Đếm ngược 5 giây

    const { role } = useAuth();

    useEffect(() => {
        let date = '';
        if (role == 'ADMIN') {
            const vndate = new Date();
            vndate.setHours(vndate.getHours() + 7); // Cộng 7 giờ theo giờ VN
            date = vndate.toISOString().split('T')[0];
        } else {
            date = 'today'
        }
        getOrdersByDate(date, setOrders)
    }, []);



    // Gọi API khi chọn ngày
    const handleChangeOrders = () => {
        const rawDate = new Date(selectedDate);
        const year = rawDate.getFullYear();
        const month = String(rawDate.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0 nên +1
        const day = String(rawDate.getDate()).padStart(2, "0");

        const formattedDate = `${year}-${month}-${day}`;
        getOrdersByDate(formattedDate, setOrders)
    };

    const handleRowClick = (order) => {
        setSelectedOrder(order);
        console.log(order)
        setShowConfirm(false); // Ẩn xác nhận xóa khi mở popup mới
    };

    // Đóng popup
    const closePopup = () => {
        setSelectedOrder(null);
    };

    // Khi nhấn "Xóa hóa đơn", hiển thị xác nhận xóa
    const handleDeleteClick = () => {
        setShowConfirm(true);
        setCountdown(5);

        // Bắt đầu đếm ngược
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    clearInterval(interval); // Dừng đếm khi còn 1 giây
                }
                return prev - 1;
            });
        }, 1000);
    };

    const confirmDelete = () => {
        // goi api xoa
        closePopup();
    };

    const generateCalendarDays = () => {
        const startMonth = startOfMonth(currentMonth);
        const endMonth = endOfMonth(currentMonth);
        const startDate = startOfWeek(startMonth);
        const endDate = endOfWeek(endMonth);

        let days = [];
        let day = startDate;

        while (day <= endDate) {
            days.push(day);
            day = addDays(day, 1);
        }
        return days;
    };

    // Khi chọn ngày
    const handleDateClick = (day) => {
        setSelectedDate(day);
    };

    // Chuyển tháng trước
    const prevMonth = () => {
        setCurrentMonth(addDays(currentMonth, -30));
    };

    // Chuyển tháng sau
    const nextMonth = () => {
        setCurrentMonth(addDays(currentMonth, 30));
    };

    const Calendar = () => {
        return (
            <div className={styles.contentCalendar}>
                <h3 style={{ textAlign: 'center' }}>Ngày lập hoá đơn</h3>
                <div className={styles.calendarWrapper}>
                    {/* Thanh điều hướng tháng */}
                    <div className={styles.calendarHeader}>
                        <button onClick={prevMonth}>&lt;</button>
                        <h3>{'Tháng ' + format(currentMonth, "MM yyyy")}</h3>
                        <button onClick={nextMonth}>&gt;</button>
                    </div>

                    {/* Hiển thị lịch */}
                    <div className={styles.calendarGrid}>
                        {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day, index) => (
                            <div key={index} className={styles.calendarDayHeader}>{day}</div>
                        ))}
                        {generateCalendarDays().map((day, index) => (
                            <div
                                key={index}
                                className={`${styles.calendarDay} ${format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd") ? styles.selectedDay : ""}`}
                                onClick={() => handleDateClick(day)}
                            >
                                {format(day, "d")}
                            </div>
                        ))}
                    </div>

                    {/* Hiển thị ngày đã chọn */}
                    {selectedDate && (
                        <p className={styles.selectedDate}>
                            Ngày bạn đã chọn: <strong>{format(selectedDate, "dd/MM/yyyy")}</strong>
                        </p>
                    )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                        className={styles.customButton}
                        style={{ backgroundColor: '#007bff' }}
                        onClick={handleChangeOrders}
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.screen}>
            <button
                className='toggleButtonSidebar'
                style={{ left: 30, top: 20 }}
                onClick={() => setOpenSidebar(!openSidebar)}
            >☰</button>
            {openSidebar ? <Sidebar openSidebar onOpenSidebar={setOpenSidebar} /> : <></>}

            <div className={styles.container}>
                <h2 style={{ textAlign: 'center', color: 'var(--primary)' }}>Lịch sử đơn hàng</h2>


                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 15, marginBottom: 8 }}>
                    <div style={{ width: '90%', display: 'flex', alignItems: 'center', justifyContent: role !== "ADMIN" ? "center" : "flex-start" }}>
                        <div>Từ trước đến nay:</div>
                        <div className={styles.customInput}>
                            <input type="number" placeholder="Nhập số mã hoá đơn..." />
                            <img src="/image/16-search-icon.png" alt="Search" width={18} />
                        </div>
                        <button className={styles.customButton}>
                            Tìm kiếm
                        </button>
                        <div style={{ paddingTop: 2, marginLeft: 15 }}>{`Số lượng: ${orders.length}`}</div>
                    </div>
                </div>

                <div className={styles.content}>
                    <div className={styles.contentList}>
                        <div className={styles.tableContainer}>
                            <table className={styles.orderTable}>
                                <thead>
                                    <tr>
                                        <th>Mã Hoá Đơn</th>
                                        <th>Mã Nhân Viên</th>
                                        <th>Phương thức thanh toán</th>
                                        <th>Tổng Tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.billId}
                                            className={selectedOrder?.billId === order.billId ? styles.selectedRow : ""}
                                            onClick={() => handleRowClick(order)}
                                        >
                                            <td>{order.billId}</td>
                                            <td>{order.employeeId}</td>
                                            <td>{order.paymentMethod}</td>
                                            <td>{order.orderTotal}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {role == "ADMIN" ? <Calendar /> : <></>}
                </div>
            </div >
            {/* Popup hiển thị chi tiết hóa đơn */}
            {selectedOrder && (
                <div className={styles.popup}>
                    <div className={styles.popupContent}>
                        <button className={styles.closeButton} onClick={closePopup}>✖</button>
                        <h3 style={{ marginBottom: 5 }}>🧾 Hóa đơn: {selectedOrder.billId}</h3>
                        {selectedOrder.customerId ? <p><strong>Mã Khách hàng:</strong> {selectedOrder.customerId}</p> : <></>}
                        <p><strong>Mã Nhân viên:</strong> {selectedOrder.employeeId}</p>
                        <p><strong>Ngày tạo:</strong> {selectedOrder.orderDate}</p>
                        <p><strong>Phương thức thanh toán:</strong> {selectedOrder.paymentMethod}</p>
                        <p><strong>Tổng tiền:</strong> {selectedOrder.orderTotal.toLocaleString()} đ</p>

                        <h4>🥤 Chi tiết hóa đơn</h4>
                        <div className={styles.scrollContainer}>
                            <table className={styles.detailTable}>
                                <thead>
                                    <tr>
                                        <th>Món</th>
                                        <th>Số lượng</th>
                                        <th>Đơn giá</th>
                                        <th>Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.orderDetails.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.productName}</td>
                                            <td>{item.productQuantity}</td>
                                            <td>{item.productPrice.toLocaleString()} đ</td>
                                            <td>{(item.subTotal).toLocaleString()} đ</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Nút xóa hóa đơn */}
                        {!showConfirm ? (
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 15 }}>
                                <button
                                    className={styles.customButton}
                                    style={{ backgroundColor: 'red', width: '25vh' }}
                                    onClick={handleDeleteClick}>🗑 Xóa hóa đơn
                                </button>
                            </div>
                        ) : (
                            <div className={styles.confirmBox}>
                                <p>❗ Bạn có chắc muốn xóa hóa đơn?</p>
                                <button
                                    className={styles.confirmButton}
                                    onClick={confirmDelete}
                                    disabled={countdown > 0}
                                >
                                    {countdown > 0 ? `Vui lòng chờ ${countdown}s` : "✅ Xác nhận xóa"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

}

export default OrderHistory;