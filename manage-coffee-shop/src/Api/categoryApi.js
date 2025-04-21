const authToken = "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJzdHVkeWNvZmZlZXNob3AuY29tIiwic3ViIjoiYWRtaW4iLCJlbXBsb3llZUlkIjoxLCJleHAiOjE3NDUyNDM0MDAsImlhdCI6MTc0NTIzOTgwMCwic2NvcGUiOiJBRE1JTiJ9.E7h9X5WXc1idn6EFtFLRTK2mj9--mGd3U3CVVvgRBVvAB4RhPAzwLyvCPvGEe2euHIeVNDvZCSVqngOL9dCZAA";

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