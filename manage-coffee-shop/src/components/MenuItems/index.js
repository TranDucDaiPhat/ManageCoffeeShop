import { VariableSizeGrid as Grid } from "react-window";
import { memo } from "react";
import styles from "./MenuItems.module.css"

function MenuItems({columns, list, gridWidth, onAddItems, formated}) {
    // Sản phẩm
    const Item = ({ columnIndex, rowIndex, style }) => {
        const index = rowIndex * columns + columnIndex;
        const item = list[index]
        if (item) {
            return (
                <div style={{ ...style, display: "flex", justifyContent: "center", alignItems: "center", cursor: 'pointer' }} onClick={() => onAddItems(item)}>
                    <div className={styles.itemWrapper}>
                        <img src={item.productImg || '\\image\\no-image.jpg'} height={145} width={120} style={{ objectFit: "cover" }} />
                        <div className={styles.itemInfo}>
                            <p style={{ fontWeight: 700 }}>{item.productName}</p>
                            <p>{formated(item.productPrice)}</p>
                        </div>
                    </div>
                </div>
            )
        }
    };

    return (
        <Grid
            columnCount={columns}
            rowCount={Math.ceil(list.length / columns)}
            columnWidth={() => gridWidth / columns - 30} // Chiều rộng mỗi cột
            rowHeight={() => 240} // Chiều cao mỗi hàng
            width={gridWidth} // Tổng chiều rộng
            height={Math.min(600, window.innerHeight * 0.78)} // Tổng chiều cao
        >
            {Item}
        </Grid>
    );
}

export default memo(MenuItems);