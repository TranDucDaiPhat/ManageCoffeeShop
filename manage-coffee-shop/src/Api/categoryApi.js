const authToken = "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJzdHVkeWNvZmZlZXNob3AuY29tIiwic3ViIjoiYWRtaW4iLCJlbXBsb3llZUlkIjoxLCJleHAiOjE3NDUzMjE0NzcsImlhdCI6MTc0NTMxNzg3Nywic2NvcGUiOiJBRE1JTiJ9.MPRi5ZIKI0BEo6J5okZA8uDoIeszGfrQeDwyO2dD70_9iA_pVzI6jE3LChIujonSsSBkXVRdU7lZsQhRs8d_sw";

export async function getCategories() {
    const response = await fetch("http://localhost:8081/myapp/api/business/categories", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  
    if (!response.ok) {
      throw new Error("Không thể lấy dữ liệu món ăn");
    }
    
    
    return response.json();
  }