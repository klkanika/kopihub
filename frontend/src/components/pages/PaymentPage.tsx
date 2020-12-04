import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { MenuItem, Button as MaterialButton, TextField, InputAdornment, Modal as MaterialModal, Popover, Snackbar, CircularProgress, Tab, Tabs, SnackbarContent } from "@material-ui/core";
import { Layout, Table, Tooltip } from "antd";
import React, { useRef, useState } from "react";
import { GET_EMPLOYEE, GET_EMPLOYEES, UPSERT_EMPLOYEE, GET_UNIVERSITIES, GET_PAYMENT_HISTORY, GET_FACULTIES, GET_EMPLOYEE_WATCHERS, GET_WORKLOG, DELETE_WORKLOG, CREATE_WORKLOGS, CREATE_PAYROLL } from "../../utils/graphql";
import PayrollHeader from "./PayrollHeader";
import AddIcon from '@material-ui/icons/Add';
import GetAppIcon from '@material-ui/icons/GetApp';
import SearchIcon from '@material-ui/icons/Search';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import TodayIcon from '@material-ui/icons/Today';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MoneyIcon from '@material-ui/icons/AttachMoney';
import PostAddIcon from '@material-ui/icons/PostAdd';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import CheckIcon from '@material-ui/icons/Check';
import DoneIcon from '@material-ui/icons/Done';
import moment from "moment"
import bank_bay from '../../imgs/bank_bay.svg';
import bank_bbl from '../../imgs/bank_bbl.svg';
import bank_kbank from '../../imgs/bank_kbank.svg';
import bank_ktb from '../../imgs/bank_ktb.svg';
import bank_scb from '../../imgs/bank_scb.svg';
import default_profile from '../../imgs/profile.png';
import { Alert, Autocomplete } from "@material-ui/lab";
import { ViewEmployeeInfo } from "./EmployeePage";
import { css, Global } from "@emotion/core";
import {
  DateRangePicker,
  DateRangeDelimiter,
  LocalizationProvider
} from "@material-ui/pickers";
import DateFnsUtils from "@material-ui/pickers/adapter/date-fns";

const WorkLogPage = () => {
  const [showIdCardModal, setShowIdCardModal] = useState(false);
  const [showViewPayment, setShowViewPayment] = useState(false);
  const [showViewEmployeeModal, setShowViewEmployeeModal] = useState(false);
  const [payModal, setPayModal] = useState(false);
  const [payModel, setPayModel] = useState({});
  const [disabled, setDisabled] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [idCard, setIdCard] = useState('');
  const [textSearch, setTextSearch] = useState('');
  const [selectedTab, setSelectedTab] = useState('withdrawable');
  const [selectedEmployee, setSelectedEmployee]: any = useState();
  const [deleteWorkLog] = useMutation(DELETE_WORKLOG);
  const [upsertEmployee] = useMutation(UPSERT_EMPLOYEE);
  const [createPayroll, { loading: createPayrollLoading }] = useMutation(CREATE_PAYROLL);

  const [getEmployee, { called, loading: employeeLoading, data: employeeData }] = useLazyQuery(GET_EMPLOYEE, {
    fetchPolicy: 'network-only',
    onCompleted: (src) => {
      const emp = src && src.employees && src.employees[0]
      setSelectedEmployee(emp)
      setPayModel({
        employeeId: emp.id,
        employeeName: emp.name,
        payrollDate: moment().format('YYYY-MM-DD'),
        paid: emp.withdrawableMoney - emp.withdrawnMoney,
        allMoney: emp.withdrawableMoney - emp.withdrawnMoney
      })
      // editForm.setFieldsValue({
      //   name: emp.name,
      //   type: emp.hiringType,
      //   earning: emp.earning,
      //   university: emp.university,
      //   faculty: emp.faculty
      // })
    },
    onError: (err) => {
      window.alert(err)
    }
  });

  const [getPaymentHistory, { loading: paymentHistoryLoading, data: paymentHistoryData }] = useLazyQuery(GET_PAYMENT_HISTORY, {
    fetchPolicy: 'network-only',
    onError: (err) => {
      window.alert(err)
    }
  });
  console.log('render')

  const { data: employeesData, loading: employeesLoading } = useQuery(GET_EMPLOYEES, {
    fetchPolicy: 'no-cache',
    variables: {
      statusSearch: 'ACTIVE',
      textSearch: textSearch ? textSearch.trim() : '',
    },
    pollInterval: 1000,
    onError: (err) => {
      window.alert(err)
    }
  });

  let withdrawableEmployee = employeesData && employeesData.employees && employeesData.employees
    .slice()
    .filter((data: any) => {
      return data.withdrawableMoney - data.withdrawnMoney > 0
    })
    .sort((a: any, b: any) => {
      return (b.withdrawableMoney - b.withdrawnMoney) - (a.withdrawableMoney - a.withdrawnMoney)
    })

  let withdrawableEmployeeCount = withdrawableEmployee && withdrawableEmployee.length

  if (selectedTab === 'withdrawn') {
    withdrawableEmployee = employeesData && employeesData.employees && employeesData.employees
      .slice()
      .filter((data: any) => {
        return data.withdrawableMoney - data.withdrawnMoney <= 0
      }).sort((a: any, b: any) => {
        return (b.withdrawnMoney) - (a.withdrawnMoney)
      })
  } else if (selectedTab === 'all') {
    withdrawableEmployee = employeesData && employeesData.employees.slice().sort((a: any, b: any) => {
      return (((b.withdrawableMoney - b.withdrawnMoney) - (a.withdrawableMoney - a.withdrawnMoney)) * 1000000) + (b.withdrawnMoney) - (a.withdrawnMoney)
    })
  }

  const { data: workLogsData, loading: workLogsLoading } = useQuery(GET_WORKLOG, {
    fetchPolicy: 'no-cache',
    variables: {
      textSearch: textSearch ? textSearch.trim() : '',
    },
    pollInterval: 1000,
    onError: (err) => {
      window.alert(err)
    }
  });

  const { data: universities, loading: universitiesLoading } = useQuery(GET_UNIVERSITIES, {
    fetchPolicy: 'no-cache',
    pollInterval: 1000,
    onError: (err) => {
      window.alert(err)
    }
  });

  const { data: faculties, loading: facultiesLoading } = useQuery(GET_FACULTIES, {
    fetchPolicy: 'no-cache',
    pollInterval: 1000,
    onError: (err) => {
      window.alert(err)
    }
  });

  const { data: employeeWatchers, loading: employeeWatchersLoading } = useQuery(GET_EMPLOYEE_WATCHERS, {
    fetchPolicy: 'no-cache',
    pollInterval: 1000,
    onError: (err) => {
      window.alert(err)
    }
  });

  const MoreOptions = (props: any) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    let workLog = props.workLog
    let workLogId = workLog.id
    const handleClick = (event: any) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
      <div onClick={(e: any) => { e.stopPropagation() }}>
        <MoreVertIcon className="cursor-pointer" onClick={handleClick} />
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <div className="w-24">
            <MenuItem onClick={() => { let deleteWorkLogStatus = deleteWorkLog({ variables: { id: workLogId } }); if (deleteWorkLogStatus) { setShowSuccessMessage(true); } }}>ลบ</MenuItem>
          </div>
        </Popover>
      </div >
    );
  }

  const bank_list = [
    {
      bank: 'SCB',
      img: <div style={{ width: '20px', backgroundColor: '#4f2a81' }} className="rounded-full p-1 m-2">
        <img src={bank_scb} />
      </div>,
      name: 'ธนาคารไทยพาณิชย์'
    },
    {
      bank: 'KBANK',
      img: <div style={{ width: '20px', backgroundColor: '#FFFFFF' }} className="rounded-full m-2">
        <img src={bank_kbank} />
      </div>,
      name: 'ธนาคารกสิกรไทย'
    },
    {
      bank: 'BAY',
      img: <div style={{ width: '20px', backgroundColor: '#6f5f5e' }} className="rounded-full p-1 m-2">
        <img src={bank_bay} />
      </div>,
      name: 'ธนาคารกรุงศรี'
    },
    {
      bank: 'BBL',
      img: <div style={{ width: '20px', backgroundColor: '#16087f' }} className="rounded-full p-1 m-2">
        <img src={bank_bbl} />
      </div>,
      name: 'ธนาคารกรุงเทพ'
    },
    {
      bank: 'KTB',
      img: <div style={{ width: '20px', backgroundColor: '#04a5e3' }} className="rounded-full p-1 m-2">
        <img src={bank_ktb} />
      </div>,
      name: 'ธนาคารกรุงไทย'
    },
  ]

  let columns = [
    {
      title: "พนักงาน",
      render: (emp: any) => {
        return (
          <div className="flex items-center">
            <Tooltip title={emp && emp.profilePictureUrl ? 'คลิกเพื่อดูรูป' : ''} placement="bottom">
              <div className={`w-12 h-12 ${emp && emp.profilePictureUrl ? 'cursor-pointer' : ''}`} onClick={(e: any) => {
                e.stopPropagation()
                if (emp.profilePictureUrl) {
                  setShowIdCardModal(true)
                  setIdCard(emp && emp.profilePictureUrl)
                }
              }}
              >
                <img className="object-cover rounded-full" src={emp && emp.profilePictureUrl ? emp.profilePictureUrl : default_profile} />
              </div>
            </Tooltip>
            <div className="ml-6">{emp && emp.name}</div>
          </div>
        )
      }
    },
    {
      title: "ชม. ทำงานที่เบิกได้",
      render: (emp: any) => {
        return emp.withdrawableHours - emp.withdrawnHours
      }
    },
    {
      title: "ชม. ทำงานที่เบิกแล้ว",
      render: (emp: any) => {
        return emp.withdrawnHours
      }
    },
    {
      title: `ค่าจ้างที่เบิกได้`,
      render: (emp: any) => {
        let remainingMoney = emp.withdrawableMoney - emp.withdrawnMoney
        return '฿ ' + (remainingMoney.toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ","))
      }
    },
    {
      title: `ค่าจ้างที่เบิกแล้ว`,
      render: (emp: any) => {
        let remainingMoney = emp.withdrawnMoney
        return '฿ ' + (remainingMoney.toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ","))
      }
    },
    {
      title: "จ่ายเงิน",
      render: (emp: any) => {
        return <MoneyIcon
          color="primary"
          style={{ verticalAlign: 'middle' }}
          className="cursor-pointer"
          onClick={(e: any) => {
            e.stopPropagation()
            getEmployee({ variables: { id: emp.id } })
            setPayModal(true)
          }}
        />
      }
    },
    {
      title: "ดูประวัติการจ่าย",
      render: (emp: any) => {
        return <SearchIcon className="cursor-pointer" onClick={(e) => {
          e.stopPropagation()
          setShowViewPayment(true)
          getEmployee({ variables: { id: emp.id } })
          getPaymentHistory({ variables: { employeeId: emp.id } })
        }} />
      }
    },
  ];

  if (selectedTab === 'withdrawable') {
    columns = columns.filter((data: any) => {
      return data.title != 'ชม. ทำงานที่เบิกแล้ว' && data.title != 'ค่าจ้างที่เบิกแล้ว'
    })
  } else if (selectedTab === 'withdrawn') {
    columns = columns.filter((data: any) => {
      return data.title != 'ชม. ทำงานที่เบิกได้' && data.title != 'ค่าจ้างที่เบิกได้'
    })
  }

  const datasource = workLogsData && workLogsData.workingHistories && workLogsData.workingHistories.map((obj: any, idx: any) => {
    return {
      ...obj,
      key: idx
    }
  })
  const employee = employeeData && employeeData.employees && employeeData.employees[0]

  return (
    <Layout.Content>
      <Snackbar className="w-full" open={showSuccessMessage} autoHideDuration={4000} onClose={() => { setShowSuccessMessage(false) }}>
        <Alert onClose={() => { setShowSuccessMessage(false) }} severity="success">
          ดำเนินการสำเร็จ!
        </Alert>
      </Snackbar>
      <PayrollHeader value="payment" />
      <div className="flex flex-col flex-1">
        <div className="h-16 w-full flex items-center text-base border-b border-gray-300 pl-6 pt-4">
          <div className="w-1/6">
            การจ่ายเงิน
          </div>
          <div className="w-5/6">
            <Tabs
              value={selectedTab}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label={<div className="flex">เบิกได้ <div style={{ backgroundColor: '#DA394C' }} className="text-white rounded-full w-10 ml-2">{withdrawableEmployeeCount}</div> </div>} value='withdrawable' onClick={() => {
                setSelectedTab('withdrawable')
              }} />
              <Tab label={<div className="flex">เบิกแล้ว </div>} value='withdrawn' onClick={() => {
                setSelectedTab('withdrawn')
              }} />
              <Tab label={<div className="flex">ทั้งหมด </div>} value='all' onClick={() => {
                setSelectedTab('all')
              }} />
            </Tabs>
          </div>
        </div>
        <div className="flex items-center justify-between text-lg pt-6 pb-6">
          <div className="flex pl-4 w-1/5">
            <div>
              <MaterialButton color="primary" style={{ textTransform: "none" }}><GetAppIcon className="pr-1" /> Export</MaterialButton>
            </div>
          </div>
          <div className="flex flex-wrap pr-6 w-4/5 items-center justify-end">
            <div className="w-1/4 mr-6">
              <TextField
                className="w-full"
                label="ค้นหา"
                placeholder="ชื่อพนักงาน / เบอร์ / Line"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                }}
                onChange={(e: any) => {
                  setTextSearch(e.target.value)
                }}
              />
            </div>
          </div>
        </div>
        <div>
          <Table
            dataSource={withdrawableEmployee}
            columns={columns}
            pagination={{ position: ['bottomRight'], pageSize: 20 }}
            className="ml-8 mr-8"
            onRow={(record, rowIndex) => {
              return {
                onClick: event => {
                  getEmployee({ variables: { id: record && record.id } });
                  setDisabled(true)
                  setShowViewEmployeeModal(true)
                },
              };
            }}
          />
        </div>
      </div>
      <MaterialModal
        open={showIdCardModal}
        onClose={() => { setShowIdCardModal(false) }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div>
          <img className="absolute" style={{ width: '500px', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} src={idCard} />
        </div>
      </MaterialModal>
      <ViewPaymentModal
        showViewPayment={showViewPayment}
        setShowViewPayment={setShowViewPayment}
        setShowSuccessMessage={setShowSuccessMessage}
        setPayModal={setPayModal}
        payModel={payModel}
        setPayModel={setPayModel}
        paymentHistoryData={paymentHistoryData}
        selectedEmployee={selectedEmployee}
      />
      <ViewEmployeeInfo
        disabled={disabled}
        setDisabled={setDisabled}
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
        showViewEmployeeModal={showViewEmployeeModal}
        setShowViewEmployeeModal={setShowViewEmployeeModal}
        universities={universities}
        faculties={faculties}
        employeeWatchers={employeeWatchers}
        bank_list={bank_list}
        upsertEmployee={upsertEmployee}
        setShowSuccessMessage={setShowSuccessMessage}
        employeeLoading={employeeLoading}
      />
      <PayModal
        payModal={payModal}
        setPayModal={setPayModal}
        payModel={payModel}
        setPayModel={setPayModel}
        createPayroll={createPayroll}
        createPayrollLoading={createPayrollLoading}
        setShowSuccessMessage={setShowSuccessMessage}
        selectedEmployee={selectedEmployee}
        getEmployee={getEmployee}
      />
    </Layout.Content >
  );
};

const PayModal = (props: any) => {
  return (<MaterialModal
    open={props.payModal}
    onClose={() => { props.setPayModal(false) }}
  >
    <div className="w-1/3 bg-white p-8 absolute border-gray-300 overflow-y-scroll" style={{ maxHeight: '50%', borderRadius: '0.5rem', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
      <div className="flex items-center border-b border-gray-300 pb-6 text-base">
        จ่ายเงินให้กับ {props.payModel.employeeName}
      </div>
      <div className="pt-6">
        <div className="mb-6">
          <TextField
            className="w-full"
            label="วันที่จ่ายเงิน"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            type="date"
            defaultValue={props.payModel.payrollDate}
            key={props.payModel.payrollDate}
            onChange={(e: any) => {
              props.setPayModel({
                ...props.payModel,
                payrollDate: e.target.value
              })
            }}
          />
        </div>
        <div>
          <TextField
            autoFocus
            className="w-full"
            label="จำนวนเงิน (บาท)"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            type="number"
            defaultValue={props.payModel.paid}
            key={props.payModel.paid}
            onChange={(e: any) => {
              props.setPayModel({
                ...props.payModel,
                paid: e.target.value ? parseFloat(e.target.value) : undefined
              })
            }}
          />
        </div>

        <div className="flex items-center justify-end mt-6">
          <div className="mr-4">
            <MaterialButton
              variant="contained"
              color="primary"
              startIcon={<DoneIcon />}
              disabled={props.createPayrollLoading}
              onClick={async () => {
                if (props && props.payModel && props.payModel.paid && props.payModel.payrollDate && props.payModel.paid <= props.payModel.allMoney && props.payModel.paid > 0) {
                  let createPayrollStatus = await props.createPayroll(
                    {
                      variables: {
                        ...props.payModel,
                        payrollDate: moment(props.payModel.payrollDate, 'YYYY-MM-DD').toDate()
                      }
                    }
                  )

                  if (!props.createPayrollLoading) {
                    if (createPayrollStatus.data.createPayroll) {
                      await props.setPayModal(false)
                      await props.setShowSuccessMessage(true)
                      await props.getEmployee({
                        variables: {
                          id: props.selectedEmployee.id
                        }
                      })
                    } else {
                      alert('ไม่สามารถดำเนินการได้')
                    }
                  }

                } else {
                  alert('ไม่ใช่ยอดเงินที่จะจ่ายได้')
                }
              }}
            >
              ตกลง
          </MaterialButton>
          </div>
          <div>
            <MaterialButton
              variant="contained"
              onClick={() => {
                props.setPayModal(false)
              }}
            >
              ยกเลิก
      </MaterialButton>
          </div>
        </div>
      </div>
    </div>
  </MaterialModal >)
}

const ViewPaymentModal = (props: any) => {

  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']

  let dataSource = props && props.paymentHistoryData && props.paymentHistoryData.payrolls.map((obj: any, idx: any) => {
    return {
      ...obj,
      no: `#${idx + 1}`
    }
  }).reverse()

  const columns = [
    {
      title: "ครั้งที่",
      dataIndex: "no",
      key: "no",
      className: "w-1/12"
    },
    {
      title: "วันที่จ่ายเงิน",
      dataIndex: "payrollDate",
      key: "payrollDate",
      className: "w-1/6",
      render: (payrollDate: any) => {
        return moment(payrollDate).format('DD/MM/YYYY')
      }
    },
    {
      title: "ยอดชำระ",
      dataIndex: "paid",
      key: "paid",
      className: "w-1/6",
      render: (paid: any) => {
        return '฿ ' + (paid.toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ","))
      }
    },
    {
      title: "จ่ายให้กับ",
      dataIndex: "WorkingHistory_Payroll",
      key: "WorkingHistory_Payroll",
      className: "w-7/12",
      render: (obj: any) => {
        let description: any = []
        let i = 1
        for (let o of obj) {
          description.push(
            <Tooltip title={`เวลาทำงาน ${o.WorkingHistory.hours} ชม.`} placement="bottom">
              <div className="flex hover:text-red-700">
                <div className="mr-4">{i}) {moment(o.WorkingHistory.historyDate).format(`DD`)} {months[parseInt(moment(o.WorkingHistory.historyDate).format(`MM`)) - 1]} {moment(o.WorkingHistory.historyDate).format(`YYYY`)}</div> {o.paid}/{o.allMoney} บาท {o.paid < o.allMoney ? `(ขาด ${o.allMoney - o.paid} บาท)` : ''}
              </div>
            </Tooltip>
          )
          i++
        }
        return (
          <div className="flex w-full">
            <div className="mr-4">วันทำงาน {obj.length} วัน</div>
            <div>
              {description}
            </div>
          </div>
        )
      }
    },
  ]


  const handleClose = () => {
    props.setShowViewPayment(false)
  }

  const [createWorkLogs, { loading: createWorkLogsLoading }] = useMutation(CREATE_WORKLOGS);

  const emp = props.selectedEmployee

  return (
    <MaterialModal
      open={props.showViewPayment}
      onClose={() => { handleClose() }}
    >
      <>
        <div className="bg-white p-8 absolute border-gray-300" style={{ minHeight: '95%', maxHeight: '95%', borderRadius: '0.5rem', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '95%' }}>
          <div className="flex justify-between items-center  border-b border-gray-300 pb-6">
            <div className="flex items-center">
              <p className="mr-6 text-xl">ประวัติการจ่ายเงิน</p>
              <MaterialButton color="primary" onClick={() => {
                props.setPayModal(true)
              }} startIcon={<MoneyIcon />}>จ่ายเงิน</MaterialButton>
            </div>
          </div>
          <div className="overflow-y-scroll" style={{ maxHeight: '80vh' }}>
            <Table
              dataSource={dataSource}
              columns={columns}
            />
          </div>
        </div>
        <SnackbarContent
          className="absolute bottom-0 lef-0 w-full"
          message={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div className={`w-12 h-12 ml-4`}>
                  <img className="object-cover rounded-full" src={emp && emp.profilePictureUrl ? emp.profilePictureUrl : default_profile} />
                </div>
                <div className="ml-4">
                  {emp && emp.name} ({emp && emp.fullName}) {emp && emp.tel}
                </div>
                <div className="ml-12">
                  สรุปยอดทั้งหมด {emp && emp.withdrawnMoney} / {emp && emp.withdrawableMoney}
                </div>
              </div>
              <div onClick={() => { props.setPayModal(true) }} className="ml-64 rounded-full pl-6 pr-6 pt-4 pb-4 cursor-pointer" style={{ backgroundColor: '#DA394C' }}>
                ค้างชำระ {emp && (emp.withdrawableMoney - emp.withdrawnMoney)} บาท
              </div>
            </div>
          }
        />
      </>
    </MaterialModal >
  )
}

export default WorkLogPage;
