const authToken = "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJzdHVkeWNvZmZlZXNob3AuY29tIiwic3ViIjoiYWRtaW4iLCJlbXBsb3llZUlkIjoxLCJleHAiOjE3NDUxMDQ2NTgsImlhdCI6MTc0NTEwMTA1OCwic2NvcGUiOiJBRE1JTiJ9.UJTGipu4TAKpBE63bHzY1Xv_8H_UtR-6jgSNHb-6QxM4mMfkhGBIJLKcC6_JzHM3WrF_lmoUW3OAZGsDjV1wVg";

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