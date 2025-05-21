const API = 'http://localhost:8081/myapp/api/business/cart';

export const getCartById = async (customerId) => {
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
        console.log("Không tìm thấy access token!");
        return;
    }
    try {
        const res = await fetch(`${API}/${customerId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            credentials: "include",
        });

        if (!res.ok) {
            throw new Error("Response not OK");
        }

        const data = await res.json();
        console.log("Get Cart:", data);

        return data
    } catch (err) {
        console.error(err);
    }
}

export const addProductToCart = async (customerId, items) => {
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
        console.log("Không tìm thấy access token!");
        throw new Error("Không có access token");
    }

    try {
        const res = await fetch(`${API}/${customerId}/items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            credentials: "include",
            body: JSON.stringify(items)
        });

        if (!res.ok) {
            console.error("Lỗi từ API:", res);
            throw new Error(res.message || "Thêm sản phẩm thất bại");
        }

        const data = await res.json();
        console.log("add Cart:", data);
        return data;
    } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        throw err;
    }
};

export const deleteItemFromCart = async (customerId, cartItemId) => {
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
        console.log("Không tìm thấy access token!");
        throw new Error("Không có access token");
    }

    try {
        const res = await fetch(`${API}/${customerId}/items/${cartItemId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            credentials: "include",
        });

        if (!res.ok) {
            console.error("Lỗi từ API:", res);
            throw new Error(res.message || "Thêm sản phẩm thất bại");
        }

        const data = await res.json();
        console.log("delete Cart:", data);
        return data;
    } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        throw err;
    }
};