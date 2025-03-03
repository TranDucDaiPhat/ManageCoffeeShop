import { useState } from "react";
import clsx from "clsx";
import { Sidebar } from "../../components";
import styles from "./Order.module.css"

const types = ['Tất cả', 'Classic Cocktails', 'Bánh Ngọt']

function Order() {
    const [openSidebar, setOpenSidebar] = useState(false);
    const [currentType, setCurrentType] = useState(types[0]);
    return (
        <div>
            <div className={styles.header}>
                <button
                    className={styles.toggleButton}
                    onClick={() => setOpenSidebar(!openSidebar)}
                >☰</button>
                {openSidebar ? <Sidebar openSidebar onOpenSidebar={setOpenSidebar} /> : <></>}

                <h3 className={styles.title}>The Study Coffee</h3>
            </div>

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
                        <div className="typeOrder">
                            {types.map((type, index) => {
                                return <button
                                    className={clsx(styles.btnType, {
                                        [styles.activeType]: currentType == type
                                    })}
                                    key={index}
                                    onClick={() => setCurrentType(type)}
                                >{type}</button>
                            })}
                        </div>
                    </div>
                </div>
                <div className={styles.contentOrder}>
                    <div className={styles.headForm}>
                        <div className={styles.describe}>Hoá Đơn</div>
                        <button className={styles.buttonAddOrder}>
                            <img src="/image/24-plus.png" width={25} />
                        </button>
                    </div>

                    <div className={styles.mainMenu}>

                    </div>
                </div>
            </div>

        </div>
    );
}

export default Order
