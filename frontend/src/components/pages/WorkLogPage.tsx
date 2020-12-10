import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { MenuItem, Button as MaterialButton, TextField, InputAdornment, Modal as MaterialModal, Popover, Snackbar, CircularProgress } from "@material-ui/core";
import { Layout, Table, Tooltip } from "antd";
import React, { useRef, useState } from "react";
import { GET_EMPLOYEE, GET_EMPLOYEES, UPSERT_EMPLOYEE, GET_UNIVERSITIES, GET_FACULTIES, GET_EMPLOYEE_WATCHERS, GET_WORKLOG, DELETE_WORKLOG, CREATE_WORKLOGS } from "../../utils/graphql";
import PayrollHeader from "./PayrollHeader";
import AddIcon from '@material-ui/icons/Add';
import GetAppIcon from '@material-ui/icons/GetApp';
import SearchIcon from '@material-ui/icons/Search';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import TodayIcon from '@material-ui/icons/Today';
import MoreVertIcon from '@material-ui/icons/MoreVert';
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
import * as XLSX from 'xlsx'
import * as FileSaver from 'file-saver'

const WorkLogPage = () => {
  const [showIdCardModal, setShowIdCardModal] = useState(false);
  const [showAddWorkLog, setShowAddWorkLog] = useState(false);
  const [showViewEmployeeModal, setShowViewEmployeeModal] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [selectedDate, handleDateChange]: any = React.useState([null, null]);
  const [idCard, setIdCard] = useState('');
  const [textSearch, setTextSearch] = useState('');
  const [selectedEmployee, setSelectedEmployee]: any = useState();
  const [deleteWorkLog] = useMutation(DELETE_WORKLOG);
  const [upsertEmployee] = useMutation(UPSERT_EMPLOYEE);

  const [getEmployee, { called, loading: employeeLoading, data: employeeData }] = useLazyQuery(GET_EMPLOYEE, {
    fetchPolicy: 'network-only',
    onCompleted: (src) => {
      const emp = src && src.employees && src.employees[0]
      setSelectedEmployee(emp)
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
  console.log('render')

  const { data: workLogsData, loading: workLogsLoading } = useQuery(GET_WORKLOG, {
    fetchPolicy: 'no-cache',
    variables: {
      textSearch: textSearch ? textSearch.trim() : '',
      fromDate: selectedDate[0] ? moment(selectedDate[0], 'MM/DD/YYYY').toDate() : undefined,
      toDate: selectedDate[1] ? moment(selectedDate[1], 'MM/DD/YYYY').toDate() : undefined
    },
    pollInterval: 1000,
    onError: (err) => {
      window.alert(err)
    }
  });

  let sumMoney = 0
  if (workLogsData) {
    for (let wl of workLogsData.workingHistories) {
      sumMoney += wl.earning
    }
  }

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
            <MenuItem disabled={props.workLog.status != 'NOT_PAID'} onClick={() => { let deleteWorkLogStatus = deleteWorkLog({ variables: { id: workLogId } }); if (deleteWorkLogStatus) { setShowSuccessMessage(true); } }}>ลบ</MenuItem>
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

  const columns = [
    {
      title: "",
      dataIndex: "employee",
      key: "employee",
      render: (emp: any) => {
        return (
          <Tooltip title={emp && emp.profilePictureUrl ? 'คลิกเพื่อดูรูป' : ''} placement="bottom">
            <div className={`w-12 h-12 ${emp && emp.profilePictureUrl ? 'cursor-pointer' : ''}`} onClick={(e: any) => {
              e.stopPropagation()
              if (emp.profilePictureUrl) {
                setShowIdCardModal(true)
                setIdCard(emp && emp.profilePictureUrl)
              }
            }}
            >
              <img className="object-cover rounded-full" style={{ height: '3rem', width: '3rem' }} src={emp && emp.profilePictureUrl ? emp.profilePictureUrl : default_profile} />
            </div>
          </Tooltip>
        )
      }
    },
    {
      title: "วันที่ทำงาน",
      dataIndex: "historyDate",
      key: "historyDate",
      render: (historyDate: any) => {
        return moment(historyDate).utcOffset(7).format('DD/MM/YYYY')
      },
    },
    {
      title: "พนักงาน",
      dataIndex: "employee",
      key: "employee",
      render: (employee: any) => {
        return employee && employee.name
      }
    },
    // {
    //   title: "รูปแบบ",
    //   dataIndex: "hiringType",
    //   key: "hiringType",
    //   render: (hiringType: any) => <div>{hiringType === 'HOURLY' ? <QueryBuilderIcon className="mr-1" /> : <TodayIcon />} {hiringType === 'HOURLY' ? 'ชั่วโมง' : 'รายวัน'}</div>,
    // },
    {
      title: "ชม. ทำงาน",
      dataIndex: "hours",
      key: "hours",
    },
    // {
    //   title: "อัตราค่าจ้าง",
    //   dataIndex: "earningRate",
    //   key: "earningRate",
    // },
    {
      title: "ค่าจ้างทั้งหมด",
      dataIndex: "earning",
      key: "earning",
    },
    {
      title: "ที่มา",
      dataIndex: "sourceType",
      key: "sourceType",
      render: (sourceType: any) => {
        return sourceType === 'MANUAL' ? 'Manual' : 'Face Scan'
      }
    },
    {
      title: "กรอกเมื่อ",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: any) => {
        return moment(createdAt).utcOffset(7).format('DD/MM/YYYY HH:mm')
      },
    },
    // {
    //   title: "เบอร์โทรศัพท์",
    //   dataIndex: "employee",
    //   key: "employee",
    //   render: (employee: any) => {
    //     return employee && employee.tel
    //   }
    // },
    {
      title: "",
      render: (workLog: any) => {
        return <MoreOptions workLog={workLog} />
      }
    },
  ];

  const datasource = workLogsData && workLogsData.workingHistories && workLogsData.workingHistories.map((obj: any, idx: any) => {
    return {
      ...obj,
      key: idx
    }
  })
  const employee = employeeData && employeeData.employees && employeeData.employees[0]

  const exportedData = workLogsData && workLogsData.workingHistories && workLogsData.workingHistories.map((d: any, i: any) => {
    return {
      ลำดับ: i + 1,
      'วันที่ทำงาน': moment(d.historyDate).format('DD/MM/YYYY'),
      พนักงาน: d.employee.name,
      'ชม. ทำงาน': d.hours,
      'ค่าจ้างทั้งหมด': d.earning,
      'ที่มา': d.sourceType,
      'กรอกเมื่อ': moment(d.createdAt).format('DD/MM/YYYY HH:mm')
    }
  })


  return (
    <Layout.Content>
      <Snackbar className="w-full" open={showSuccessMessage} autoHideDuration={4000} onClose={() => { setShowSuccessMessage(false) }}>
        <Alert onClose={() => { setShowSuccessMessage(false) }} severity="success">
          ดำเนินการสำเร็จ!
        </Alert>
      </Snackbar>
      <PayrollHeader value="worklog" />
      <div className="flex flex-col flex-1">
        <div className="h-16 w-full flex items-center justify-between text-base border-b border-gray-300 pl-6 pt-4 pr-6">
          <div>
            บันทึกการทำงาน
          </div>
          <div className="font-bold">
            ยอดเงินรวม : ฿ {sumMoney.toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </div>
        </div>
        <div className="flex items-center justify-between text-lg pt-6 pb-6">
          <div className="flex pl-4 w-1/5">
            <div className="mr-2">
              <MaterialButton color="primary"
                onClick={() => {
                  setShowAddWorkLog(true)
                }}
              ><AddIcon className="pr-1" /> เพิ่มบันทึกการทำงาน</MaterialButton>
            </div>
            <div>
              <ExportExcelData
                data={exportedData}
                date={moment().format('DD-MM-YYYY')}
              />
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
            <div className="w-1/3">
              <BasicDateRangePicker
                selectedDate={selectedDate}
                handleDateChange={handleDateChange}
              />
            </div>
          </div>
        </div>
        <div>
          <Table
            dataSource={datasource}
            columns={columns}
            pagination={{ position: ['bottomRight'], pageSize: 20 }}
            className="ml-8 mr-8"
            onRow={(record, rowIndex) => {
              return {
                onClick: event => {
                  getEmployee({ variables: { id: record && record.employee && record.employee.id } });
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
      <AddWorkLogModal
        showAddWorkLog={showAddWorkLog}
        setShowAddWorkLog={setShowAddWorkLog}
        setShowSuccessMessage={setShowSuccessMessage}
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
    </Layout.Content >
  );
};

const AddWorkLogModal = (props: any) => {

  const [dataSource, setDataSource]: any = useState(() => {
    let tmp = []
    for (let i = 0; i < 30; i++) {
      tmp.push({
        key: i,
        no: i + 1,
        historyDate: undefined,
        employee: undefined,
        hours: undefined,
        earning: undefined,
        earningRate: undefined,
        validate: false
      });
    }
    return tmp
  })

  const { data: employeesData, loading: employeesLoading } = useQuery(GET_EMPLOYEES, {
    fetchPolicy: 'no-cache',
    variables: {
      statusSearch: 'ACTIVE'
    },
    pollInterval: 1000,
    onError: (err) => {
      window.alert(err)
    }
  });

  let employees = employeesData && employeesData.employees

  const validate = (fields: any) => {
    if (fields.historyDate && fields.employee && fields.hours && fields.earning) {
      return true
    } else {
      return false
    }
  }

  const myRefs: any = useRef([]);

  const columns = [
    {
      title: "",
      dataIndex: "no",
      key: "no",
      width: "10px"
    },
    {
      title: "วันที่",
      className: "w-1/8",
      render: (workLog: any) => {
        return <TextField
          className="w-full"
          label="วันที่ทำงาน"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          defaultValue={workLog && workLog.historyDate}
          key={workLog && workLog.historyDate}
          onChange={(e: any) => {
            if (e.target.value) {
              if (parseInt(e.target.value.substr(0, 4)) >= 2020) {
                myRefs.current[workLog.key].click()
              }
            }
          }}
          onBlur={(e: any) => {
            dataSource[workLog.key] = {
              ...workLog,
              historyDate: e.target.value,
              validate: validate({
                ...workLog,
                historyDate: e.target.value,
              })
            }
            setDataSource([...dataSource])
            console.log(dataSource)
          }}
          onFocus={async (e: any) => {
            if (myRefs.current[workLog.key - 1]) {
              if (dataSource[workLog.key - 1].historyDate) {
                dataSource[workLog.key] = {
                  ...dataSource[workLog.key],
                  historyDate: dataSource[workLog.key - 1].historyDate
                }
              }
            }

            await setDataSource([...dataSource])
          }
          }
        />
      }
    },
    {
      title: "พนักงาน",
      className: "w-1/6",
      render: (workLog: any) => {
        return employees ? <Autocomplete
          options={employees && employees.map((option: any) => option.name)}
          autoHighlight={true}
          renderInput={(params) => (
            <TextField {...params}
              className="w-full"
              ref={el => (myRefs.current[workLog.key] = el)}
              autoFocus={workLog.autoFocus}
              label="พนักงาน"
              InputLabelProps={{ shrink: true, }}
              onBlur={(e: any) => {
                if (e.target.value) {
                  let emp = employees.find((element: any) => element.name === e.target.value)
                  if (emp) {
                    let calculatedEarning: any = undefined
                    if (emp && emp.hiringType) {
                      if (emp.hiringType === 'HOURLY') {
                        if (workLog.hours) {
                          calculatedEarning = emp.earning * parseFloat(workLog.hours)
                        }
                      } else {
                        calculatedEarning = emp.earning
                      }
                    }
                    dataSource[workLog.key] = {
                      ...workLog,
                      employee: e.target.value,
                      hiringType: emp && emp.hiringType,
                      earningRate: emp && emp.earning,
                      earning: calculatedEarning,
                      validate: validate({
                        ...workLog,
                        employee: e.target.value,
                        hiringType: emp && emp.hiringType,
                        earningRate: emp && emp.earning,
                        earning: calculatedEarning,
                      })
                    }
                    setDataSource([...dataSource])
                    console.log(dataSource)
                  }
                }
              }
              }
            />
          )}
          key={workLog && workLog.employee}
          defaultValue={workLog && workLog.employee}
        /> : <CircularProgress />
      }
    },
    {
      title: "ชม. ทำงาน",
      key: "hours",
      className: "w-1/8",
      render: (workLog: any) => {
        return <TextField
          className="w-full"
          label="จำนวน ชม. (Enter)"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          defaultValue={workLog && workLog.hours}
          key={workLog && workLog.hours}
          onKeyDown={async (e: any) => {
            if (e.keyCode === 13) {
              if (e.target.value) {
                let calculatedEarning: any = undefined
                if (workLog.hiringType) {
                  if (workLog.hiringType === 'HOURLY') {
                    if (e.target.value && parseFloat(e.target.value)) {
                      calculatedEarning = workLog.earningRate * parseFloat(e.target.value)
                    }
                  } else {
                    calculatedEarning = workLog.earningRate
                  }
                }
                dataSource[workLog.key] = {
                  ...workLog,
                  earning: calculatedEarning,
                  hours: parseFloat(e.target.value),
                  validate: validate({
                    ...workLog,
                    earning: calculatedEarning,
                    hours: parseFloat(e.target.value),
                  })
                }
                await setDataSource([...dataSource])
              }

              if (myRefs.current[workLog.key + 1]) {
                myRefs.current[workLog.key + 1].click()
                if (dataSource[workLog.key].historyDate) {
                  dataSource[workLog.key + 1] = {
                    ...dataSource[workLog.key + 1],
                    historyDate: dataSource[workLog.key].historyDate
                  }
                }
              }

              await setDataSource([...dataSource])
              console.log(dataSource)
            }
          }}
          onBlur={async (e: any) => {
            if (e.target.value) {
              let calculatedEarning: any = undefined
              if (workLog.hiringType) {
                if (workLog.hiringType === 'HOURLY') {
                  if (e.target.value && parseFloat(e.target.value)) {
                    calculatedEarning = workLog.earningRate * parseFloat(e.target.value)
                  }
                } else {
                  calculatedEarning = workLog.earningRate
                }
              }
              dataSource[workLog.key] = {
                ...workLog,
                hours: parseFloat(e.target.value),
                validate: validate({
                  ...workLog,
                  hours: parseFloat(e.target.value),
                })
              }
              await setDataSource([...dataSource])
              console.log(dataSource)
            }
          }
          }
        />
      }
    },
    {
      title: "ค่าจ้าง",
      className: "w-1/8",
      render: (workLog: any) => {
        return <TextField
          className="w-full"
          label="ค่าจ้าง"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          defaultValue={workLog && workLog.earning}
          key={workLog && workLog.earning}
          onBlur={(e: any) => {
            dataSource[workLog.key] = {
              ...workLog,
              earning: e.target.value ? parseFloat(e.target.value) : undefined,
              validate: validate({
                ...workLog,
                earning: e.target.value ? parseFloat(e.target.value) : undefined,
              })
            }
            setDataSource([...dataSource])
            console.log(dataSource)
          }
          }
        />
      }
    },
    {
      title: "รูปแบบ",
      className: "w-1/8",
      dataIndex: "hiringType",
      key: "hiringType",
      render: (hiringType: any) => {
        return <div>{hiringType === 'HOURLY' ? <QueryBuilderIcon className="mr-1" /> : hiringType === 'DAILY' ? <TodayIcon /> : undefined} {hiringType === 'HOURLY' ? 'ชั่วโมง' : hiringType === 'DAILY' ? 'รายวัน' : undefined}</div>
      }
    },
    {
      title: "อัตราค่าจ้าง",
      className: "w-1/8",
      dataIndex: "earningRate",
      key: "earningRate"
    },
    {
      title: "",
      className: "w-1/8",
      dataIndex: "validate",
      key: "validate",
      render: (validate: any) => {
        return validate ? <div style={{ color: '#00AE26' }}><CheckIcon /> ข้อมูลถูกต้อง</div> : <div style={{ color: 'rgb(0,0,0,0.23)' }}>คุณกรอกข้อมูลไม่ครบถ้วน</div>
      }
    },
    {
      title: "",
      align: "right" as "right",
      render: (workLog: any) => {
        return <CancelOutlinedIcon onClick={(e: any) => {
          dataSource[workLog.key] = {
            ...workLog,
            historyDate: undefined,
            employee: undefined,
            hours: undefined,
            earning: undefined,
            hiringType: undefined,
            earningRate: undefined,
            validate: false,
          }
          setDataSource([...dataSource])
          console.log(dataSource)
        }} className="cursor-pointer" />
      }
    },
  ]

  const addTable = () => {
    let tmpDataSource = []
    let lastNo = dataSource.length
    for (let i = lastNo; i < lastNo + 30; i++) {
      tmpDataSource.push({
        key: i,
        no: i + 1,
        historyDate: null,
        employee: null,
        hours: null,
        earning: null,
        earningRate: null,
        validate: false
      });
    }
    setDataSource([...dataSource, ...tmpDataSource])
  }

  const handleClose = () => {
    props.setShowAddWorkLog(false)
    setDataSource(() => {
      let tmp = []
      for (let i = 0; i < 30; i++) {
        tmp.push({
          key: i,
          no: i + 1,
          historyDate: undefined,
          employee: undefined,
          hours: undefined,
          earning: undefined,
          earningRate: undefined,
          validate: false
        });
      }
      return tmp
    })
  }

  const [createWorkLogs, { loading: createWorkLogsLoading }] = useMutation(CREATE_WORKLOGS);

  return (
    <MaterialModal
      open={props.showAddWorkLog}
      onClose={() => { handleClose() }}
    >
      <div className="bg-white p-8 absolute border-gray-300" style={{ minHeight: '95%', maxHeight: '95%', borderRadius: '0.5rem', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '95%' }}>
        <div className="flex justify-between items-center  border-b border-gray-300 pb-6">
          <div className="flex items-center">
            <p className="mr-6 text-xl">เพิ่มบันทึกการทำงาน</p>
            <MaterialButton color="primary" onClick={() => { addTable() }} startIcon={<PostAddIcon />}>เพิ่มตารางด้านล่าง</MaterialButton>
          </div>
          <div className="flex items-center">
            <div className="mr-6">
              <MaterialButton variant="contained" key="cancel" onClick={() => handleClose()}>
                ยกเลิก
            </MaterialButton>
            </div>
            <MaterialButton
              variant="contained"
              color="primary"
              startIcon={<DoneIcon />}
              size="large"
              disabled={createWorkLogsLoading}
              onClick={(e: any) => {
                let validatedWorkLog = dataSource && dataSource.filter((obj: any) => {
                  return obj.validate
                })

                validatedWorkLog = validatedWorkLog && validatedWorkLog.map((obj: any) => {
                  let emp = employees.find((element: any) => element.name === obj.employee)
                  return {
                    earning: obj.earning,
                    earningRate: obj.earningRate,
                    employee: {
                      connect: {
                        id: emp.id
                      }
                    },
                    hiringType: obj.hiringType,
                    historyDate: moment(obj.historyDate, "YYYY-MM-DD").toDate(),
                    hours: obj.hours,
                    sourceType: 'MANUAL',
                  }
                })

                createWorkLogs({ variables: { workLogs: validatedWorkLog } })
                handleClose()

                if (!createWorkLogsLoading) {
                  props.setShowSuccessMessage(true)
                }
              }}
            >
              ตกลง (เพิ่ม {dataSource && dataSource.filter((ds: any) => {
              return ds.validate === true
            }).length} รายการ)
            </MaterialButton>
          </div>
        </div>
        <div className="overflow-y-scroll" style={{ maxHeight: '80vh' }}>
          <Global
            styles={css`
            .w-1/8 {
              width: 12.5%;
            }
            .w-1/10 {
              width: 10%;
            }
            `}
          />
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
          />
        </div>
      </div>
    </MaterialModal >
  )
}

const BasicDateRangePicker = (props: any) => {
  const [open, setOpen]: any = useState(false)

  return (
    <LocalizationProvider dateAdapter={DateFnsUtils}>
      <DateRangePicker
        startText="วันที่ทำงานเริ่มต้น"
        endText="วันที่ทำงานสิ้นสุด"
        value={props.selectedDate}
        open={open}
        onClose={() => { setOpen(false) }}
        onChange={date => {
          if (date[0] && date[1]) {
            props.handleDateChange(date)
            if (date[0].getTime() === date[1].getTime()) {
              setOpen(false)
            }
          }
        }}
        renderInput={(startProps, endProps) => {
          return (
            <>
              <TextField
                {...startProps}
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder="DD/MM/YYYY"
                helperText=""
                value={startProps.value ? moment(startProps.value + '').format('DD/MM/YYYY') : ''}
                onClick={() => { setOpen(true) }}
                error={false}
              />
              <DateRangeDelimiter> ถึง </DateRangeDelimiter>
              <TextField
                {...endProps}
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder="DD/MM/YYYY"
                helperText=""
                value={endProps.value ? moment(endProps.value + '').format('DD/MM/YYYY') : ''}
                onClick={() => { setOpen(true) }}
                error={false}
              />
            </>
          )
        }
        }
      />
    </LocalizationProvider>
  );
}

const ExportExcelData = (props: any) => {
  const [clickExport, setClickExport] = useState(false)

  const data = props.data
  const date = props.date

  if (clickExport) {
    setClickExport(false)
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    let fileName = 'WorkLog_' + date
    if (!fileName) {
      fileName = 'export_' + window.location.pathname
    }
    try {
      const ws = XLSX.utils.json_to_sheet(data || []);
      const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const b = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(b, fileName + fileExtension);
    } catch (ex) {
      const ws = XLSX.utils.json_to_sheet([]);
      const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const b = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(b, fileName + fileExtension);
    }
  }
  return (
    <MaterialButton
      color="primary"
      style={{ textTransform: "none" }}
      onClick={() => {
        setClickExport(true)
      }}
    >
      <GetAppIcon className="pr-1" />
      Export
    </MaterialButton>
  )
}

export default WorkLogPage;
