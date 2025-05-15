import { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from "react-toastify";
import { Footer } from "../../components"
import styles from "./ProductCustomer.module.css"
import { Cart } from "../../components";


const formatCurrency = (amount, locale = "vi-VN", currency = "VND") => {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
    }).format(amount);
};

function Product_Customer() {
    const location = useLocation();
    const { product } = location.state || {};
    const [productCount, setProductCount] = useState(1)
    const { role } = useAuth();
    const navigate = useNavigate()
    console.log('product:', product)

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    function handleAddToCart() {
        product.quantity = productCount;
        if (role == null) {
            toast.success('Vui lòng đăng nhập để thêm vào giỏ hàng')
            navigate('/login',{ state: { product } })
        } else {
            navigate('/gio-hang',{ state: { product } })
        }
    }

    return (
        <div>
            <Cart />

            <div style={{ display: 'flex', marginBottom: 25 }}>
                <div style={{ width: '45%', display: 'flex', justifyContent: 'flex-end', margin: 5 }}>
                    <div className={styles.itemWrapper}>
                        <img
                            src={product?.productImg}
                            alt="ảnh sản phẩm"
                            style={{
                                width: '100%',   
                                height: '100%',  
                                objectFit: 'contain'
                            }}
                        />
                    </div>
                </div>

                <div style={{ padding: 15, width: '35%' }}>
                    <h2 style={{textAlign:'center', marginBottom:15}}>Sản phẩm</h2>
                    <h2 className={styles.text} >{product?.productName}</h2>
                    <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between' }}>
                        <h2 className={styles.text} >{formatCurrency(product?.productPrice)}</h2>
                        <div style={{ display: 'flex' }} >
                            <button
                                className={styles.customButton}
                                style={{ fontSize: 21, height: 27, marginRight: 6 }}
                                onClick={() => { setProductCount(productCount - 1) }}
                            >-</button >
                            <h3>{productCount}</h3>
                            <button
                                className={styles.customButton}
                                style={{ fontSize: 21, height: 27, marginLeft: 6 }}
                                onClick={() => { setProductCount(productCount + 1) }}
                            >+</button>
                        </div>
                    </div>

                    <div style={{ marginTop: 35, display: 'flex', justifyContent: 'center' }}>
                        <button
                            className={styles.customButton}
                            style={{ fontSize: 18 }}
                            onClick={() => handleAddToCart()}
                        >{`🛒 Thêm vào giỏ hàng : ${formatCurrency(product?.productPrice * productCount)}`}
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Product_Customer