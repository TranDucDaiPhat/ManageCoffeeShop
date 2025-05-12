import React, { useState, useEffect } from "react";
import { Select, Input, Button, Row, Col, Card, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./Menu.css";

const { Option } = Select;

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const token = sessionStorage.getItem("accessToken");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const [productRes, categoryRes] = await Promise.all([
          fetch("http://localhost:8081/myapp/api/business/products", {
            headers,
          }),
          fetch("http://localhost:8081/myapp/api/business/categories", {
            headers,
          }),
        ]);

        if (!productRes.ok || !categoryRes.ok) {
          throw new Error("Không thể lấy dữ liệu");
        }

        const [productData, categoryData] = await Promise.all([
          productRes.json(),
          categoryRes.json(),
        ]);

        setProducts(productData);
        setCategories(categoryData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const loadMoreProducts = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory
      ? product.categoryId === parseInt(selectedCategory)
      : true;
    const matchesSearch = product.productName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="home-container">
      <section className="products-section">
        <h2 className="category-title">MENU SẢN PHẨM</h2>

        {/* Bộ lọc và tìm kiếm */}
        <Row gutter={[16, 16]} justify="center" className="filter-bar">
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Chọn danh mục"
              value={selectedCategory || undefined}
              onChange={(value) => setSelectedCategory(value)}
              style={{ width: "100%" }}
              allowClear
            >
              {categories.map((category) => (
                <Option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<SearchOutlined />}
            />
          </Col>
        </Row>

        {/* Loading */}
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Hiển thị sản phẩm */}
            <Row gutter={[16, 16]} style={{ marginTop: "30px" }}>
              {filteredProducts.slice(0, visibleCount).map((product) => (
                <Col key={product.productId} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    cover={
                      <img alt={product.productName} src={product.productImg} />
                    }
                  >
                    <Card.Meta
                      title={product.productName}
                      description={`Giá: ${product.productPrice.toLocaleString()} VND`}
                    />
                    <Button type="primary" block style={{ marginTop: "10px" }}>
                      Đặt mua
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Nút Load More */}
            {visibleCount < filteredProducts.length && (
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Button type="primary" onClick={loadMoreProducts}>
                  Xem thêm
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Menu;
