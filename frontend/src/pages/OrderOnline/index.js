import { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import { toast } from "react-toastify";
import styles from "./OrderOnline.module.css"
import { Sidebar } from "../../components";


function OrderOnline() {

    const [openSidebar, setOpenSidebar] = useState(false);
    const { role } = useAuth();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderOnlines, setOrderOnlines] = useState([])

    const handleUpdateOrder = () => {
        if (selectedOrder != null) {
            const token = sessionStorage.getItem("accessToken");

            if (!token) {
                console.log("Không tìm thấy access token!");
                return;
            }

            fetch(`http://localhost:8081/myapp/api/business/sepay/updateStatus/${selectedOrder.orderOnlID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                credentials: "include",
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data == true) {
                        setOrderOnlines(orderOnlines.filter(order => order.orderOnlID != selectedOrder.orderOnlID))
                        setSelectedOrder(null)
                        toast.success('Đã hoàn thành đơn!')
                    }
                    console.log('update status: ', data)
                })
                .catch(error => {
                    console.error("Lỗi khi update", error);
                });
        } else {
            toast.info('Vui lòng chọn một đơn hàng để hoàn thành')
        }
    }

    useEffect(() => {
        if (!role) return;

        const token = sessionStorage.getItem("accessToken");

        if (!token) {
            console.log("Không tìm thấy access token!");
            return;
        }

        fetch(`http://localhost:8081/myapp/api/business/sepay/ordNYD`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
            credentials: "include",
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('fetch order online:', data)
                setOrderOnlines(data)
            })
            .catch(error => {
                // console.error("Lỗi kiểm tra thanh toán", error);
                console.log('Tìm đơn hàng mới...')
            });
    }, [role]);

    const handleRowClick = (data) => {
        setSelectedOrder(data);
    };

    return (
        <div className={styles.screen}>
            <button
                className='toggleButtonSidebar'
                style={{ left: 30, top: 20 }}
                onClick={() => setOpenSidebar(!openSidebar)}
            >☰</button>
            {openSidebar ? <Sidebar openSidebar onOpenSidebar={setOpenSidebar} /> : <></>}

            <div className={styles.container}>
                <h2 style={{ textAlign: 'center', color: 'var(--primary)', marginTop: 5 }}>Danh sách đơn đặt hàng</h2>

                <div className={styles.content}>
                    <div className={styles.contentList}>
                        <div className={styles.tableContainer}>
                            <table className={styles.customerTable}>
                                <thead>
                                    <tr>
                                        <th>Mã hoá đơn</th>
                                        <th>Địa chỉ giao hàng</th>
                                        <th>Thời gian</th>
                                        <th>Tổng tiền</th>
                                        <th>Ghi chú</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderOnlines.map((order, index) => (
                                        <tr key={order.orderOnlID}
                                            className={selectedOrder?.orderOnlID === order.orderOnlID ? styles.selectedRow : ""}
                                            onClick={() => handleRowClick(order)}
                                        >
                                            <td>{order.orderOnlID}</td>
                                            <td>{order.deliveryAddress}</td>
                                            <td>{order.deliveryTime}</td>
                                            <td>{order.totalOrd}</td>
                                            <td>{order.noteOfCus != "" ? order.noteOfCus : "Không có"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', width: '85%', justifyContent: 'flex-end' }}>
                    <button className={styles.customButton}
                        onClick={() => handleUpdateOrder()}
                    >Hoàn Thành Đơn</button>
                </div>
            </div>
        </div>
    )
}

export default OrderOnline