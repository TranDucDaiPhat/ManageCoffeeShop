import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMonById } from "../../Api/productApi";

export default function ProductInfo() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getMonById(id);
        setProduct(data);
      } catch (err) {
        setError("Không thể tải sản phẩm");
        console.error(err);
      }
    }

    fetchData();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!product) return <p>Đang tải thông tin sản phẩm...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ color: "#2e7d32" }}>{product.productName}</h2>
      <img
        src={product.productImg}
        alt={product.productName}
        style={{
          width: "100%",
          maxHeight: "300px",
          objectFit: "cover",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          marginBottom: "20px"
        }}
      />
      <p style={{ fontSize: "18px" }}>
        <strong>Giá:</strong>{" "}
        <span style={{ color: "#388e3c" }}>{product.productPrice} VND</span>
      </p>
      <p style={{ fontSize: "16px" }}>
        <strong>Số lượng trong kho:</strong>{" "}
        {product.productInventoryQuantity > 0
          ? product.productInventoryQuantity
          : "Hết hàng"}
      </p>
      <p style={{ fontSize: "16px" }}>
        <strong>Mô tả:</strong>{" "}
        {product.productDescription || "Sản phẩm chưa có mô tả chi tiết."}
      </p>
    </div>
  );
}
