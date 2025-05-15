import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../AuthContext";
import { fetchProductsForCus } from "../../API"
import styles from './Cart.module.css'

const formatCurrency = (amount, locale = "vi-VN", currency = "VND") => {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
    }).format(amount);
};

function Cart() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { employeeId } = useAuth();
    const [items, setItems] = useState([]); // Danh sách món lấy từ API
    const [currentListItem, setCurrentListItem] = useState([]);
    const location = useLocation();
    const [selectedItems, setSelectedItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    // chọn tất cả sản phẩm để thanh toán
    const allSelected = selectedItems.length === currentListItem.length && currentListItem.length > 0;
    const toggleSelectAll = () => {
        if (allSelected) {
            setSelectedItems([]);
        } else {
            const allIds = currentListItem.map(item => item.productId);
            setSelectedItems(allIds);
        }
    };

    // cập nhật tổng tiền khi thêm một sản phẩm
    useEffect(() => {
        const selectedProducts = currentListItem.filter(item =>
            selectedItems.includes(item.productId)
        );

        const total = selectedProducts.reduce((sum, item) => {
            return sum + item.productPrice * item.quantity;
        }, 0);

        setTotalPrice(total);
    }, [selectedItems, currentListItem]);


    // Lấy danh sách món từ API
    useEffect(() => {
        const getProducts = async () => {
            const data = await fetchProductsForCus();
            setItems(data)
        };
        getProducts();
    }, []);

    // lấy danh sách giỏ hàng
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await fetch(`http://localhost:3001/cart/${employeeId}`);
                if (!response.ok) {
                    throw new Error('Không tìm thấy giỏ hàng');
                }
                const data = await response.json();
                console.log(data)
                setCart(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [employeeId]); // gọi lại nếu customerId thay đổi

    useEffect(() => {
        const product = location?.state?.product || null;
        if (product) {
            console.log('add product to cart:', product)
            fetch(`http://localhost:3001/cart/${employeeId}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productId: product.productId,
                    quantity: product.quantity
                })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Không thêm được sản phẩm vào giỏ hàng');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Giỏ hàng sau khi thêm sản phẩm:', data);
                    toast.success('Đã thêm vào giỏ hàng!');
                })
                .catch(error => {
                    console.error('Lỗi:', error);
                });
        }
        // if (product) {
        //     setCart(prevCart => [
        //         ...prevCart,
        //         {
        //             productName: product.productName,
        //             price: product.productPrice,
        //             count: 1,
        //             image: product.productImg
        //         }
        //     ]);
        // }
    }, []);

    // thêm tất cả sản phẩm để thanh toán
    useEffect(() => {
        if (currentListItem.length > 0) {
            const allIds = currentListItem.map(item => item.productId);
            setSelectedItems(allIds);
        }
    }, [currentListItem]);


    // lọc danh sách sản phẩm từ giỏ hàng
    useEffect(() => {
        if (items.length > 0 && cart?.items?.length > 0) {
            // Lấy danh sách id sản phẩm trong giỏ hàng
            const productIdsInCart = cart.items.map(item => item.productId);

            // Lọc ra danh sách sản phẩm tương ứng
            const matchedItems = items.filter(product =>
                productIdsInCart.includes(product.productId)
            );

            // Gán thêm thuộc tính quantity từ cart
            const itemsWithQuantity = matchedItems.map(product => {
                const cartItem = cart.items.find(item => item.productId === product.productId);
                return {
                    ...product,
                    quantity: cartItem.quantity
                };
            });
            console.log('Current List Item:', itemsWithQuantity)
            setCurrentListItem(itemsWithQuantity);
        }
    }, [items, cart]);



    const handleChangeQuantity = useCallback((delta, index) => {
        // setCart(prevCart => {
        //     const updatedCart = [...prevCart];
        //     const newCount = updatedCart[index].count + delta;
        //     updatedCart[index].count = newCount > 0 ? newCount : 1; // Không cho nhỏ hơn 1
        //     console.log('Updated Cart:', updatedCart);
        //     return updatedCart;
        // });
    }, []);

    if (loading) return <p>Đang tải giỏ hàng...</p>;
    if (error) return <p>Lỗi: {error}</p>;

    function renderCartItem(p, index) {
        const isSelected = selectedItems.includes(p.productId); // hoặc index

        const toggleSelect = () => {
            setSelectedItems(prev =>
                isSelected
                    ? prev.filter(id => id !== p.productId)
                    : [...prev, p.productId]
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
                            <p>{p.productPrice}</p>
                            <div style={{ display: 'flex', marginLeft: 15 }}>
                                <button
                                    className={styles.customButton}
                                    style={{ fontSize: 21, height: 27, marginRight: 6, width: 27, height: 27 }}
                                    onClick={() => handleChangeQuantity(-1, index)}
                                >-</button>
                                <h3>{p.quantity}</h3>
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
                        >
                            <img src='image/32-trash.png' style={{ width: 27 }} />
                        </button>
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
                            <input type="text" name="address" placeholder="Nhập địa chỉ" required />
                        </div>

                        <div>
                            <label>Người nhận:</label>
                            <input type="text" name="recipient" placeholder="Nhập tên người nhận" required />
                        </div>

                        <div>
                            <label>Số điện thoại:</label>
                            <input type="tel" name="phone" placeholder="Nhập số điện thoại" required />
                        </div>
                    </form>
                </div>

                <div className={styles.content}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className={styles.titleText} style={{ padding: 15 }}>{`Giỏ hàng của bạn (${currentListItem.length} món)`}</span>
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
                    {currentListItem.map((c, index) => renderCartItem(c, index))}

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

                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom:15 }}>
                        <button className={styles.btnThanhToan}><span>Tiến Hành Thanh Toán</span></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart