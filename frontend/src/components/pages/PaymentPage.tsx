import { Button, Layout, Table } from "antd";
import React from "react";

const PaymentPage = () => {
  const dataSource = [
    {
      key: "1",
      name: "Mike",
      wage: 32,
      option: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      wage: 42,
      option: "10 Downing Street",
    },
    {
      key: "3",
      name: "John",
      wage: 42,
      option: "10 Downing Street",
    },
    {
      key: "4",
      name: "John",
      wage: 42,
      option: "10 Downing Street",
    },
    {
      key: "5",
      name: "John",
      wage: 42,
      option: "10 Downing Street",
    },
    {
      key: "6",
      name: "John",
      wage: 42,
      option: "10 Downing Street",
    },
    {
      key: "7",
      name: "John",
      wage: 42,
      option: "10 Downing Street",
    },
    {
      key: "8",
      name: "John",
      wage: 42,
      option: "10 Downing Street",
    },
    {
      key: "9",
      name: "John",
      wage: 42,
      option: "10 Downing Street",
    },
    {
      key: "10",
      name: "John",
      wage: 42,
      option: "10 Downing Street",
    },
    {
      key: "11",
      name: "John",
      wage: 42,
      option: "10 Downing Street",
    },
    {
      key: "12",
      name: "John",
      wage: 42,
      option: "10 Downing Street",
    },
    {
      key: "13",
      name: "John",
      wage: 42,
      option: "10 Downing Street",
    },
    {
      key: "14",
      name: "John",
      wage: 42,
      option: "10 Downing Street",
    },
    {
      key: "15",
      name: "John",
      wage: 42,
      option: "10 Downing Street",
    },
    {
      key: "16",
      name: "John",
      wage: 42,
      option: "10 Downing Street",
    },

  ];

  const columns = [
    {
      title: "ชื่อ",
      dataIndex: "name",
      key: "name",
      width: "20%",
    },
    {
      title: "ค่าจ้างคงเหลือที่เบิกได้",
      dataIndex: "wage",
      key: "wage",
      width: "20%",
      render: (wage: any) => <div className="text-center">{wage} บาท</div>,
    },
    {
      title: "ตัวเลือก",
      dataIndex: "option",
      key: "option",
      width: "60%",
      render: (emp: any) => (
        <div>
          <Button type="primary" className="mr-4">
            จ่ายเงิน
          </Button>
          <Button>ประวัติการจ่ายเงิน</Button>
        </div>
      ),
    },
  ];

  return (
    <Layout.Content>
      <div className="m-4 bg-white flex flex-col flex-1">
        <div className="h-16 w-full flex items-center px-8 text-base border-b border-gray-300">
          การจ่ายเงิน
        </div>
        <div className="px-8 py-6">
          <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 20 }} />
        </div>
      </div>
    </Layout.Content>
  );
};

export default PaymentPage;
