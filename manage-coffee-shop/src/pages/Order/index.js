import { useState, useEffect } from "react";
import clsx from "clsx";
import { VariableSizeGrid as Grid } from "react-window";
import { Sidebar } from "../../components";
import styles from "./Order.module.css"
import { items } from "../../ExampleData/MonAn";

const types = ['Tất cả', 'Classic Cocktails', 'Trà', 'Bánh Ngọt', 'Cà Phê']

const formatCurrency = (amount, locale = "vi-VN", currency = "VND") => {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
    }).format(amount);
};

function Order() {
    const [openSidebar, setOpenSidebar] = useState(false);
    const [currentType, setCurrentType] = useState(types[0]);
    const [currentListItem, setCurrentListItem] = useState(items);
    const [orderItems, setOrderItems] = useState([]);
    const [tongTien, setTongTien] = useState(0);
    const [tienKhachTra, setTienKhachTra] = useState();
    const [tienThua, setTienThua] = useState();

    useEffect(() => {
        const tongTien = TinhTongTien()
        setTongTien(tongTien)
        if (tienKhachTra) {
            setTienThua(tienKhachTra - tongTien)
        }
    }, [orderItems])

    function handleAddItemToOrder(item) {
        const newOrderItems = [...orderItems, {
            item,
            soLuong: 1,
            tong: item.donGia
        }];
        setOrderItems(newOrderItems)
    }

    const Item = ({ columnIndex, rowIndex, style }) => {
        const index = rowIndex * 2 + columnIndex;
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

    const OrderItem = ({ orderItem, index }) => {
        return (
            <div className={styles.orderItem}>
                <p style={{ flex: 5 }}>{`${index + 1}.  ${orderItem.item.tenMon}`}</p>

                <div style={{ display: 'flex', flex: 3, flexDirection: 'row', alignItems: 'center' }}>
                    <button className={styles.buttonIcon} onClick={() => handleChangeQuantity(index, -1)}>
                        <img src="/image/24-minus.png" />
                    </button>
                    <p>{orderItem.soLuong}</p>
                    <button className={styles.buttonIcon} onClick={() => handleChangeQuantity(index, 1)}>
                        <img src="/image/24-plus.png" />
                    </button>
                </div>

                <p style={{ flex: 3 }}>{orderItem.item.donGia}</p>

                <p style={{ flex: 2 }}>{orderItem.tong}</p>

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
            newOrderItems[index] = { ...newOrderItems[index], soLuong: quantity, tong: newOrderItems[index].item.donGia * quantity };
            setOrderItems(newOrderItems);
        }
    }

    function deleteOrderItem(index) {
        setOrderItems(orderItems.filter((ỉtem, i) => i !== index));
    }

    function TinhTongTien() {
        return orderItems.reduce((init, current) => {
            return init + current.tong
        }, 0)
    }

    return (
        <div>
            <button
                className={styles.toggleButton}
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
                        <div style={{ marginBottom: 5 }}>
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
                            columnCount={2}
                            rowCount={Math.ceil(currentListItem.length / 2)}
                            columnWidth={() => 250} // Chiều rộng mỗi cột
                            rowHeight={() => 240} // Chiều cao mỗi hàng
                            width={540} // Tổng chiều rộng
                            height={390} // Tổng chiều cao
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

                        <div style={{ maxHeight: '240px', overflowY: 'auto', marginRight: '-10px' }}>
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
                                    <button className={styles.btnThanhToan}>
                                        <img src="/image/50-dollar.png" style={{ width: 24 }} />
                                        Thanh Toán
                                    </button>
                                </div>
                            </div>
                            <div style={{ display: 'flex' }}></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Order
