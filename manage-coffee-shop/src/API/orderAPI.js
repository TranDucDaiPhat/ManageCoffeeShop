import { toast } from "react-toastify";

const API = 'http://localhost:8081/myapp/api/business/order';

export const createOrder = async (order) => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
        toast.error("Không tìm thấy access token!");
        return;
    }
    try {
        const res = await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            credentials: "include",
            body: JSON.stringify(order)
        });

        if (!res.ok) {
            toast.error("Thanh toán thất bại")
            throw new Error(`Lỗi khi thanh toán: ${res.status}`);
        } else {
            toast.success("Thanh toán thành công")
        }
    } catch (error) {
        throw error;
    }
}

export const getOrdersByDate = async (date, setOrders) => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
        toast.error("Không tìm thấy access token!");
        return;
    }
    try {
        let ApiByRole = API;
        // Nếu là quản lý thì có thể lấy order theo ngày
        // Nếu là nhân viên thì chỉ được lấy này hiện tại
        if (date == 'today') {
            ApiByRole += '/date/today'
        } else {
            ApiByRole += `/date?date=${date}`
        }
        const res = await fetch(ApiByRole, {
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
        console.log("Orders by date:", data);

        if (data) {
            setOrders(data)
        }
    } catch (err) {
        console.error(err);
        toast.error("Lỗi!!");
    }
}