import { useMutation, useQuery } from "@apollo/react-hooks";
import { Button, Layout, Table, Form, DatePicker, Modal, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useState } from "react";
import { GET_WORKLOGS, DELETE_WORKLOG, GET_EMPLOYEES } from "../../utils/graphql";
import moment from "moment";

const WorkLogPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [form] = useForm();
  const [editForm] = useForm();
  const [selectedDate, setSelectedDate] = useState([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('all');

  let worklogVariable = {}

  if (selectedDate && selectedDate[0] && selectedDate[1]) {
    worklogVariable =
    {
      empId: selectedEmployeeId && selectedEmployeeId != 'all' ? selectedEmployeeId : null,
      startDate: moment(selectedDate[0]).utcOffset(7).startOf('day').toDate(),
      endDate: moment(selectedDate[1]).utcOffset(7).endOf('day').toDate()
    }
  } else {
    worklogVariable =
    {
      empId: selectedEmployeeId && selectedEmployeeId != 'all' ? selectedEmployeeId : null,
    }
  }

  const { data: workLogData, loading: workLogLoading } = useQuery(
    GET_WORKLOGS,
    {
      fetchPolicy: "no-cache",
      variables: worklogVariable,
      pollInterval: 1000,
      onError: (err: any) => {
        window.alert(err);
      },
    }
  );

  const { data: employeesData, loading: employeesLoading } = useQuery(
    GET_EMPLOYEES,
    {
      fetchPolicy: "no-cache",
      pollInterval: 1000,
      onError: (err: any) => {
        window.alert(err);
      },
    }
  );

  const [deleteWorkLog, { loading: deleteWorkLogLoading }] = useMutation(
    DELETE_WORKLOG
  );

  const columns = [
    {
      title: "วันที่ทำงาน",
      dataIndex: "historyDate",
      key: "historyDate",
      width: "15%",
      render: (date: any) => {
        return moment(date).format("DD/MM/YYYY");
      },
    },
    {
      title: "ชื่อพนักงาน",
      dataIndex: "employee",
      key: "employee",
      width: "15%",
      render: (emp: any) => {
        return emp.name;
      },
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
        return earning
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
    },
    {
      title: "ตัวเลือก",
      dataIndex: "id",
      key: "id",
      width: "60%",
      render: (id: any) => (
        <div>
          <Button
            type="primary"
            className="mr-4"
            onClick={() => {
              //set editForm vales
              setShowEditModal(true);
            }}
          >
            แก้ไข
          </Button>
          <Button
            onClick={() => {
              deleteWorkLog({ variables: { id: id } });
            }}
          >
            ลบ
          </Button>
        </div>
      ),
    },
  ];

  const datasource = workLogData && workLogData.workingHistories
  // const datasource = [
  //   {
  //     key: 1,
  //     employee: {
  //       id: "2ac5fe8c-eecc-42bb-90ce-dc614aba2cc8",
  //       name: "Q",
  //     },
  //     earning: 150,
  //   },
  // ];

  const onFinish = (values: any) => {
    console.log(values);
    form.resetFields();
    setShowModal(false);
  };

  const onEdit = (values: any) => {
    console.log(values);
    form.resetFields();
    setShowEditModal(false);
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
                onChange={(value: any) => {
                  setSelectedDate(value)
                }}
              />
            </div>
            <div>
              <div>กรองด้วยพนักงาน</div>
              <Select
                defaultValue={'all'}
                className="w-32"
                onChange={(value: any) => {
                  setSelectedEmployeeId(value)
                }}>
                <Select.Option value={'all'}>ทั้งหมด</Select.Option>
                {
                  employeesData && employeesData.employees && employeesData.employees.map((d: any, i: any) => {
                    return <Select.Option value={d.id}>{d.name}</Select.Option>
                  })
                }
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
          wrapperCol={{ span: 14 }}
        >
          <Form.Item
            name="employee"
            label="พนักงาน"
            rules={[{ required: true, message: "กรุณาเลือกพนักงาน" }]}
          >
            <Select defaultValue={'all'} className="w-32">
              <Select.Option selected value={'all'}>ทั้งหมด</Select.Option>
              {
                employeesData && employeesData.employees && employeesData.employees.map((d: any, i: any) => {
                  return <Select.Option value={d.id}>{d.name}</Select.Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item
            name="date_range"
            label="วันที่ทำงาน"
            rules={[{ required: true, message: "กรุณาใส่ช่วงเวลาที่ทำงาน" }]}
          >
            <DatePicker.RangePicker placeholder={["วันเริ่ม", "วันสิ้นสุด"]} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="บันทึกการทำงาน"
        visible={showEditModal}
        onCancel={() => setShowEditModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowEditModal(false)}>
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
          onFinish={onEdit}
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
