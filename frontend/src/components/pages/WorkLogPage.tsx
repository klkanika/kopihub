import { Button, Layout, Table, Form, DatePicker, Modal, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useState } from "react";

const WorkLogPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [form] = useForm();

  const columns = [
    {
      title: "วันที่ทำงาน",
      dataIndex: "date",
      key: "date",
      width: "15%",
    },
    {
      title: "ชื่อพนักงาน",
      dataIndex: "name",
      key: "name",
      width: "15%",
    },
    {
      title: "ชั่วโมงทำงาน",
      dataIndex: "hour",
      key: "hour",
      width: "15%",
    },
    {
      title: "ค่าจ้าง (ยอดรวม)",
      dataIndex: "total_wage",
      key: "total_wage",
      width: "15%",
    },
    {
      title: "ตัวเลือก",
      dataIndex: "option",
      key: "option",
      width: "60%",
      render: (emp: any) => (
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
      date: "2020-11-07",
      name: i,
      hour: i,
      total_wage: (i + 1) * 50,
    };
  });

  const onFinish = (values: any) => {
    console.log(values);
    form.resetFields();
    setShowModal(false);
  };

  return (
    <Layout.Content>
      <div className="m-4 bg-white flex flex-col flex-1">
        <div className="h-16 w-full flex items-center px-8 text-base border-b border-gray-300">
          ประวัติการทำงาน
        </div>
        <div className="flex items-center justify-end px-8 pt-10 text-lg mb-8">
          <Button onClick={() => setShowModal(true)} type="primary">
            + สร้างใหม่
          </Button>
        </div>
        <div className="flex justify-between px-8">
          <div className="flex">
            <div className="mr-4">
              <div>กรองด้วยวันที่</div>
              <DatePicker.RangePicker
                placeholder={["วันเริ่ม", "วันสิ้นสุด"]}
              />
            </div>
            <div>
              <div>กรองด้วยพนักงาน</div>
              <Select defaultValue="-" className="w-32">
                <Select.Option value="-">-</Select.Option>
              </Select>
            </div>
          </div>
          <div>
            ยอดรวม <br />{" "}
            <span className="text-gray-700">{"(กรุณาเลือกวันที่ก่อน)"}</span>
          </div>
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
        title="บันทึกการทำงาน"
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
        >
          <Form.Item
            name="date_range"
            label="วันที่ทำงาน"
            rules={[{ required: true, message: "กรุณาใส่ช่วงเวลาที่ทำงาน" }]}
          >
            <DatePicker.RangePicker placeholder={["วันเริ่ม", "วันสิ้นสุด"]} />
          </Form.Item>
        </Form>
      </Modal>
    </Layout.Content>
  );
};

export default WorkLogPage;
