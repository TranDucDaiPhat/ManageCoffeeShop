import { toast } from "react-toastify";

const API = 'http://localhost:8081/myapp/api/business/categories';

export const fetchCategories = async () => {
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
        console.log("Categories:", data);

        return data
    } catch (err) {
        console.error(err);
        toast.error("Lỗi!!");
    }
}