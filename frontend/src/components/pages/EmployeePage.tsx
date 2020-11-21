import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { Button, Layout, Table, Form, Input, Select, Modal, Tag } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useState } from "react";
import { CREATE_EMPLOYEE, GET_EMPLOYEE, GET_EMPLOYEES, DELETE_EMPLOYEE, UPDATE_EMPLOYEE } from "../../utils/graphql";

const EmployeePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [form] = useForm();
  const [editForm] = useForm();
  const [createEmployee, { loading: createEmployeeLoading }] = useMutation(CREATE_EMPLOYEE);
  const [deleteEmployee, { loading: deleteEMployeeLoading }] = useMutation(DELETE_EMPLOYEE);
  const [updateEmployee, { loading: updateEmployeeLoading }] = useMutation(UPDATE_EMPLOYEE);
  const [getEmployee, { called, loading: employeeLoading, data: employeeData }] = useLazyQuery(GET_EMPLOYEE, {
    fetchPolicy: 'network-only',
    onCompleted: (src) => {
      const emp = src && src.employees && src.employees[0]
      editForm.setFieldsValue({
        name: emp.name,
        type: emp.hiringType,
        earning: emp.earning,
      })
    },
    onError: (err) => {
      window.alert(err)
    }
  });
  const { data: employeesData, loading: employeesLoading } = useQuery(GET_EMPLOYEES, {
    fetchPolicy: 'no-cache',
    pollInterval: 1000,
    onError: (err) => {
      window.alert(err)
    }
  });

  const columns = [
    {
      title: "ชื่อ",
      dataIndex: "name",
      key: "name",
      width: "20%",
    },
    {
      title: "ประเภทการจ้าง",
      dataIndex: "hiringType",
      key: "hiringType",
      width: "20%",
      render: (hiringType: String) => hiringType === 'HOURLY' ? < Tag color="green" > รายชั่วโมง</Tag > :
        hiringType === 'DAILY' ? <Tag color="blue">รายวัน</Tag> :
          hiringType === 'MONTHLY' ? <Tag color="purple">รายเดือน</Tag> :
            <Tag color="red">ไม่ทราบ</Tag>
    },
    {
      title: "ค่าจ้าง",
      dataIndex: "earning",
      key: "earning",
      width: "20%",
      render: (earning: any) => <div>
        {earning.toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} บาท</div>,
    },
    {
      title: "ตัวเลือก",
      dataIndex: "id",
      key: "id",
      width: "60%",
      render: (id: any) => (
        <div>
          <Button type="primary" className="mr-4" onClick={() => { getEmployee({ variables: { id: id } }); setShowEditModal(true); }}>
            แก้ไข
          </Button>
          <Button onClick={() => { deleteEmployee({ variables: { id: id } }) }}>
            ลบ
          </Button>
        </div>
      ),
    },
  ];

  const datasource = employeesData && employeesData.employees
  const employee = employeeData && employeeData.employees && employeeData.employees[0]

  const onFinish = (values: any) => {
    console.log('create', values);
    createEmployee({
      variables: {
        name: values.name,
        hiringType: values.type,
        earning: parseFloat(values.earning)
      }
    })
    form.resetFields();
    setShowModal(false);
  };

  const onFinishEdit = (values: any) => {
    console.log('update', values);
    updateEmployee({
      variables: {
        id: employee && employee.id,
        name: values.name,
        hiringType: values.type,
        earning: parseFloat(values.earning)
      }
    })
    editForm.resetFields();
    setShowEditModal(false);
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
        onCancel={() => { setShowModal(false); form.resetFields(); }}
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
        forceRender={true}
      >
        <Form
          form={form}
          onFinish={onFinish}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          initialValues={{
            name: "",
            type: "HOURLY",
            earning: "",
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
              <Select.Option value="HOURLY">รายชั่วโมง</Select.Option>
              <Select.Option value="DAILY">รายวัน</Select.Option>
              <Select.Option value="MONTHLY">รายเดือน</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="earning"
            label="ค่าจ้าง"
            rules={[
              {
                required: true,
                message: "กรุณาใส่จำนวนค่าจ้าง",
              },
            ]}
          >
            <Input type="number" placeholder="150" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`แก้ไขพนักงาน ${employee && employee.name}`}
        visible={showEditModal}
        onCancel={() => { setShowEditModal(false); editForm.resetFields(); }}
        footer={[
          <Button key="cancel" onClick={() => { setShowEditModal(false); editForm.resetFields(); }}>
            ยกเลิก
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() =>
              editForm
                .validateFields()
                .then((values) => onFinishEdit(values))
                .catch((info) => console.log(info))
            }
          >
            แก้ไข
          </Button>,
        ]}
        forceRender={true}
      >
        <Form
          form={editForm}
          onFinish={onFinishEdit}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
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
              <Select.Option value="HOURLY">รายชั่วโมง</Select.Option>
              <Select.Option value="DAILY">รายวัน</Select.Option>
              <Select.Option value="MONTHLY">รายเดือน</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="earning"
            label="ค่าจ้าง"
            rules={[
              {
                required: true,
                message: "กรุณาใส่จำนวนค่าจ้าง",
              },
            ]}
          >
            <Input type="number" placeholder="150" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout.Content>
  );
};

export default EmployeePage;
