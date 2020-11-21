import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
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
import { CREATE_PAYROLL, GET_EMLOYEES_EARNING, GET_EMPLOYEE_HISTORIES } from "../../utils/graphql";
import moment from "moment";

const PaymentPage = () => {
  const [showPayModal, setShowPayModal] = useState(false);
  const [showPayHistoryModal, setShowPayHistoryModal] = useState(false);
  const [paidDataSource, setPaidDataSource] = useState();
  const [workingHistoriesDataSource, setWorkingHistoriesDataSource] = useState();
  const [payEmpId, setPayEmpId] = useState();
  const [employeeId, setEmployeeId] = useState();
  const [form] = useForm();

  const [createPayroll, { loading: createPayrollLoading }] = useMutation(CREATE_PAYROLL);

  const [getEmployeeHistories, { called, loading: employeeHistoriesLoading, data: employeeHistories }] = useLazyQuery(GET_EMPLOYEE_HISTORIES, {
    fetchPolicy: 'network-only',
    onCompleted: (sre) => {
      let object = sre && sre.getEmployeeHistories
      let payrolls = object && object.payrolls
      let workingHistories = object && object.workingHistories
      setPaidDataSource(payrolls)
      setWorkingHistoriesDataSource(workingHistories)
    },
    onError: (err) => {
      window.alert(err)
    }
  });

  const { data: workLogData, loading: workLogLoading } = useQuery(
    GET_EMLOYEES_EARNING,
    {
      fetchPolicy: "no-cache",
      pollInterval: 1000,
      onError: (err: any) => {
        window.alert(err);
      },
    }
  );

  let dataSource =
    workLogData &&
    workLogData.getEmployeesEarning &&
    workLogData.getEmployeesEarning.data &&
    workLogData.getEmployeesEarning.data.slice().sort(function (a: any, b: any) { return b.remainingEarning - a.remainingEarning });

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
      width: "60%",
      render: (emp: any) => (
        <div>
          <Button
            type="primary"
            className="mr-4"
            onClick={() => {
              // set form data
              form.setFieldsValue({
                employee: emp.name,
                date: moment().utcOffset(7),
                amount: ''
              });
              setPayEmpId(emp.id)
              setShowPayModal(true);
            }}
          >
            จ่ายเงิน
          </Button>
          <Button
            onClick={() => {
              getEmployeeHistories({
                variables: {
                  employeeId: emp.id
                }
              })
              setEmployeeId(emp.id)
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
    createPayroll({
      variables: {
        employeeId: payEmpId,
        payrollDate: moment(values.date).utcOffset(7).toDate(),
        paid: parseFloat(values.amount)
      }
    })
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
            paidDataSource={paidDataSource}
            workingHistoriesDataSource={workingHistoriesDataSource}
            getEmployeeHistories={getEmployeeHistories}
            employee={{}}
            employeeId={employeeId}
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
      onCancel={() => { setShow(false) }}
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
          <DatePicker format={'DD/MM/YYYY'} />
        </Form.Item>
        <Form.Item
          name="amount"
          label="จำนวนเงิน"
          rules={[{ required: true, message: "กรุณาระบุจำนวนเงิน" }]}
        >
          <Input placeholder="1000" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const PayHistoryModal = ({ show, setShow, employee, employeeId, paidDataSource, workingHistoriesDataSource, getEmployeeHistories }: any) => {
  //employe for fetch data

  const paidCol: ColumnsType<any> = [
    {
      title: "วันที่จ่ายเงิน",
      dataIndex: "payrollDate",
      key: "payrollDate",
      render: (payrollDate) => {
        return moment(payrollDate).utcOffset(7).format('DD/MM/YYY')
      }
    },
    {
      title: "ยอดชำระ",
      dataIndex: "paid",
      key: "paid",
      align: "right",
      render: (paid) => <div>{paid.toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} บาท</div>,
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
              <Tag color="red">ยังไม่จ่าย</Tag>
            );
      }
    },
    {
      title: "วันที่ทำงาน",
      dataIndex: "historyDate",
      key: "historyDate",
      render: (historyDate) => {
        return moment(historyDate).utcOffset(7).format('DD/MM/YYYY')
      }
    },
    {
      title: "ชั่วโมงทำงาน",
      dataIndex: "hours",
      key: "hours",
      render: (text) => <div>{text} ชั่วโมง</div>,
    },
    {
      title: "ค่าจ้าง (ยอดรวม)",
      dataIndex: "earning",
      key: "earning",
      align: "right",
      render: (earning) => <div>{earning.toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} บาท</div>,
    },
  ];

  let sumPayroll = 0
  let sumWorkingHistories = 0
  let formattedWorkingHistoriesDataSource: any = []

  if (paidDataSource && paidDataSource.length > 0) {
    for (let pd of paidDataSource) {
      sumPayroll += pd.paid
    }
  }
  if (workingHistoriesDataSource && workingHistoriesDataSource.length > 0) {
    let tmpSumPayroll = sumPayroll
    let alreadyPart = false
    for (let whds of workingHistoriesDataSource.slice().reverse()) {
      sumWorkingHistories += whds.earning
      tmpSumPayroll -= whds.earning
      let status
      if (!alreadyPart) {
        if (tmpSumPayroll >= 0) {
          status = 'full'
        } else {
          status = 'part'
          alreadyPart = true
        }
      } else {
        status = 'none'
      }
      formattedWorkingHistoriesDataSource.push({
        ...whds,
        paidStatus: status
      })
    }
    formattedWorkingHistoriesDataSource.reverse()
  }

  return (
    <Modal
      width="95%"
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
            {sumWorkingHistories
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} บาท
          </div>
          <div>
            ยอดที่ชำระไปแล้ว <br />
            {sumPayroll
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} บาท
          </div>
          <div>
            ยอดคงเหลือ <br />
            {(sumWorkingHistories - sumPayroll)
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} บาท
          </div>
        </div>
        <div className="flex items-center justify-between">
          <DatePicker.RangePicker
            placeholder={["วันเริ่ม", "วันสิ้นสุด"]}
            format={'DD/MM/YYYY'}
            onChange={(value: any) => {
              if (value) {
                let startDate = value[0]
                let endDate = value[1]
                getEmployeeHistories({
                  variables: {
                    employeeId: employeeId,
                    startDate: moment(startDate).utcOffset(7).toDate(),
                    endDate: moment(endDate).utcOffset(7).toDate()
                  }
                })
              } else {
                getEmployeeHistories({
                  variables: {
                    employeeId: employeeId
                  }
                })
              }
            }}
          />
        </div>
        <div className="flex mt-4">
          <Table
            className="flex-1"
            scroll={{ y: 300 }}
            columns={paidCol}
            dataSource={paidDataSource}
          />
          <div className="w-4" />
          <Table
            className="flex-1"
            scroll={{ y: 300 }}
            columns={historyCol}
            dataSource={formattedWorkingHistoriesDataSource}
          />
        </div>
      </div>
    </Modal>
  );
};
