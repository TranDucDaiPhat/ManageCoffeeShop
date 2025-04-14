import { memo } from 'react'
import styles from './OrderList.module.css'

function OrderList({orderItems, onChangeQuantity, onDeleteOrderItem}) {
    
    // Chi tiết hoá đơn
    const OrderItem = ({ orderItem, index }) => {
        return (
            <div className={styles.orderItem}>
                <p style={{ flex: 5 }}>{`${index + 1}.  ${orderItem.productName}`}</p>

                <div style={{ display: 'flex', flex: 3, flexDirection: 'row', alignItems: 'center' }}>
                    <button className={styles.buttonIcon} onClick={() => onChangeQuantity(index, -1)}>
                        <img src="/image/24-minus.png" />
                    </button>
                    <p>{orderItem.quantity}</p>
                    <button className={styles.buttonIcon} onClick={() => onChangeQuantity(index, 1)}>
                        <img src="/image/24-plus.png" />
                    </button>
                </div>

                <p style={{ flex: 3 }}>{orderItem.productPrice}</p>

                <p style={{ flex: 2 }}>{orderItem.productPrice * orderItem.quantity}</p>

                <button className={styles.buttonIcon} onClick={() => onDeleteOrderItem(index)}>
                    {"✖"}
                </button>
            </div>
        )
    }

    return (
        <>
            {orderItems.map((orderItem, index) => {
                return <OrderItem key={orderItem.productId} orderItem={orderItem} index={index} />
            })}
        </>
    );
}

export default memo(OrderList);