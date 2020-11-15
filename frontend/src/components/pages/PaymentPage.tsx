import { useQuery } from "@apollo/react-hooks";
import { Button, Layout, Table } from "antd";
import React from "react";
import { GET_EMLOYEES_EARNING } from "../../utils/graphql";

const PaymentPage = () => {

  const { data: workLogData, loading: workLogLoading } = useQuery(GET_EMLOYEES_EARNING, {
    fetchPolicy: 'no-cache',
    // pollInterval: 1000,
    onError: (err: any) => {
      window.alert(err)
    }
  });

  console.log(workLogData && workLogData.getEmployeesEarning)

  const dataSource = workLogData && workLogData.getEmployeesEarning && workLogData.getEmployeesEarning.data

  const columns = [
    {
      title: "ชื่อ",
      dataIndex: "name",
      key: "name",
      width: "20%",
    },
    {
      title: "ค่าจ้างคงเหลือที่เบิกได้",
      dataIndex: "remainingEarning",
      key: "remainingEarning",
      width: "20%",
      render: (wage: any) => <div className="text-center">{wage.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} บาท</div>,
    },
    {
      title: "ตัวเลือก",
      dataIndex: "id",
      key: "id",
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
