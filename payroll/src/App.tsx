import React from "react";
import "./styles/tailwind.css";
import "./styles/style.css";
import "antd/dist/antd.css";
import { Button, Layout, Menu, Table } from "antd";

const App = () => {
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
      render: (wage) => <div className="text-center">{wage} บาท</div>,
    },
    {
      title: "ตัวเลือก",
      dataIndex: "option",
      key: "option",
      width: "60%",
      render: (emp) => (
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
    <Layout className="h-screen">
      <Layout.Sider collapsible collapsed={false}>
        <Menu theme="dark">
          <Menu.Item key="employee">พนักงาน</Menu.Item>
          <Menu.Item key="worklog">บันทึกการทำงาน</Menu.Item>
          <Menu.Item key="payment">การจ่ายเงิน</Menu.Item>
        </Menu>
      </Layout.Sider>
      <Layout>
        <Layout.Header style={{ background: "#fff" }}>
          <div className="flex items-center justify-end text-base">
            ยินดีต้อนรับ, admin
            <img src="https://http.cat/404" className="w-5 h-5 ml-2" alt="" />
          </div>
        </Layout.Header>
        <Layout.Content>
          <div className="m-4 bg-white">
            <div className="h-16 w-full flex items-center px-8 text-base border-b border-gray-300">
              การจ่ายเงิน
            </div>
            <div className="px-8 py-6">
              <Table dataSource={dataSource} columns={columns} />
            </div>
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default App;
