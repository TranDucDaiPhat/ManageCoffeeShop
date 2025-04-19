
export async function getMons() {
    const token = "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJzdHVkeWNvZmZlZXNob3AuY29tIiwic3ViIjoiYWRtaW4iLCJlbXBsb3llZUlkIjoxLCJleHAiOjE3NDUwOTM1MzQsImlhdCI6MTc0NTA4OTkzNCwic2NvcGUiOiJBRE1JTiJ9.y3bk2xOTAGwReirHXiE41MG8xn85q-3OK48uR839QWtVbPx7d8rAM7sUECiZad1MfQei4g_38mjuTN16eqh9OA";
    
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
    const token = "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJzdHVkeWNvZmZlZXNob3AuY29tIiwic3ViIjoiYWRtaW4iLCJlbXBsb3llZUlkIjoxLCJleHAiOjE3NDUwOTM1MzQsImlhdCI6MTc0NTA4OTkzNCwic2NvcGUiOiJBRE1JTiJ9.y3bk2xOTAGwReirHXiE41MG8xn85q-3OK48uR839QWtVbPx7d8rAM7sUECiZad1MfQei4g_38mjuTN16eqh9OA";
  
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
  