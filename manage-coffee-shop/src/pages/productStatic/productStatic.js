import React, { useState, useEffect } from "react";
import axios from "axios";
import { Sidebar } from "../../components";
import { toast } from "react-toastify";

const getAuthConfig = () => {
  const token = sessionStorage.getItem("accessToken");
  if (!token) {
    toast.error("Không tìm thấy access token!");
    throw new Error("Access token not found");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  };
};

const productsRes = await axios.get(
  "http://localhost:8081/myapp/api/business/products",
  getAuthConfig()
);
const ProductStatic = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [statistics, setStatistics] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minRevenue, setMinRevenue] = useState("");
  const [maxRevenue, setMaxRevenue] = useState("");
  const [sortBy, setSortBy] = useState(null); // 'sold' or 'revenue'
  const [sortOrder, setSortOrder] = useState("asc"); // or 'desc'
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalSold, setTotalSold] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const itemsPerPage = 2; // Đặt số lượng sản phẩm mỗi trang là 2
  const [products, setProducts] = useState([]); // ton kho
  const [productStats, setProductStats] = useState([]); //
  useEffect(() => {
    const fetchData = async () => {
      const [productsRes, detailsRes] = await Promise.all([
        axios.get(
          "http://localhost:8081/myapp/api/business/products",
          getAuthConfig()
        ),
        axios.get(
          "http://localhost:8081/myapp/api/business/bill-details",
          getAuthConfig()
        ),
      ]);

      const products = productsRes.data;
      const details = detailsRes.data;

      // Tính tổng số lượt mua của từng sản phẩm
      const salesMap = {};
      details.forEach((d) => {
        salesMap[d.product_id] =
          (salesMap[d.product_id] || 0) + d.product_quantity;
      });

      // Gộp dữ liệu sản phẩm + số lượt bán
      const stats = products.map((p) => ({
        ...p,
        total_sold: salesMap[p.product_id] || 0,
      }));

      // Sắp xếp theo total_sold
      const sorted = stats.sort((a, b) =>
        sortOrder === "desc"
          ? b.total_sold - a.total_sold
          : a.total_sold - b.total_sold
      );

      setProductStats(sorted);
    };

    fetchData();
  }, [sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };
  useEffect(() => {
    axios
      .get("http://localhost:8081/myapp/api/business/products", getAuthConfig())
      .then((response) => {
        setProducts(response.data);
      });
  }, []);

  const sortedProducts = [...products].sort((a, b) =>
    sortOrder === "desc"
      ? b.product_inventory_quantity - a.product_inventory_quantity
      : a.product_inventory_quantity - b.product_inventory_quantity
  );
  useEffect(() => {
    const fetchData = async () => {
      const productsRes = await axios.get(
        "http://localhost:8081/myapp/api/business/products",
        getAuthConfig()
      );
      const billDetailRes = await axios.get(
        "http://localhost:8081/myapp/api/business/bill-details",
        getAuthConfig()
      );

      const mergedStats = productsRes.data.map((product) => {
        const relatedDetails = billDetailRes.data.filter(
          (detail) => detail.product_id === product.product_id
        );

        const totalSold = relatedDetails.reduce(
          (sum, d) => sum + d.product_quantity,
          0
        );
        const totalRevenue = relatedDetails.reduce(
          (sum, d) => sum + d.sub_total,
          0
        );

        return {
          product_id: product.product_id,
          product_name: product.product_name,
          totalSold,
          totalRevenue,
        };
      });

      setStatistics(mergedStats);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const totalRev = statistics.reduce(
      (sum, item) => sum + item.totalRevenue,
      0
    );
    const totalQty = statistics.reduce((sum, item) => sum + item.totalSold, 0);
    setTotalRevenue(totalRev);
    setTotalSold(totalQty);
  }, [statistics]);

  const handleSort = (type) => {
    if (sortBy === type) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(type);
      setSortOrder("asc");
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Tên sản phẩm",
      "Số lượng đã bán",
      "Doanh thu (VND)",
    ];
    const rows = filteredStatistics.map((item) => [
      item.product_id,
      item.product_name,
      item.totalSold,
      item.totalRevenue,
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "thong_ke_san_pham.csv";
    link.click();
  };

  const filteredStatistics = statistics
    .filter((item) =>
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((item) => {
      if (minRevenue && item.totalRevenue < parseInt(minRevenue)) return false;
      if (maxRevenue && item.totalRevenue > parseInt(maxRevenue)) return false;
      return true;
    })
    .sort((a, b) => {
      if (!sortBy) return 0;
      const valueA = sortBy === "sold" ? a.totalSold : a.totalRevenue;
      const valueB = sortBy === "sold" ? b.totalSold : b.totalRevenue;
      return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
    });
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                margin: "20px 0",
              }}
            >
              <input
                type="text"
                placeholder="🔍 Tìm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  width: "200px",
                }}
              />
              <input
                type="number"
                placeholder="Doanh thu tối thiểu"
                value={minRevenue}
                onChange={(e) => setMinRevenue(e.target.value)}
                style={{
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  width: "160px",
                }}
              />
              <input
                type="number"
                placeholder="Doanh thu tối đa"
                value={maxRevenue}
                onChange={(e) => setMaxRevenue(e.target.value)}
                style={{
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  width: "160px",
                }}
              />
              <button
                onClick={handleExportCSV}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                }}
              >
                📥 Xuất CSV
              </button>
            </div>

            <table
              border="1"
              cellPadding="8"
              style={{
                borderCollapse: "collapse",
                marginTop: "10px",
                width: "100%",
                backgroundColor: "white",
              }}
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên sản phẩm</th>
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("sold")}
                  >
                    Số lượng đã bán{" "}
                    {sortBy === "sold"
                      ? sortOrder === "asc"
                        ? "⬆️"
                        : "⬇️"
                      : ""}
                  </th>
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("revenue")}
                  >
                    Doanh thu (VND){" "}
                    {sortBy === "revenue"
                      ? sortOrder === "asc"
                        ? "⬆️"
                        : "⬇️"
                      : ""}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStatistics.map((item) => (
                  <tr key={item.product_id}>
                    <td>{item.product_id}</td>
                    <td>{item.product_name}</td>
                    <td>{item.totalSold}</td>
                    <td>{item.totalRevenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: "20px" }}>
              <h3>Tổng số lượng sản phẩm đã bán: {totalSold}</h3>
              <h3>Tổng doanh thu: {totalRevenue.toLocaleString()} VND</h3>
            </div>
          </div>
        );
      case "popular":
        return (
          <div
            style={{
              padding: "20px",
              borderRadius: "12px",
              backgroundColor: "#f9f9f9",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              maxWidth: "90%",
              margin: "auto",
              marginTop: "30px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ margin: 0, color: "#333" }}>📊 Sản phẩm phổ biến</h2>
              <button
                onClick={toggleSortOrder}
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 14px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                {sortOrder === "desc" ? "⬇️ Giảm dần" : "⬆️ Tăng dần"}
              </button>
            </div>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "20px",
                fontSize: "16px",
              }}
            >
              <thead style={{ backgroundColor: "#007bff", color: "#fff" }}>
                <tr>
                  <th style={{ padding: "10px" }}>Mã SP</th>
                  <th style={{ padding: "10px" }}>Tên sản phẩm</th>
                  <th style={{ padding: "10px" }}>Đã bán</th>
                </tr>
              </thead>
              <tbody>
                {productStats.map((p) => (
                  <tr
                    key={p.product_id}
                    style={{
                      backgroundColor: "#fff",
                      borderBottom: "1px solid #ccc",
                    }}
                  >
                    <td style={{ padding: "10px", textAlign: "center" }}>
                      {p.product_id}
                    </td>
                    <td style={{ padding: "10px" }}>{p.product_name}</td>
                    <td style={{ padding: "10px", textAlign: "center" }}>
                      {p.total_sold}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "inventory":
        return (
          <div
            style={{
              padding: "20px",
              borderRadius: "12px",
              backgroundColor: "#f9f9f9",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              maxWidth: "90%",
              margin: "auto",
              marginTop: "30px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ margin: 0, color: "#333" }}>📦 Báo cáo tồn kho</h2>
              <button
                onClick={toggleSortOrder}
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                {sortOrder === "desc" ? "⬇️ Sắp xếp giảm" : "⬆️ Sắp xếp tăng"}
              </button>
            </div>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "16px",
                marginTop: "15px",
              }}
            >
              <thead style={{ backgroundColor: "#007bff", color: "#fff" }}>
                <tr>
                  <th style={{ padding: "10px" }}>Mã SP</th>
                  <th style={{ padding: "10px" }}>Tên sản phẩm</th>
                  <th style={{ padding: "10px" }}>Số lượng tồn</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map((p) => (
                  <tr
                    key={p.product_id}
                    style={{
                      backgroundColor: "#fff",
                      borderBottom: "1px solid #ccc",
                    }}
                  >
                    <td style={{ padding: "10px", textAlign: "center" }}>
                      {p.product_id}
                    </td>
                    <td style={{ padding: "10px" }}>{p.product_name}</td>
                    <td style={{ padding: "10px", textAlign: "center" }}>
                      {p.product_inventory_quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        position: "relative",
        background:
          "linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.9))",
        backdropFilter: "blur(10px)",
        boxShadow: "inset 0 0 50px rgba(0, 0, 0, 0.1)",
      }}
    >
      {openSidebar && (
        <div
          style={{
            width: "250px",
            transition: "width 0.5s ease",
            overflow: "hidden",
          }}
        >
          <Sidebar openSidebar={openSidebar} onOpenSidebar={setOpenSidebar} />
        </div>
      )}
      <div
        style={{
          width: openSidebar ? `calc(100% - 250px)` : "100%",
          transition: "width 0.5s ease",
          padding: "20px",
          backgroundColor: "#D9D9D9",
          margin: "0 auto",
          borderRadius: "15px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        {!openSidebar && (
          <button onClick={() => setOpenSidebar(true)}>☰</button>
        )}

        <div>
          <h1>📊 Thống Kê Sản Phẩm</h1>
          <div style={{ marginBottom: "20px" }}>
            <button
              onClick={() => setActiveTab("overview")}
              style={{ marginRight: "10px" }}
            >
              Tổng quan sản phẩm
            </button>
            <button
              onClick={() => setActiveTab("popular")}
              style={{ marginRight: "10px" }}
            >
              Sản phẩm phổ biến
            </button>
            <button onClick={() => setActiveTab("inventory")}>
              Báo cáo tồn kho
            </button>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ProductStatic;
