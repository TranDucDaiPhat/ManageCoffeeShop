import React, { useState, useEffect } from "react";
import { Input, Button, Row, Col, Card, Spin, Carousel } from "antd";
import { SearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import styles from "./Menu.module.css";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();

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
          ...(token && { Authorization: `Bearer ${token}` }),
        };

        const [productRes, categoryRes] = await Promise.all([
          fetch("http://localhost:8081/myapp/api/business/products", {
            headers,
          }),
          fetch("http://localhost:8081/myapp/api/business/categories", {
            headers,
          }),
        ]);

        if (!productRes.ok || !categoryRes.ok)
          throw new Error("Lỗi khi lấy dữ liệu");

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

  const handleCategoryClick = (value) => {
    setSelectedCategory(value);
  };
  const handleClickProduct = (product) => {
    navigate("/product_customer", { state: { product } });
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
    <div className={styles.container}>
      <Carousel autoplay className={styles.carousel}>
        <div>
          <img
            src="/image/banner1.jpg"
            alt="banner1"
            className={styles.bannerImg}
          />
        </div>
        <div>
          <img
            src="image/banner2.jpg"
            alt="banner2"
            className={styles.bannerImg}
          />
        </div>
        <div>
          <img
            src="/image/banner3.jpg"
            alt="banner3"
            className={styles.bannerImg}
          />
        </div>
      </Carousel>
      <h2 className={styles.title}>MENU SẢN PHẨM</h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <div className={styles.sidebar}>
            <ul className={styles.sidebarList}>
              <li
                className={!selectedCategory ? styles.active : ""}
                onClick={() => handleCategoryClick("")}
              >
                Tất cả
              </li>
              {categories.map((cat) => (
                <li
                  key={cat.categoryId}
                  className={
                    selectedCategory === String(cat.categoryId)
                      ? styles.active
                      : ""
                  }
                  onClick={() => handleCategoryClick(String(cat.categoryId))}
                >
                  {cat.categoryName}
                </li>
              ))}
            </ul>
          </div>
        </Col>

        {/* Product List */}
        <Col xs={24} sm={18}>
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined />}
            className={styles.searchBox}
          />
          {loading ? (
            <div className={styles.loading}>
              <Spin size="large" />
            </div>
          ) : (
            <>
              <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
                {filteredProducts.slice(0, visibleCount).map((product) => (
                  <Col key={product.productId} xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable
                      className={styles.productCard}
                      cover={
                        <img
                          alt={product.productName}
                          src={product.productImg}
                          className={styles.productImage}
                          onClick={() => handleClickProduct(product)}
                        />
                      }
                      onClick={() => handleClickProduct(product)}
                    >
                      <Card.Meta
                        title={product.productName}
                        description={
                          <span className={styles.price}>
                            {product.productPrice.toLocaleString()} đ
                          </span>
                        }
                      />
                      <Button
                        icon={<ShoppingCartOutlined />}
                        block
                        className={styles.orderBtn}
                        onClick={(e) => {
                          e.stopPropagation(); // Ngăn sự kiện click lan lên Card
                          handleClickProduct(product);
                        }}
                      >
                        Đặt mua
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
              {visibleCount < filteredProducts.length && (
                <div className={styles.loadMore}>
                  <Button
                    type="primary"
                    onClick={() => setVisibleCount((prev) => prev + 10)}
                  >
                    Xem thêm
                  </Button>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Menu;
