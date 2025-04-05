const API_URL = "http://localhost:3001";

export async function getMons(loai) {
  let url = `${API_URL}/mons`;
  if (loai) {
    url += `?loai=${encodeURIComponent(loai)}`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function getMon(id) {
  const response = await fetch(`${API_URL}/mons/${id}`);
  if (!response.ok) {
    throw new Error("Không thể lấy dữ liệu món ăn");
  }
  return response.json();
}
//
export async function createMon(mon) {
  const response = await fetch(`${API_URL}/mons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mon),
  });

  if (!response.ok) {
    throw new Error("Không thể thêm món. Vui lòng thử lại.");
  }
  return response.json();
}



// Lấy danh sách từng loại món
export async function getTraXanh() {
  return getMons("Traxanh");
}

export async function getCafe() {
  return getMons("Cafe");
}

export async function getCocktail() {
  return getMons("Cocktail");
}

export async function getTraTraiCay() {
  return getMons("Tratraicay");
}

// Cập nhật món theo ID
export async function updateMon(id, mon) {
  const response = await fetch(`${API_URL}/mons/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mon),
  });

  if (!response.ok) {
    throw new Error("Không thể cập nhật món. Vui lòng thử lại.");
  }
  return response.json();
}

// Xóa món theo ID
export async function deleteMon(id) {
  const response = await fetch(`${API_URL}/mons/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Không thể xóa món. Vui lòng thử lại.");
  }
  return response.json();
}

// Lấy danh sách món theo khoảng giá
export async function getMonsByPrice(minPrice, maxPrice) {
  let url = `${API_URL}/mons?gia_gte=${minPrice}&gia_lte=${maxPrice}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Không thể lấy danh sách món theo giá. Vui lòng thử lại.");
  }
  return response.json();
}

// Lấy danh sách món phổ biến (giả sử có thuộc tính 'luotMua' để đánh giá độ phổ biến)
export async function getPopularMons() {
  const response = await fetch(`${API_URL}/mons?_sort=luotMua&_order=desc&_limit=5`);

  if (!response.ok) {
    throw new Error("Không thể lấy danh sách món phổ biến. Vui lòng thử lại.");
  }
  return response.json();
}

// Tìm kiếm món theo tên
export async function searchMon(keyword) {
  const response = await fetch(`${API_URL}/mons?q=${encodeURIComponent(keyword)}`);

  if (!response.ok) {
    throw new Error("Không thể tìm kiếm món. Vui lòng thử lại.");
  }
  return response.json();
}
