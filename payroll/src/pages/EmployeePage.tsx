import { Button, Layout, Table, Form, Input, Select, Modal } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useState } from "react";

const EmployeePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [form] = useForm();

  const columns = [
    {
      title: "ชื่อ",
      dataIndex: "name",
      key: "name",
      width: "20%",
    },
    {
      title: "ประเภทการจ้าง",
      dataIndex: "type",
      key: "type",
      width: "20%",
    },
    {
      title: "ค่าจ้าง",
      dataIndex: "wage",
      key: "wage",
      width: "20%",
      render: (wage) => <div>{wage} บาท</div>,
    },
    {
      title: "ตัวเลือก",
      dataIndex: "option",
      key: "option",
      width: "60%",
      render: (emp) => (
        <div>
          <Button type="primary" className="mr-4">
            แก้ไข
          </Button>
          <Button>ลบ</Button>
        </div>
      ),
    },
  ];

  const datasource = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((d, i) => {
    return {
      key: i,
      name: i,
      type: "hour",
      wage: (i + 1) * 50,
    };
  });

  const onFinish = (values) => {
    console.log(values);
    form.resetFields();
    setShowModal(false);
  };

  return (
    <Layout.Content>
      <div className="m-4 bg-white flex flex-col flex-1">
        <div className="h-16 w-full flex items-center px-8 text-base border-b border-gray-300">
          พนักงาน
        </div>
        <div className="flex items-center justify-end px-8 pt-10 text-lg">
          <Button onClick={() => setShowModal(true)} type="primary">
            + เพิ่มพนักงาน
          </Button>
        </div>
        <div className="px-8 py-6">
          <Table
            dataSource={datasource}
            columns={columns}
            pagination={{ pageSize: 20 }}
          />
        </div>
      </div>
      <Modal
        title="เพิ่มพนักงานใหม่"
        visible={showModal}
        onCancel={() => setShowModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowModal(false)}>
            ยกเลิก
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() =>
              form
                .validateFields()
                .then((values) => onFinish(values))
                .catch((info) => console.log(info))
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
          wrapperCol={{ span: 16 }}
          initialValues={{
            name: "",
            type: "hour",
            wage: 150,
          }}
        >
          <Form.Item
            name="name"
            label="ชื่อ"
            rules={[{ required: true, message: "กรุณาใส่ชื่อพนักงาน" }]}
          >
            <Input placeholder="ชื่อพนักงาน" />
          </Form.Item>
          <Form.Item name="type" label="ประเภทการจ้าง">
            <Select style={{ width: 120 }}>
              <Select.Option value="hour">รายชั่วโมง</Select.Option>
              <Select.Option value="day">รายวัน</Select.Option>
              <Select.Option value="month">รายเดือน</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="wage"
            label="ค่าจ้าง"
            rules={[
              {
                required: true,
                message: "กรุณาใส่จำนวนค่าจ้าง",
              },
            ]}
          >
            <Input placeholder="150" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout.Content>
  );
};

export default EmployeePage;
