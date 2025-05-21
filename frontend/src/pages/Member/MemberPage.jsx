import React from "react";
import { Card, Tabs, Table, Progress, Tag } from "antd";
import styles from "./Member.module.css";
import banner from "./banner.jpg";

const memberInfo = {
  name: "Nguyễn Văn A",
  level: "Bạc",
  point: 1200,
  nextLevel: 2000,
};

const levelBenefits = [
  {
    key: "1",
    level: "Bạc",
    condition: "0 - 1.999 điểm",
    benefits: "Ưu đãi sinh nhật, tích điểm hoàn tiền 5%",
  },
  {
    key: "2",
    level: "Vàng",
    condition: "2.000 - 4.999 điểm",
    benefits: "Tích điểm hoàn tiền 7%, ưu đãi theo tháng",
  },
  {
    key: "3",
    level: "Bạch Kim",
    condition: "Từ 5.000 điểm",
    benefits: "Tích điểm hoàn tiền 10%, ưu đãi VIP đặc biệt",
  },
];

const historyData = [
  {
    key: "1",
    date: "10/05/2025",
    order: "#HD00123",
    points: 150,
  },
  {
    key: "2",
    date: "03/05/2025",
    order: "#HD00118",
    points: 90,
  },
];

const MemberPage = () => {
  return (
    <div className={styles.container}>
      <img src={banner} alt="Banner" className={styles.banner} />

      <Card className={styles.card} title="Thông tin thành viên">
        <p>
          <strong>Họ và tên:</strong> {memberInfo.name}
        </p>
        <p>
          <strong>Cấp độ hiện tại:</strong>{" "}
          <Tag color="silver">{memberInfo.level}</Tag>
        </p>
        <p>
          <strong>Điểm hiện tại:</strong> {memberInfo.point} /{" "}
          {memberInfo.nextLevel}
        </p>
        <Progress percent={(memberInfo.point / memberInfo.nextLevel) * 100} />
      </Card>

      <Tabs defaultActiveKey="1" className={styles.tabs}>
        <Tabs.TabPane tab="Lịch sử tích điểm" key="1">
          <Table
            columns={[
              { title: "Ngày", dataIndex: "date", key: "date" },
              { title: "Mã đơn hàng", dataIndex: "order", key: "order" },
              { title: "Điểm cộng", dataIndex: "points", key: "points" },
            ]}
            dataSource={historyData}
            pagination={false}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Quyền lợi thành viên" key="2">
          <Table
            columns={[
              { title: "Cấp độ", dataIndex: "level", key: "level" },
              { title: "Điều kiện", dataIndex: "condition", key: "condition" },
              { title: "Quyền lợi", dataIndex: "benefits", key: "benefits" },
            ]}
            dataSource={levelBenefits}
            pagination={false}
          />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default MemberPage;
