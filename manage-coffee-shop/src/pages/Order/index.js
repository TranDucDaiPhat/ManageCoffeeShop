import { useState, useEffect } from "react";
import clsx from "clsx";
import { VariableSizeGrid as Grid } from "react-window";
import axios from "axios";
import { Sidebar } from "../../components";
import styles from "./Order.module.css"

const types = ['Tất cả', 'Classic Cocktails', 'Trà', 'Bánh Ngọt', 'Cà Phê']

const formatCurrency = (amount, locale = "vi-VN", currency = "VND") => {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
    }).format(amount);
};

function Order() {
    const [items, setItems] = useState([]);
    const [openSidebar, setOpenSidebar] = useState(false);
    const [currentType, setCurrentType] = useState(types[0]);
    const [currentListItem, setCurrentListItem] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [tongTien, setTongTien] = useState(0);
    const [tienKhachTra, setTienKhachTra] = useState('');
    const [tienThua, setTienThua] = useState();

    const [gridWidth, setGridWidth] = useState(window.innerWidth * 0.46);
    const [columns, setColumns] = useState(window.innerWidth * 0.44 < 600 ? 2 : 3);

    useEffect(() => {
        axios.get("http://localhost:5000/items")
            .then(response => {
                setItems(response.data)
                setCurrentListItem(response.data)
            })
            .catch(error => console.error("Lỗi khi gọi API:", error));
    }, []);
    useEffect(() => {
        const handleResize = () => {
            const newWidth = window.innerWidth * 0.46;
            setGridWidth(newWidth);
            if (newWidth > 750) {
                setColumns(3)
            } else {
                setColumns(2)
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const tongTien = TinhTongTien()
        setTongTien(tongTien)
        if (tienKhachTra) {
            setTienThua(tienKhachTra - tongTien)
        }
    }, [orderItems])

    function handleAddItemToOrder(item) {
        const newOrderItems = [...orderItems, {
            maMon: item.maMon,
            tenMon: item.tenMon,
            soLuong: 1,
            donGia: item.donGia
        }];
        setOrderItems(newOrderItems)
    }

    const Item = ({ columnIndex, rowIndex, style }) => {
        const index = rowIndex * columns + columnIndex;
        const item = currentListItem[index]
        if (item) {
            return (
                <div style={{ ...style, display: "flex", justifyContent: "center", alignItems: "center", cursor: 'pointer' }} onClick={() => handleAddItemToOrder(item)}>
                    <div className={styles.itemWrapper}>
                        <img src={item.hinhAnh || '\\image\\no-image.jpg'} height={145} width={120} style={{ objectFit: "cover" }} />
                        <div className={styles.itemInfo}>
                            <p style={{ fontWeight: 700 }}>{item.tenMon}</p>
                            <p>{formatCurrency(item.donGia)}</p>
                        </div>
                    </div>
                </div>
            )
        }
    };

    function handleChangeType(type) {
        setCurrentType(type)
        if (type == 'Tất cả') {
            setCurrentListItem(items)
        } else {
            const newItems = items.filter(item => item.loai == type)
            setCurrentListItem(newItems)
        }
    }

    async function createOrder() {
        if (orderItems.length > 0) {
            const hoaDon = {
                maHoaDon: "HD" + Math.ceil(Math.random() * 1111),
                maKhachHang: null,
                maNhanVien: null,
                ngayTao: new Date().toISOString().slice(0, 19),
                tongTien,
                phuongThucThanhToan: "Tiền mặt",
                chiTietHoaDon: orderItems
            }
            try {
                const response = await axios.post("http://localhost:5000/orders", hoaDon);
                console.log("✅ Hóa đơn đã gửi thành công:", response.data);
                return response.data; // Trả về dữ liệu phản hồi từ server
            } catch (error) {
                console.error("❌ Lỗi khi gửi hóa đơn:", error.response?.data || error.message);
                throw error;
            }
        } else {
            console.log("do nothing")
        }
    }

    const OrderItem = ({ orderItem, index }) => {
        return (
            <div className={styles.orderItem}>
                <p style={{ flex: 5 }}>{`${index + 1}.  ${orderItem.tenMon}`}</p>

                <div style={{ display: 'flex', flex: 3, flexDirection: 'row', alignItems: 'center' }}>
                    <button className={styles.buttonIcon} onClick={() => handleChangeQuantity(index, -1)}>
                        <img src="/image/24-minus.png" />
                    </button>
                    <p>{orderItem.soLuong}</p>
                    <button className={styles.buttonIcon} onClick={() => handleChangeQuantity(index, 1)}>
                        <img src="/image/24-plus.png" />
                    </button>
                </div>

                <p style={{ flex: 3 }}>{orderItem.donGia}</p>

                <p style={{ flex: 2 }}>{orderItem.donGia * orderItem.soLuong}</p>

                <button className={styles.buttonIcon} onClick={() => deleteOrderItem(index)}>
                    {"✖"}
                </button>
            </div>
        )
    }

    function handleChangeQuantity(index, value) {
        const quantity = orderItems[index].soLuong + value
        if (quantity > 0) {
            const newOrderItems = [...orderItems];
            newOrderItems[index] = { ...newOrderItems[index], soLuong: quantity };
            setOrderItems(newOrderItems);
        }
    }

    function deleteOrderItem(index) {
        setOrderItems(orderItems.filter((ỉtem, i) => i !== index));
    }

    function TinhTongTien() {
        return orderItems.reduce((init, current) => {
            return init + current.soLuong * current.donGia
        }, 0)
    }

    return (
        <div style={{ padding: 12 }}>
            <button
                className="toggleButtonSidebar"
                onClick={() => setOpenSidebar(!openSidebar)}
            >☰</button>
            {openSidebar ? <Sidebar openSidebar onOpenSidebar={setOpenSidebar} /> : <></>}

            <div className={styles.content}>
                <div className={styles.contentMenu}>
                    <div className={styles.headForm}>
                        <div className={styles.describe}>Thực đơn</div>

                        <div className={styles.searchInput}>
                            <img src="/image/16-search-icon.png" alt="Search" width={18} />
                            <input type="text" placeholder="Tìm kiếm..." />
                        </div>
                    </div>

                    <div className={styles.mainMenu}>
                        <div>
                            {types.map((type, index) => {
                                return <button
                                    className={clsx(styles.btnType, {
                                        [styles.activeType]: currentType == type
                                    })}
                                    key={index}
                                    onClick={() => handleChangeType(type)}
                                >{type}</button>
                            })}
                        </div>
                        <Grid
                            columnCount={columns}
                            rowCount={Math.ceil(currentListItem.length / columns)}
                            columnWidth={() => gridWidth / columns - 30} // Chiều rộng mỗi cột
                            rowHeight={() => 240} // Chiều cao mỗi hàng
                            width={gridWidth} // Tổng chiều rộng
                            height={Math.min(600, window.innerHeight * 0.78)} // Tổng chiều cao
                        >
                            {Item}
                        </Grid>
                    </div>
                </div>
                <div className={styles.contentOrder}>
                    <div className={styles.headForm}>
                        <div className={styles.describe}>Hoá Đơn</div>
                        <button className={styles.buttonIcon}>
                            <img src="/image/24-plus.png" width={25} />
                        </button>
                    </div>

                    <div className={styles.mainMenu} style={{ padding: 15, position: 'relative' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', marginLeft: 10, marginBottom: 15, fontSize: 14 }}>
                            <p style={{ flex: 5 }}>Tên sản phẩm</p>
                            <p style={{ flex: 3 }}>Số lượng</p>
                            <p style={{ flex: 3 }}>Đơn giá</p>
                            <p style={{ flex: 3 }}>Tổng</p>
                        </div>

                        <div style={{ maxHeight: '50vh', overflowY: 'auto', marginRight: '-10px' }}>
                            {orderItems.map((orderItem, index) => {
                                return <OrderItem key={index} orderItem={orderItem} index={index} />
                            })}
                        </div>

                        {/* Thông tin thanh toán */}
                        <div className={styles.payment}>
                            <div className={styles.linePayment}>
                                <p style={{ flex: 1 }}>{`Tổng tiền: ${formatCurrency(tongTien || 0)}`}</p>
                                <div style={{ display: 'flex', flex: 1, fontWeight: 700 }}>
                                    <p >{'Khách cần trả:'}</p>
                                    <p style={{ color: 'blue', marginLeft: 5 }}>{formatCurrency(tongTien || 0)}</p>
                                </div>
                            </div>
                            <div className={styles.linePayment}>
                                <p style={{ flex: 1 }}>{`Giảm giá: 0`}</p>
                                <div style={{ display: 'flex', flex: 1 }}>
                                    <p >{'Khách thanh toán:'}</p>
                                    <input type="number" className={styles.change} value={tienKhachTra} onChange={e => {
                                        const tienTra = e.target.value;
                                        setTienKhachTra(tienTra)
                                        setTienThua(tienTra - tongTien)
                                    }} />
                                </div>
                            </div>
                            <div className={styles.linePayment}>
                                <div style={{ display: 'flex', flex: 1 }}>
                                    <p >{'Tiền thừa:'}</p>
                                    <p style={{ fontWeight: 700, marginLeft: 5 }}>{formatCurrency(tienThua || 0)}</p>
                                </div>
                                <div style={{ flex: 1, justifyContent: 'center' }}>
                                    <button className={styles.btnThanhToan} onClick={createOrder}>
                                        <img src="/image/50-dollar.png" style={{ width: 24 }} />
                                        Thanh Toán
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Order
