import { toast } from "react-toastify";

const API = 'http://localhost:8081/myapp/api/business/customer';

export const findCustomerByPhone = async (phone) => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
        toast.error("Không tìm thấy access token!");
        return;
    }
    try {
        const res = await fetch(`${API}/phone?phone=${phone}`, {
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
        console.log("Customer:", data);

        return data
    } catch (err) {
        console.error(err);
        return null;
        toast.error("Không tìm thấy khách hàng");
    }
}


export const fetchCustomer = async () => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
        toast.error("Không tìm thấy access token!");
        return;
    }

    try {
        const res = await fetch(API, {
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
        console.log("Customers:", data); 
        return data
    } catch (err) {
        console.error(err);
        toast.error("Không tìm thấy khách hàng");
        return []
    }
}

export const createCustomer = async (customer) => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
        toast.error("Không tìm thấy access token!");
        return;
    }
    console.log(customer)

    try {
        const res = await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            credentials: "include",
            body: JSON.stringify(customer)
        });

        if (!res.ok) {
            throw new Error("Response not OK");
        }

        const data = await res.json();
        console.log("Customers:", data); 
        return data
    } catch (err) {
        console.error(err);
        toast.error("Lỗi: ", err);
        return []
    }
}