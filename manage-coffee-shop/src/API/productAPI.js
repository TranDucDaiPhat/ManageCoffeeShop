import { toast } from "react-toastify";

export const fetchProducts = async () => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
        toast.error("Không tìm thấy access token!");
        return [];
    }

    try {
        const res = await fetch("http://localhost:8081/myapp/api/business/products", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            credentials: "include"
        });

        if (!res.ok) {
            throw new Error(`Lỗi khi lấy sản phẩm: ${res.status}`);
        }

        const products = await res.json();
        console.log("Get All Products: ", products)
        return products;
    } catch (error) {
        console.error("Lỗi khi gọi API sản phẩm:", error.message);
        toast.error("Không thể lấy danh sách sản phẩm!");
        return [];
    }
};