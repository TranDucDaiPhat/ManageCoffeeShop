const authToken = "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJzdHVkeWNvZmZlZXNob3AuY29tIiwic3ViIjoiYWRtaW4iLCJlbXBsb3llZUlkIjoxLCJleHAiOjE3NDUzMjE0NzcsImlhdCI6MTc0NTMxNzg3Nywic2NvcGUiOiJBRE1JTiJ9.MPRi5ZIKI0BEo6J5okZA8uDoIeszGfrQeDwyO2dD70_9iA_pVzI6jE3LChIujonSsSBkXVRdU7lZsQhRs8d_sw";

export async function getMons() {   
    const response = await fetch("http://localhost:8081/myapp/api/business/products", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  
    if (!response.ok) {
      throw new Error("Không thể lấy dữ liệu món ăn");
    }
    
    
    return response.json();
  }
  
  export async function getMonById(id) {
   
    const response = await fetch(`http://localhost:8081/myapp/api/business/products/${id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  
    if (!response.ok) {
      throw new Error("Không thể lấy sản phẩm theo ID");
    }
  
    return response.json();
  }
  
  export async function updateMonById(id, productData) {
    
    const response = await fetch(`http://localhost:8081/myapp/api/business/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
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
   
    const response = await fetch("http://localhost:8081/myapp/api/business/products", {
      method: "POST",  // Chuyển từ PUT sang POST
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
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
 
    const response = await fetch(`http://localhost:8081/myapp/api/business/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Không thể xoá sản phẩm");
    }
  
    return await response.text(); // trả chuỗi: "Xóa sản phẩm thành công"
  }
  