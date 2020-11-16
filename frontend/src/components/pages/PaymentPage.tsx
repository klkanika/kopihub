import { useQuery } from "@apollo/react-hooks";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Layout,
  Modal,
  Table,
  Tag,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { ColumnsType } from "antd/lib/table";
import React, { useState } from "react";
import { GET_EMLOYEES_EARNING } from "../../utils/graphql";

const PaymentPage = () => {
  const [showPayModal, setShowPayModal] = useState(false);
  const [showPayHistoryModal, setShowPayHistoryModal] = useState(false);
  const [form] = useForm();

  const { data: workLogData, loading: workLogLoading } = useQuery(
    GET_EMLOYEES_EARNING,
    {
      fetchPolicy: "no-cache",
      // pollInterval: 1000,
      onError: (err: any) => {
        window.alert(err);
      },
    }
  );

  console.log(workLogData && workLogData.getEmployeesEarning);

  const dataSource =
    workLogData &&
    workLogData.getEmployeesEarning &&
    workLogData.getEmployeesEarning.data;

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
      render: (wage: any) => (
        <div className="text-center">
          {wage
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
          บาท
        </div>
      ),
    },
    {
      title: "ตัวเลือก",
      dataIndex: "id",
      key: "id",
      width: "60%",
      render: (emp: any) => (
        <div>
          <Button
            type="primary"
            className="mr-4"
            onClick={() => {
              // set form data
              form.setFieldsValue({
                employee: "Name",
                date: "12-12-2555",
                amount: 500,
              });
              setShowPayModal(true);
            }}
          >
            จ่ายเงิน
          </Button>
          <Button
            onClick={() => {
              //set data
              setShowPayHistoryModal(true);
            }}
          >
            ประวัติการจ่ายเงิน
          </Button>
        </div>
      ),
    },
  ];

  const onPay = (values: any) => {
    console.log(values);
    setShowPayModal(false);
  };

  return (
    <Layout.Content>
      <div className="m-4 bg-white flex flex-col flex-1">
        <div className="h-16 w-full flex items-center px-8 text-base border-b border-gray-300">
          การจ่ายเงิน
        </div>
        <div className="px-8 py-6">
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={{ pageSize: 20 }}
          />
          <PayModal
            show={showPayModal}
            setShow={setShowPayModal}
            form={form}
            onFinish={onPay}
          />
          <PayHistoryModal
            show={showPayHistoryModal}
            setShow={setShowPayHistoryModal}
            employee={{}}
          />
        </div>
      </div>
    </Layout.Content>
  );
};

export default PaymentPage;
const PayModal = ({ show, setShow, form, onFinish }: any) => {
  return (
    <Modal
      title="จ่ายเงิน"
      visible={show}
      onCancel={() => setShow(false)}
      footer={[
        <Button key="cancel" onClick={() => setShow(false)}>
          ยกเลิก
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() =>
            form
              .validateFields()
              .then((values: any) => onFinish(values))
              .catch((info: any) => console.log(info))
          }
        >
          เพิ่ม
        </Button>,
      ]}
    >
      <Form
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
      >
        <Form.Item name="employee" label="พนักงาน">
          <Input disabled />
        </Form.Item>
        <Form.Item name="date" label="วันที่จ่ายเงิน">
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="amount"
          label="จำนวนเงิน"
          rules={[{ required: true, message: "กรุณาระบุจำนวนเงิน" }]}
        >
          <Input placeholder="100" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const PayHistoryModal = ({ show, setShow, employee }: any) => {
  //employe for fetch data

  const paidCol: ColumnsType<any> = [
    {
      title: "วันที่จ่ายเงิน",
      dataIndex: "paidDate",
      key: "paidDate",
    },
    {
      title: "ยอดชำระ",
      dataIndex: "paidAmount",
      key: "paidAmount",
      align: "right",
      render: (text) => <div>{text} บาท</div>,
    },
  ];
  const historyCol: ColumnsType<any> = [
    {
      title: "สถานะการจ่าย",
      dataIndex: "paidStatus",
      key: "paidStatus",
      render: (status) => {
        return status === "part" ? (
          <Tag color="orange">จ่ายแล้วบางส่วน</Tag>
        ) : status === "full" ? (
          <Tag color="green">จ่ายแล้วเต็มจำนวน</Tag>
        ) : (
          <Tag>unknown</Tag>
        );
      },
    },
    {
      title: "วันที่ทำงาน",
      dataIndex: "workDate",
      key: "workDate",
    },
    {
      title: "ชั่วโมงทำงาน",
      dataIndex: "hours",
      key: "hours",
      render: (text) => <div>{text} ชั่วโมง</div>,
    },
    {
      title: "ค่าจ้าง (ยอดรวม)",
      dataIndex: "total",
      key: "total",
      align: "right",
      render: (text) => <div>{text} บาท</div>,
    },
  ];

  return (
    <Modal
      width="70%"
      title="ประวัติการจ่ายเงิน"
      visible={show}
      onCancel={() => setShow(false)}
      style={{ top: 20 }}
      footer={null}
    >
      <div className="px-4" style={{ height: "80vh" }}>
        <div className="text-center mb-8">การจ่ายเงินโดยภาพรวม</div>
        <div className="flex items-center justify-around mb-8">
          <div>
            ยอดที่ต้องชำระ <br />
            {"35,966.25"} บาท
          </div>
          <div>
            ยอดที่ชำระไปแล้ว <br />
            {"35,966.25"} บาท
          </div>
          <div>
            ยอดคงเหลือ <br />
            {"35,966.25"} บาท
          </div>
        </div>
        <div className="flex items-center justify-between">
          <DatePicker.RangePicker placeholder={["วันเริ่ม", "วันสิ้นสุด"]} />
          <div>ยอดรวมในตาราง {"35,966"} บาท</div>
        </div>
        <div className="flex mt-4">
          <Table
            className="flex-1"
            scroll={{ y: 300 }}
            columns={paidCol}
            dataSource={[
              {
                paidDate: "2020-11-14",
                paidAmount: 500,
              },
            ]}
          />
          <div className="w-4" />
          <Table
            className="flex-1"
            scroll={{ y: 300 }}
            columns={historyCol}
            dataSource={[
              {
                paidStatus: "part",
                workDate: "2020-11-14",
                hours: "12:30",
                total: 500,
              },
              {
                paidStatus: "full",
                workDate: "2020-11-14",
                hours: "12:30",
                total: 500,
              },
            ]}
          />
        </div>
      </div>
    </Modal>
  );
};
