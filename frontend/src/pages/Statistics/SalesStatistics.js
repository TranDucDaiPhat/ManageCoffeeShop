import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import styles from "./SalesStatistics.module.css";
import { Sidebar } from "../../components";

Chart.register(...registerables);

const SalesStatistics = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState({ date: "", month: "", year: "" });

  useEffect(() => {
    axios
      .get("http://localhost:5000/sales")
      .then((response) => setSalesData(response.data))
      .catch((error) => console.error("Error fetching sales data:", error));

    axios
      .get("http://localhost:5000/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products data:", error));
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const filteredSalesData = salesData.filter((sale) => {
    const saleDate = new Date(sale.date);
    return (
      (!filter.date || saleDate.toISOString().split("T")[0] === filter.date) &&
      (!filter.month ||
        (saleDate.getMonth() + 1).toString() === filter.month) &&
      (!filter.year || saleDate.getFullYear().toString() === filter.year)
    );
  });

  const totalRevenue = filteredSalesData.reduce(
    (total, sale) => total + sale.revenue,
    0
  );

  const totalProductsSold = products.reduce(
    (total, product) => total + product.sales,
    0
  );

  const revenueData = {
    labels: filteredSalesData.map((sale) => sale.date),
    datasets: [
      {
        label: "Revenue",
        data: filteredSalesData.map((sale) => sale.revenue),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.toggleButton}
        onClick={() => setOpenSidebar(!openSidebar)}
      >
        ☰
      </button>
      {openSidebar ? (
        <Sidebar openSidebar onOpenSidebar={setOpenSidebar} />
      ) : null}
      <h1 className={styles.header}>Thống Kê Doanh Thu</h1>
      <div className={styles.filters}>
        <input
          type="date"
          name="date"
          value={filter.date}
          onChange={handleFilterChange}
          className={styles.inputField}
        />
        <input
          type="number"
          name="month"
          placeholder="Month"
          value={filter.month}
          onChange={handleFilterChange}
          className={styles.inputField}
        />
        <input
          type="number"
          name="year"
          placeholder="Year"
          value={filter.year}
          onChange={handleFilterChange}
          className={styles.inputField}
        />
      </div>
      <div className={styles.statistics}>
        <div className={styles.statBox}>
          <h3>Tổng Doanh Thu</h3>
          <p>{totalRevenue} VND</p>
        </div>
        <div className={styles.statBox}>
          <h3>Tổng Sản Phẩm Bán Ra</h3>
          <p>{totalProductsSold}</p>
        </div>
      </div>
      <div className={styles.charts}>
        <Bar data={revenueData} />
      </div>
      <div className={styles.products}>
        <h2>Sản Phẩm Bán Chạy</h2>
        <div className={styles.productList}>
          {products.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <img
                src={product.image}
                alt={product.name}
                className={styles.productImage}
              />
              <p>
                <strong>{product.name}</strong>
              </p>
              <p>Sales: {product.sales}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesStatistics;
