import axios from "axios";

// // Hàm lấy token từ localStorage (hoặc nơi bạn đang lưu)
// const getToken = () => {
//   return localStorage.getItem("token"); // hoặc sessionStorage, tùy app bạn
// };

// Hàm gọi API để lấy danh sách category
// export const getCategories = async () => {
// const token = "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJzdHVkeWNvZmZlZXNob3AuY29tIiwic3ViIjoiYWRtaW4iLCJleHAiOjE3NDQyMTM0NDksImlhdCI6MTc0NDIwOTg0OSwic2NvcGUiOiJBRE1JTiJ9.1HRaWhGAxTOu52Dg4ADHHVmIwaOrwu4UDp6eh0-_ejAmyJP8KmSDPs-hbrTBkpB7BLJYR0tta4denjRj2IxENA";
//   try {
//     const response = await fetch("http://localhost:8081/myapp/api/business/categories", {
//       headers: {
//         Authorization: `Bearer ${token}`
//       },
//     });

//     if (!response.ok) {
//         throw new Error("Không thể lấy dữ liệu món ăn");
//       }
      
      
//       return response.json();
//     }
    
    
export async function getCategories() {
    const token = "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJzdHVkeWNvZmZlZXNob3AuY29tIiwic3ViIjoiYWRtaW4iLCJlbXBsb3llZUlkIjoxLCJleHAiOjE3NDUwOTM1MzQsImlhdCI6MTc0NTA4OTkzNCwic2NvcGUiOiJBRE1JTiJ9.y3bk2xOTAGwReirHXiE41MG8xn85q-3OK48uR839QWtVbPx7d8rAM7sUECiZad1MfQei4g_38mjuTN16eqh9OA";
    
    const response = await fetch("http://localhost:8081/myapp/api/business/categories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error("Không thể lấy dữ liệu món ăn");
    }
    
    
    return response.json();
  }