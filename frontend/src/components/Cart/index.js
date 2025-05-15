import styles from "./Cart.module.css"
import { useAuth } from "../../AuthContext";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

function Cart() {
    const { role } = useAuth();
    const navigate = useNavigate()

    function handleClickCart() {
        if (role == null) {
            toast.success('Vui lòng đăng nhập để xem giỏ hàng')
            navigate('/login')
        } else if (role == 'CUSTOMER') {
            navigate('/gio-hang')
        }
    }

    return (
        <div>
            <button className={styles.btnCart}
                onClick={() => handleClickCart()}
            >
                <img src="image/48-Cart.png" alt="Cart" style={{width:33}}/>
            </button>
        </div>
    )
}


export default Cart