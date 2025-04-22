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

export async function getMons() {   
    const token = sessionStorage.getItem("accessToken");
    const response = await fetch("http://localhost:8081/myapp/api/business/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error("Không thể lấy dữ liệu món ăn");
    }
    
    
    return response.json();
  }
  
  export async function getMonById(id) {
    const token = sessionStorage.getItem("accessToken");
   
    const response = await fetch(`http://localhost:8081/myapp/api/business/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error("Không thể lấy sản phẩm theo ID");
    }
  
    return response.json();
  }
  
  export async function updateMonById(id, productData) {
    const token = sessionStorage.getItem("accessToken");
    
    const response = await fetch(`http://localhost:8081/myapp/api/business/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
  
    if (!response.ok) {
      throw new Error("Không thể cập nhật sản phẩm");
    }
  
    return response.json();
  }
  
  // them san pham
  export async function addProduct(productData) {
    const token = sessionStorage.getItem("accessToken");
   
    const response = await fetch("http://localhost:8081/myapp/api/business/products", {
      method: "POST",  // Chuyển từ PUT sang POST
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData), // Truyền dữ liệu sản phẩm vào body
    });
  
    if (!response.ok) {
      throw new Error("Không thể thêm sản phẩm");
    }
  
    return response.json();
  }
  
  // hoan thanh 
  export async function deleteMonById(id) {
    const token = sessionStorage.getItem("accessToken");
 
    const response = await fetch(`http://localhost:8081/myapp/api/business/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Không thể xoá sản phẩm");
    }
  
    return await response.text(); // trả chuỗi: "Xóa sản phẩm thành công"
  }
  