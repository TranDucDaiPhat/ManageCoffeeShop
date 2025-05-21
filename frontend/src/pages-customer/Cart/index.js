import { useState, useEffect, useCallback } from 'react'
import { toast } from "react-toastify";
import { useAuth } from "../../AuthContext";
import { getCartById, deleteItemFromCart } from "../../API"
import styles from './Cart.module.css'

const formatCurrency = (amount, locale = "vi-VN", currency = "VND") => {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
    }).format(amount);
};

function Cart() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPayment, setIsPayment] = useState(false);
    const { employeeId: contextId, user } = useAuth();
    const employeeId = contextId || sessionStorage.getItem("employeeId");

    // lưu tất cả sản phẩm trong giỏ hàng
    const [cart, setCart] = useState([]);
    // lưu những sản phẩm cần thanh toán
    const [selectedItemsId, setSelectedItemsId] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [userInfo, setUserInfo] = useState({
        address: user?.address || '',
        userName: user?.customerName || '',
        phone: user?.customerPhone || ''
    });
    const [selectedItems, setSelectedItems] = useState([]);
    const [paymentInfo, setPaymentInfo] = useState(null)

    useEffect(() => {
        setUserInfo({
            address: user?.address || '',
            userName: user?.customerName || '',
            phone: user?.customerPhone || ''
        })
    }, [user])

    // chọn tất cả sản phẩm để thanh toán
    const allSelected = selectedItemsId.length === cart.length && cart.length > 0;
    const toggleSelectAll = () => {
        if (allSelected) {
            setSelectedItemsId([]);
        } else {
            const allIds = cart.map(item => item.cartItemId);
            setSelectedItemsId(allIds);
        }
    };

    // Đóng popup
    const closePopup = () => {
        setIsPayment(false);
    };

    // cập nhật tổng tiền khi thêm một sản phẩm
    useEffect(() => {
        const selectedProducts = cart.filter(item =>
            selectedItemsId.includes(item.cartItemId)
        );

        const total = selectedProducts.reduce((sum, item) => {
            return sum + item.product.productPrice * item.quantity;
        }, 0);

        setTotalPrice(total);
    }, [selectedItemsId, cart]);

    // Lấy sản phẩm trong giỏ hàng
    useEffect(() => {
        const handleGetCart = async () => {
            if (employeeId) {
                const data = await getCartById(employeeId);
                setCart(data.cartItems);
                setLoading(false);
            }
        };

        handleGetCart();
    }, [employeeId]);

    // thêm tất cả sản phẩm để thanh toán
    useEffect(() => {
        if (cart.length > 0) {
            const allIds = cart.map(item => item.cartItemId);
            setSelectedItemsId(allIds);
        }
    }, [cart]);

    const handleChangeQuantity = useCallback((delta, index) => {
        // setCart(prevCart => {
        //     const updatedCart = [...prevCart];
        //     const newCount = updatedCart[index].count + delta;
        //     updatedCart[index].count = newCount > 0 ? newCount : 1; // Không cho nhỏ hơn 1
        //     console.log('Updated Cart:', updatedCart);
        //     return updatedCart;
        // });
    }, []);

    // Xoá sản phẩm khỏi giỏ hàng
    const handleDelete = async (productId) => {
        const data = await deleteItemFromCart(user.customerId, productId)
        setCart(data.cartItems)
    };


    if (loading) return <p>Đang tải giỏ hàng...</p>;
    if (error) return <p>Lỗi: {error}</p>;

    const CartItem = ({ c, index }) => {
        const p = c.product
        const isSelected = selectedItemsId.includes(c.cartItemId);

        const toggleSelect = () => {
            setSelectedItemsId(prev =>
                isSelected
                    ? prev.filter(id => id !== c.cartItemId)
                    : [...prev, c.cartItemId]
            );
        };

        return (
            <div>
                <div style={{ display: 'flex', padding: 8, alignItems: 'center' }}>
                    {/* Checkbox */}
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={toggleSelect}
                        style={{ marginRight: 12, width: 18, height: 18, cursor: 'pointer' }}
                    />

                    {/* Ảnh sản phẩm */}
                    <div className={styles.wrapperImage}>
                        <img src={p.productImg} style={{ width: 85 }} />
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div style={{ paddingLeft: 15 }}>
                        <span>{p.productName}</span>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p>{formatCurrency(p.productPrice)}</p>
                            <div style={{ display: 'flex', marginLeft: 15 }}>
                                <button
                                    className={styles.customButton}
                                    style={{ fontSize: 21, height: 27, marginRight: 6, width: 27, height: 27 }}
                                    onClick={() => handleChangeQuantity(-1, index)}
                                >-</button>
                                <h3>{c.quantity}</h3>
                                <button
                                    className={styles.customButton}
                                    style={{ fontSize: 21, height: 27, marginLeft: 6, width: 27, height: 27 }}
                                    onClick={() => handleChangeQuantity(1, index)}
                                >+</button>
                            </div>
                        </div>
                    </div>

                    {/* Nút xoá */}
                    <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                        <button
                            style={{
                                width: 33,
                                height: 33,
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleDelete(c.cartItemId)} // thêm sự kiện xoá
                        >
                            <img src='image/32-trash.png' style={{ width: 27 }} />
                        </button>
                    </div>
                </div>
                <hr className={styles.divider} />
            </div>
        );
    }

    const Payment = async (totalPrice) => {
        console.log('selectedItems:', selectedItems)
        try {
            const productsReq = selectedItems.map(item => ({
                productId: item.product.productId,
                size: item.size,
                unitPrice: item.price,
                quantity: item.quantity,
                sweet: item.sweet,
                ice: item.ice,
                listTopping: []
            }))
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const currentTime = `${hours}:${minutes}`;

            const token = sessionStorage.getItem("accessToken");

            if (!token) {
                console.log("Không tìm thấy access token!");
                return;
            }
            const dataRequest = {
                    deliveryTime: currentTime,
                    deliveryAddress: user.address,
                    noteOfCus: "",
                    totalOrd: 5000,
                    paymentMethod: 'Momo',
                    customerId: user.customerId,
                    transactionCode: '',
                    orderDetails: productsReq
                }
                console.log('dataRequest:', dataRequest)
            const res = await fetch('http://localhost:8081/myapp/api/business/sepay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                credentials: "include",
                body: JSON.stringify(dataRequest)
            });

            const data = await res.json();
            if (data && data.qrUrl) {
                setIsPayment(false)
                setPaymentInfo(data)
            } else {
                alert("Không thể tạo thanh toán.");
            }

            console.log(selectedItems)
            console.log(data)
        } catch (err) {
            console.error("Lỗi khi thanh toán:", err);
            alert("Đã xảy ra lỗi.");
        }
    }

    const handlePayment = () => {
        const listItem = cart.filter(item => selectedItemsId.includes(item.cartItemId))

        if (listItem.length <= 0) {
            toast.info('Vui lòng chọn sản phẩm để thanh toán')
        } else {
            setIsPayment(true)
            setSelectedItems(listItem)
        }
    }

    const CartItemSelected = ({ c }) => {
        const p = c.product

        return (
            <div>
                <div style={{ display: 'flex', padding: 8, alignItems: 'center' }}>

                    {/* Ảnh sản phẩm */}
                    <div className={styles.wrapperImage}>
                        <img src={p.productImg} style={{ width: 85 }} />
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div style={{ paddingLeft: 15 }}>
                        <span>{p.productName}</span>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p>{formatCurrency(p.productPrice)} </p>
                            <div style={{ display: 'flex', marginLeft: 15 }}>
                                <h3> x {c.quantity}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className={styles.divider} />
            </div>
        );
    }


    return (
        <div className={styles.container}>
            Thanh toán
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 5 }}>
                <div className={styles.content}>
                    <form style={{ padding: 25 }}>
                        <div>
                            <label>Địa chỉ:</label>
                            <input type="text" name="address" placeholder="Nhập địa chỉ" required
                                value={userInfo.address}
                                onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                            />
                        </div>

                        <div>
                            <label>Người nhận:</label>
                            <input type="text" name="recipient" placeholder="Nhập tên người nhận" required
                                value={userInfo.userName}
                                onChange={(e) => setUserInfo({ ...userInfo, userName: e.target.value })}
                            />
                        </div>

                        <div>
                            <label>Số điện thoại:</label>
                            <input type="number" name="phone" placeholder="Nhập số điện thoại" required
                                value={userInfo.phone}
                                onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                            />
                        </div>
                    </form>
                </div>

                <div className={styles.content}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className={styles.titleText} style={{ padding: 15 }}>{`Giỏ hàng của bạn (${cart.length} món)`}</span>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 12 }}>
                            <p>Chọn tất cả</p>
                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={toggleSelectAll}
                                style={{ marginLeft: 8, width: 18, height: 18, cursor: 'pointer' }}
                            />
                        </div>
                    </div>
                    <hr className={styles.divider} />
                    {cart.map((c, index) => {
                        return <CartItem key={c.cartItemId} c={c} />
                    })}

                    {/* Thông tin thanh toán */}
                    <div style={{ padding: 15 }}>
                        <span className={styles.titleText}>Thông tin thanh toán</span>
                        <div style={{ display: 'flex' }}>
                            <p style={{ marginRight: 25 }}>Tổng tiền:</p>
                            <p>{formatCurrency(totalPrice)}</p>
                        </div>
                    </div>

                    {/* Phương thức thanh toán */}
                    <div style={{ padding: 15 }}>
                        <span className={styles.titleText}>Phương thức thanh toán</span>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                            <input
                                type="radio"
                                id="momo"
                                name="paymentMethod"
                                value="MOMO"
                                defaultChecked
                                style={{ width: 18, height: 18, marginRight: 8 }}
                            />
                            <p htmlFor="momo" style={{ fontSize: 16 }}>Ví Momo</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 15 }}>
                        <button className={styles.btnThanhToan}
                            onClick={() => handlePayment()}
                        >
                            <span>{`Tiến Hành Thanh Toán (${selectedItemsId.length} món)`}</span>
                        </button>
                    </div>
                </div>
            </div>

            {isPayment && (
                <div className={styles.popup}>
                    <div className={styles.popupContent}>
                        <button className={styles.closeButton} onClick={closePopup}>✖</button>
                        <div className={styles.popupHeader}>
                            <h3 style={{ marginBottom: 5 }}>Xác nhận thanh toán</h3>
                        </div>
                        <div className={styles.popupScrollContent}>
                            <p><strong>Người nhận: </strong>{user.customerName}</p>
                            <p><strong>Địa chỉ: </strong>{user.address}</p>
                            <p><strong>Thanh toán: </strong>Ví Momo</p>
                            <p><strong>{`Tổng số tiền (${selectedItemsId.length} sản phẩm): `}</strong>{formatCurrency(totalPrice)}</p>

                            <h4 style={{ marginTop: 10 }}>Sản phẩm đã chọn:</h4>
                            {
                                selectedItems.map(item => (
                                    <CartItemSelected key={item.cartItemId} c={item} />
                                ))
                            }
                        </div>

                        <div className={styles.popupFooter}>
                            <button className={styles.payButton} onClick={() => Payment(totalPrice)} >Thanh toán</button>
                        </div>
                    </div>
                </div>
            )}

            {paymentInfo ? 
             <div className={styles.popup}>
                    <div className={styles.popupContent} style={{display:'flex', alignItems:'center'}}>
                        <button className={styles.closeButton} onClick={() => setPaymentInfo(null)}>✖</button>
                        <img src={paymentInfo.qrUrl} style={{width:275, height: 275}}/>
                    </div>
                </div> : <></>}
        </div>
    )
}

export default Cart