import React from "react";
import { Row, Col, Typography, Card } from "antd";
import "./AboutUs.css";

const { Title, Paragraph } = Typography;

const AboutUs = () => {
  return (
    <div className="aboutus-container">
      <Row gutter={[32, 32]} justify="center" align="middle">
        <Col xs={24} md={12}>
          <img
            src="https://images.unsplash.com/photo-1551026921-aecab8cff449?q=80&w=2127&auto=format"
            className="aboutus-image"
          />
        </Col>
        <Col xs={24} md={12}>
          <Typography>
            <Title level={2} style={{ color: "#2e7d32" }}>
              Về Chúng Tôi
            </Title>
            <Paragraph style={{ fontSize: "16px", lineHeight: 1.7 }}>
              Chào mừng bạn đến với <b>The Study Coffee</b> – nơi chúng tôi
              không chỉ phục vụ sản phẩm, mà còn mang đến những trải nghiệm
              tuyệt vời nhất cho bạn.
            </Paragraph>
            <Paragraph style={{ fontSize: "16px", lineHeight: 1.7 }}>
              Với tâm huyết và tình yêu dành cho chất lượng, The Study Coffee
              cam kết cung cấp những sản phẩm tốt nhất, an toàn và giá cả hợp
              lý. Đội ngũ nhân viên của chúng tôi luôn sẵn sàng phục vụ bạn với
              sự tận tâm và chuyên nghiệp.
            </Paragraph>
            <Paragraph style={{ fontSize: "16px", lineHeight: 1.7 }}>
              Cảm ơn bạn đã tin tưởng và đồng hành cùng chúng tôi! ❤️
            </Paragraph>
          </Typography>
        </Col>
      </Row>

      {/* Sứ mệnh - Tầm nhìn - Giá trị */}
      <Row gutter={[24, 24]} justify="center" style={{ marginTop: "60px" }}>
        <Col xs={24} md={8}>
          <Card hoverable bordered className="aboutus-card">
            <Title level={4} style={{ color: "#2e7d32" }}>
              Sứ Mệnh
            </Title>
            <Paragraph>
              Mang đến những sản phẩm chất lượng nhất, góp phần xây dựng phong
              cách sống xanh, lành mạnh và bền vững.
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card hoverable bordered className="aboutus-card">
            <Title level={4} style={{ color: "#2e7d32" }}>
              Tầm Nhìn
            </Title>
            <Paragraph>
              Trở thành thương hiệu được yêu thích nhất trong lĩnh vực cung cấp
              sản phẩm tiêu dùng chất lượng cao.
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card hoverable bordered className="aboutus-card">
            <Title level={4} style={{ color: "#2e7d32" }}>
              Giá Trị Cốt Lõi
            </Title>
            <Paragraph>
              Chất lượng – Tận tâm – Sáng tạo – Uy tín – Trách nhiệm với cộng
              đồng và môi trường.
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AboutUs;
