import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import clsx from "clsx";
import axios from "axios";
import { toast } from "react-toastify";
import { Sidebar, MenuItems, OrderList } from "../../components";
import { useAuth } from "../../AuthContext";
import { createOrder, findCustomerByPhone, fetchProducts, fetchCategories } from "../../API"
import styles from "./Order.module.css"

const formatCurrency = (amount, locale = "vi-VN", currency = "VND") => {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
    }).format(amount);
};

function Order() {
    const [items, setItems] = useState([]);  // Danh sách món lấy từ API
    const [categories, setCategories] = useState([])
    const [openSidebar, setOpenSidebar] = useState(false);  // Trạng thái tắt/mở sidebar
    const [currentType, setCurrentType] = useState({ categoryId: 0, categoryName: 'Tất cả' });  // Loại món hiện tại
    const [currentListItem, setCurrentListItem] = useState([]); // Danh sách món lọc theo loại món
    const [orderItems, setOrderItems] = useState([]); // Danh sách các sản phẩm trong hoá đơn
    const [tienKhachTra, setTienKhachTra] = useState('');  // Số tiền khách trả
    const [tienThua, setTienThua] = useState(0);  // Số tiền thừa
    const [phone, setPhone] = useState('');  // lưu input số điện thoại của KH
    const [customer, setCustomer] = useState(null);  // lưu thông tin khách hàng nếu có

    const [gridWidth, setGridWidth] = useState(window.innerWidth * 0.46);  // Tính chiều rộng của màn hình để set chiều rộng cho danh sách món
    const [columns, setColumns] = useState(window.innerWidth * 0.44 < 600 ? 2 : 3);  // Tính số cột dựa theo chiều rộng của màn hình

    const menuOrderRef = useRef(null);  // Lưu địa chỉ của danh sách hoá đơn (để tự động cuộn xuống khi thêm 1 sản phẩm)
    const prevLengthMenu = useRef(items.length);  // Lưu số lượng sản phẩm trong menu (chỉ cuộn khi số lượng tăng)
    const [searchText, setSearchText] = useState(null);  // input tìm kiếm
    const { employeeId, role, orderOnlineIdsRef } = useAuth();
    const [orderOnline, setOderOnline] = useState([])
    const orderOnlineRef = useRef(orderOnline);

    // Lấy danh sách món từ API
    useEffect(() => {
        const getProducts = async () => {
            const data = await fetchProducts();
            setItems(data)
            setCurrentListItem(data)
        };
        const getCategories = async () => {
            const data = await fetchCategories();
            data.unshift({ categoryId: 0, categoryName: 'Tất cả' })
            setCategories(data)
        };
        getCategories();
        getProducts();
    }, []);

    useEffect(() => {
        orderOnlineRef.current = orderOnline;
    }, [orderOnline]);


    // Khi cửa sổ thay đổi, tính toán lại cột (tối đa 3, tối thiểu 2)
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

    // Khi thêm sản phẩm vào hoá đơn, tự động cuộn xuống
    useEffect(() => {
        if (menuOrderRef.current) {
            if (orderItems.length > prevLengthMenu.current) {
                menuOrderRef.current.scrollTop = menuOrderRef.current.scrollHeight;
            }
            prevLengthMenu.current = orderItems.length;
        }
    }, [orderItems.length]);

    // Tính tổng tiền, tiền thừa khi danh sách sản phẩm thay đổi
    const orderTotal = useMemo(() =>
        orderItems.reduce((sum, item) => sum + item.quantity * item.productPrice, 0),
        [orderItems]
    );

    useEffect(() => {
        setTienThua(tienKhachTra - orderTotal);
    }, [tienKhachTra, orderTotal]);

    // Thêm sản phẩm vào hoá đơn
    const handleAddItemToOrder = useCallback((item) => {
        setOrderItems(prevOrderItems => {
            return prevOrderItems.some(o => o.productName === item.productName)
                ? prevOrderItems.map(o =>
                    o.productName === item.productName ? { ...o, quantity: o.quantity + 1 } : o
                )
                : [...prevOrderItems, { ...item, quantity: 1 }];
        });
    }, []);


    // Thay đổi loại sản phẩm và lọc danh sách sản phẩm theo loại
    function handleChangeType(type) {
        setCurrentType(type)
        if (type.categoryName == 'Tất cả') {
            setCurrentListItem(items)
        } else {
            const newItems = items.filter(item => item.categoryId == type.categoryId)
            setCurrentListItem(newItems)
        }
    }

    // Tạo hoá đơn và gửi API lưu vào CSDL
    async function handleCreateOrder() {
        // nếu chưa có sản phẩm trong hoá đơn thì không làm gì cả
        if (orderItems.length <= 0) {
            return;
        }
        // Nếu chưa nhập số tiền của khách thì báo lỗi
        if (tienKhachTra + ''.trim().length == 0) {
            toast.error("Chưa nhập số tiền của khách")
            return;
        }
        // Nếu tiền thừa < 0 thì báo lỗi
        if (parseFloat(tienThua) < 0) {
            toast.error("Khách trả chưa đủ tiền")
            return;
        }
        const orderDetails = orderItems.map(item => {
            return {
                productId: item.productId,
                productQuantity: item.quantity,
                subTotal: item.quantity * item.productPrice
            }
        })

        let date = ''
        const vndate = new Date();
        vndate.setHours(vndate.getHours() + 7); // Cộng 7 giờ theo giờ VN
        date = vndate.toISOString().split('T')[0];

        const order = {
            customerId: customer ? customer.customerId : null,
            employeeId: employeeId,
            orderDate: date,
            orderTotal: orderTotal,
            paymentMethod: 'Tiền mặt',
            orderDetails: orderDetails
        }
        console.log("Create Order: ", order)
        createOrder(order)
    }

    // Xử lý người người dùng nhập số điện thoại và nhấn Enter
    const handleKeyUp = (event) => {
        if (event.key === "Enter") {
            handleFindCustomer()
        }
    };

    const handleFindCustomer = async () => {
        const text = phone.trim()
        if (text.length != 10) {
            toast.error("Vui lòng nhập đúng số điện thoại")
            setCustomer(null);
            return;
        }
        const data = await findCustomerByPhone(text)
        if (data) {
            setCustomer(data);
        } else {
            setCustomer(null);
            toast.error("Không tìm thấy khách hàng");
        }
    }

    // Thay đổi số lượng sản phẩm trên từng chi tiết hoá đơn
    const handleChangeQuantity = useCallback((index, value) => {
        setOrderItems(prevOrderItems => {
            const quantity = prevOrderItems[index].quantity + value
            if (quantity > 0) {
                const newOrderItems = [...prevOrderItems];
                newOrderItems[index] = { ...prevOrderItems[index], quantity: quantity };
                return newOrderItems
            }
        })
    }, [])

    // Xoá một sản phẩm khỏi hoá đơn
    const deleteOrderItem = useCallback((index) => {
        setOrderItems(prevOrderItems => {
            return prevOrderItems.filter((ỉtem, i) => i !== index)
        })
    }, [])

    // Lọc sản phẩm theo loại và theo nội dung tìm kiếm
    const finalFilteredProducts = useMemo(() => {
        return searchText
            ? currentListItem.filter((p) =>
                p.productName.toLowerCase().includes(searchText.toLowerCase())
            )
            : currentListItem;
    }, [searchText, currentListItem]);


    // kiểm tra có đơn hàng mới không
    const handleCheckOrderOnline = (data) => {
        // const existingIds = orderOnlineRef.current.map(order => order.orderOnlID);
        console.log('orderOnlineIdsRef:', orderOnlineIdsRef);


        const newOrders = data.filter(order => !orderOnlineIdsRef.current.includes(order.orderOnlID));
        console.log('newOrders:', newOrders.length);

        if (newOrders.length > 0) {
            console.log("Có đơn hàng mới:", newOrders);
            toast.info(`Có ${newOrders.length} đơn đặt hàng mới`);
            setOderOnline(data);
            orderOnlineIdsRef.current = data.map(order => order.orderOnlID)
        }
    };

    useEffect(() => {
        if (!role) return;

        const token = sessionStorage.getItem("accessToken");

        if (!token) {
            console.log("Không tìm thấy access token!");
            return;
        }

        const interval = setInterval(() => {

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
                    handleCheckOrderOnline(data)
                })
                .catch(error => {
                    // console.error("Lỗi kiểm tra thanh toán", error);
                    console.log('Tìm đơn hàng mới...')
                });
        }, 5000);

        return () => clearInterval(interval);
    }, [role]);

    return (
        <div style={{ padding: 12 }}>
            {/* nút ẩn hiện side bar */}
            <button
                className="toggleButtonSidebar"
                onClick={() => setOpenSidebar(!openSidebar)}
            >☰</button>
            {openSidebar ? <Sidebar openSidebar onOpenSidebar={setOpenSidebar} /> : <></>}

            <div className={styles.content}>
                {/* Danh sách sản phẩm */}
                <div className={styles.contentMenu}>
                    <div className={styles.headForm}>
                        <div className={styles.describe}>Thực đơn</div>

                        <div className={styles.searchInput}>
                            <img src="/image/16-search-icon.png" alt="Search" width={18} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                style={{ fontSize: '1.2vw' }}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={styles.mainMenu}>
                        <div>
                            {categories.map((category) => {
                                return <button
                                    className={clsx(styles.btnType, {
                                        [styles.activeType]: currentType.categoryName == category.categoryName
                                    })}
                                    key={category.categoryId}
                                    onClick={() => handleChangeType(category)}
                                >{category.categoryName}</button>
                            })}
                        </div>

                        {/* Danh sách sản phẩm */}
                        <MenuItems
                            columns={columns}
                            list={finalFilteredProducts}
                            gridWidth={gridWidth}
                            onAddItems={handleAddItemToOrder}
                            formated={formatCurrency}
                        />
                    </div>
                </div>

                {/* Danh sách chi tiết hoá đơn */}
                <div className={styles.contentOrder}>
                    <div className={styles.headForm} style={{ justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex' }}>
                            <div className={styles.describe}>Hoá Đơn</div>
                            <button className={styles.buttonIcon}>
                                <img src="/image/24-plus.png" width={25} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ color: 'gray' }}>{customer ? customer.customerName : ''}</span>
                            <div className={styles.searchInput} style={{ width: '25vh' }}>
                                <input
                                    type="number"
                                    value={phone}
                                    placeholder="SDT khách hàng"
                                    onChange={e => setPhone(e.target.value)}
                                    onKeyUp={handleKeyUp}
                                    style={{ fontSize: '1.2vw' }}
                                />
                            </div>
                            <button className={styles.btnSearchCustomer} onClick={handleFindCustomer}>
                                <img src="/image/16-search-icon.png" width={18} />
                            </button>
                        </div>
                    </div>

                    <div className={styles.mainMenu} style={{ position: 'relative' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', margin: 5, fontSize: 14 }}>
                            <p style={{ flex: 5 }}>Tên sản phẩm</p>
                            <p style={{ flex: 3 }}>Số lượng</p>
                            <p style={{ flex: 3 }}>Đơn giá</p>
                            <p style={{ flex: 3 }}>Tổng</p>
                        </div>

                        <div ref={menuOrderRef} style={{ maxHeight: '47vh', overflowY: 'scroll' }}>
                            <OrderList orderItems={orderItems} onChangeQuantity={handleChangeQuantity} onDeleteOrderItem={deleteOrderItem} />
                        </div>

                        {/* Thông tin thanh toán */}
                        <div className={styles.payment}>
                            <div className={styles.linePayment}>
                                <span style={{ flex: 1 }}>{`Tổng tiền: ${formatCurrency(orderTotal || 0)}`}</span>
                                <div style={{ display: 'flex', flex: 1, fontWeight: 700 }}>
                                    <span >{'Khách cần trả:'}</span>
                                    <span style={{ color: 'blue', marginLeft: 5 }}>{formatCurrency(orderTotal || 0)}</span>
                                </div>
                            </div>
                            <div className={styles.linePayment}>
                                <span style={{ flex: 1 }}>{`Giảm giá: 0`}</span>
                                <div style={{ display: 'flex', flex: 1 }}>
                                    <span >{'Khách thanh toán:'}</span>
                                    <input type="number" className={styles.change} value={tienKhachTra} onChange={e => {
                                        const tienTra = e.target.value;
                                        setTienKhachTra(tienTra)
                                        setTienThua(tienTra - orderTotal)
                                    }} />
                                </div>
                            </div>
                            <div className={styles.linePayment} style={{ marginTop: 10 }}>
                                <div style={{ display: 'flex', flex: 1 }}>
                                    <span>{'Tiền thừa:'}</span>
                                    <span style={{ fontWeight: 700, marginLeft: 5 }}>{formatCurrency(tienThua || 0)}</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <button className={styles.customButton} onClick={handleCreateOrder}>
                                        <img src="/image/50-dollar.png" style={{ width: 24, marginRight: 5 }} />
                                        <span>Thanh Toán</span>
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
