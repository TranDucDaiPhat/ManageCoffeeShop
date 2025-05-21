import React, { useEffect, useState } from "react";
import { Card, Tabs, Table, Tag, message } from "antd";
import axios from "axios";
import styles from "./Member.module.css";
import banner from "./banner.jpg";

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

const MemberPage = () => {
  const [memberInfo, setMemberInfo] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    console.log("Token:", token);
    if (!token) {
      message.error("Vui lòng đăng nhập");
      return;
    }

    axios
      .get("http://localhost:8081/myapp/api/business/customer/getInfo", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((res) => {
        const data = res.data;
        console.log("Member info:", data);
        setMemberInfo({
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          gender: data.gender,
          birthDay: data.birthDay,
          email: data.email,
          address: data.address,
          rank: data.rank || "Bạc",
          accumulatedPoint: data.accumulatedPoint || 0,
          customerId: data.customerId,
        });

        return axios.get(
          `http://localhost:8081/myapp/api/business/history/${data.customerId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
      })
      .then((res) => {
        const list = res.data.map((item, index) => ({
          key: index + 1,
          date: item.date,
          order: `#${item.orderId}`,
          points: item.plusPoint,
        }));
        setHistoryData(list);
      })
      .catch((err) => {
        console.error(err);
        message.error("Không thể tải thông tin thành viên");
      });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.bannerWrapper}>
        <img src={banner} alt="Banner" className={styles.banner} />
        {memberInfo && (
          <Card className={styles.cardOverlay} title="Thông tin thành viên">
            <p>
              <strong>Họ và tên:</strong> {memberInfo.customerName}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {memberInfo.customerPhone}
            </p>
            <p>
              <strong>Email:</strong> {memberInfo.email}
            </p>
            <p>
              <strong>Giới tính:</strong> {memberInfo.gender}
            </p>
            <p>
              <strong>Ngày sinh:</strong> {memberInfo.birthDay}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {memberInfo.address}
            </p>
            <p>
              <strong>Cấp độ hiện tại:</strong>{" "}
              <Tag color="silver">{memberInfo.rank}</Tag>
            </p>
            <p>
              <strong>Điểm hiện tại:</strong> {memberInfo.accumulatedPoint}
            </p>
          </Card>
        )}
      </div>

      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "Lịch sử tích điểm",
            children: (
              <Table
                columns={[
                  { title: "Ngày", dataIndex: "date", key: "date" },
                  { title: "Mã đơn hàng", dataIndex: "order", key: "order" },
                  { title: "Điểm cộng", dataIndex: "points", key: "points" },
                ]}
                dataSource={historyData}
                pagination={false}
              />
            ),
          },
          {
            key: "2",
            label: "Quyền lợi thành viên",
            children: (
              <Table
                columns={[
                  { title: "Cấp độ", dataIndex: "level", key: "level" },
                  {
                    title: "Điều kiện",
                    dataIndex: "condition",
                    key: "condition",
                  },
                  {
                    title: "Quyền lợi",
                    dataIndex: "benefits",
                    key: "benefits",
                  },
                ]}
                dataSource={levelBenefits}
                pagination={false}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default MemberPage;
