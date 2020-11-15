import { useMutation, useQuery } from "@apollo/react-hooks";
import { Button, Layout, Table, Form, DatePicker, Modal, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useState } from "react";
import { GET_WORKLOGS, DELETE_WORKLOG } from "../../utils/graphql";
import moment from 'moment'

const WorkLogPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [form] = useForm();

  const { data: workLogData, loading: workLogLoading } = useQuery(GET_WORKLOGS, {
    fetchPolicy: 'no-cache',
    pollInterval: 1000,
    onError: (err: any) => {
      window.alert(err)
    }
  });

  const [deleteWorkLog, { loading: deleteWorkLogLoading }] = useMutation(DELETE_WORKLOG);

  const columns = [
    {
      title: "วันที่ทำงาน",
      dataIndex: "historyDate",
      key: "historyDate",
      width: "15%",
      render: (date: any) => {
        return moment(date).format('DD/MM/YYYY')
      }
    },
    {
      title: "ชื่อพนักงาน",
      dataIndex: "employee",
      key: "employee",
      width: "15%",
      render: (emp: any) => {
        return emp.name
      }
    },
    {
      title: "ชั่วโมงทำงาน",
      dataIndex: "hours",
      key: "hours",
      width: "15%",
    },
    {
      title: "ค่าจ้าง (ยอดรวม)",
      dataIndex: "earning",
      key: "earning",
      width: "15%",
      render: (earning: any) => {
        return earning.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    },
    {
      title: "ตัวเลือก",
      dataIndex: "id",
      key: "id",
      width: "60%",
      render: (id: any) => (
        <div>
          <Button type="primary" className="mr-4">
            แก้ไข
          </Button>
          <Button onClick={() => { deleteWorkLog({ variables: { id: id } }) }}>ลบ</Button>
        </div>
      ),
    },
  ];

  const datasource = workLogData && workLogData.workingHistories

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
