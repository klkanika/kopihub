import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { AppBar, BottomNavigation, BottomNavigationAction, MenuItem, MenuList, Paper, Tab, Tabs, Button as MaterialButton, TextField, InputAdornment, FormControl, Select as MaterialSelect, InputLabel, NativeSelect, InputBase, withStyles, Modal as MaterialModal, Popover } from "@material-ui/core";
import { Button, Layout, Table, Form, Input, Select, Modal, Tag, Tooltip, Typography } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useState } from "react";
import { CREATE_EMPLOYEE, GET_EMPLOYEE, GET_EMPLOYEES, DELETE_EMPLOYEE, UPSERT_EMPLOYEE, GET_UNIVERSITIES, GET_FACULTIES, GET_EMPLOYEE_WATCHERS } from "../../utils/graphql";
import PayrollHeader from "./PayrollHeader";
import AddIcon from '@material-ui/icons/Add';
import GetAppIcon from '@material-ui/icons/GetApp';
import SearchIcon from '@material-ui/icons/Search';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import TodayIcon from '@material-ui/icons/Today';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import RecentActorsIcon from '@material-ui/icons/RecentActors';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import moment from "moment"
import bank_bay from '../../imgs/bank_bay.svg';
import bank_bbl from '../../imgs/bank_bbl.svg';
import bank_kbank from '../../imgs/bank_kbank.svg';
import bank_ktb from '../../imgs/bank_ktb.svg';
import bank_scb from '../../imgs/bank_scb.svg';
import default_profile from '../../imgs/profile.png';
import { Autocomplete } from "@material-ui/lab";

const EmployeePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showIdCardModal, setShowIdCardModal] = useState(false);
  const [showViewEmployeeModal, setShowViewEmployeeModal] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [idCard, setIdCard] = useState('');
  const [textSearch, setTextSearch] = useState();
  const [statusSearch, setStatusSearch] = useState('ACTIVE');
  const [hiringTypeSearch, setHiringTypeSearch] = useState('ALL');
  const [employDateSearch, setEmployDateSearch] = useState('ALL');
  const [fromCreatedDate, setFromCreatedDate]: any = useState();
  const [toCreatedDate, setToCreatedDate]: any = useState();
  const [selectedEmployee, setSelectedEmployee]: any = useState();
  const [form] = useForm();
  const [editForm] = useForm();
  // const [createEmployee, { loading: createEmployeeLoading }] = useMutation(CREATE_EMPLOYEE);
  const [deleteEmployee, { loading: deleteEMployeeLoading }] = useMutation(DELETE_EMPLOYEE);
  const [upsertEmployee, { loading: upsertEmployeeLoading }] = useMutation(UPSERT_EMPLOYEE);

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

  const { data: employeesData, loading: employeesLoading } = useQuery(GET_EMPLOYEES, {
    fetchPolicy: 'no-cache',
    variables: {
      textSearch: textSearch,
      statusSearch: statusSearch && statusSearch === 'ALL' ? null : statusSearch,
      hiringTypeSearch: hiringTypeSearch && hiringTypeSearch === 'ALL' ? null : hiringTypeSearch,
      fromCreatedDate: fromCreatedDate ? fromCreatedDate : undefined,
      toCreatedDate: toCreatedDate ? toCreatedDate : undefined,
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
    let emp = props.emp
    let empId = emp.id
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
            <MenuItem
              onClick={() => {
                getEmployee({ variables: { id: empId } });
                setDisabled(false)
                setShowViewEmployeeModal(true)
              }
              }
            >แก้ไข</MenuItem>
            {emp.status === 'ACTIVE' ? <MenuItem onClick={() => { deleteEmployee({ variables: { id: empId } }) }}>ลบ</MenuItem> : ''}
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

  // const columns = [
  //   {
  //     title: "ชื่อ",
  //     dataIndex: "name",
  //     key: "name",
  //     width: "20%",
  //   },
  //   {
  //     title: "ประเภทการจ้าง",
  //     dataIndex: "hiringType",
  //     key: "hiringType",
  //     width: "20%",
  //     render: (hiringType: String) => hiringType === 'HOURLY' ? < Tag color="green" > รายชั่วโมง</Tag > :
  //       hiringType === 'DAILY' ? <Tag color="blue">รายวัน</Tag> :
  //         hiringType === 'MONTHLY' ? <Tag color="purple">รายเดือน</Tag> :
  //           <Tag color="red">ไม่ทราบ</Tag>
  //   },
  //   {
  //     title: "ค่าจ้าง",
  //     dataIndex: "earning",
  //     key: "earning",
  //     width: "20%",
  //     render: (earning: any) => <div>
  //       {earning.toFixed(2)
  //         .toString()
  //         .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} บาท</div>,
  //   },
  //   {
  //     title: "ตัวเลือก",
  //     dataIndex: "id",
  //     key: "id",
  //     width: "60%",
  //     render: (id: any) => (
  //       <div>
  //         <Button type="primary" className="mr-4" onClick={() => { getEmployee({ variables: { id: id } }); setShowEditModal(true); }}>
  //           แก้ไข
  //         </Button>
  //         <Button onClick={() => { deleteEmployee({ variables: { id: id } }) }}>
  //           ลบ
  //         </Button>
  //       </div>
  //     ),
  //   },
  // ];

  const columns = [
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      align: 'center' as 'center',
      render: (status: any) => (
        <Tooltip title={status === 'ACTIVE' ? 'ทำงานอยู่' : 'เลิกจ้างแล้ว'} placement="bottom">
          <div className="rounded-full w-4 h-4 m-auto" style={{ backgroundColor: status === 'ACTIVE' ? '#4C6EE4' : '#D6D6D6' }}></div>
        </Tooltip>
      ),
      sorter: (a: any, b: any) => {
        return b.hiringType.localeCompare(a.hiringType)
      },
    },
    {
      title: "",
      dataIndex: "profilePictureUrl",
      key: "profilePictureUrl",
      render: (profilePictureUrl: any) => {
        return (
          <Tooltip title={profilePictureUrl ? 'คลิกเพื่อดูรูป' : ''} placement="bottom">
            <div className={`w-12 h-12 ${profilePictureUrl ? 'cursor-pointer' : ''}`} onClick={(e: any) => {
              e.stopPropagation()
              if (profilePictureUrl) {
                setShowIdCardModal(true)
                setIdCard(profilePictureUrl)
              }
            }}>
              <img className="object-cover rounded-full" src={profilePictureUrl ? profilePictureUrl : default_profile} />
            </div>
          </Tooltip>
        )
      }
    },
    {
      title: "ชื่อเล่น",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "ชื่อ-นามสกุล",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "",
      key: "emp",
      render: (emp: any) => {
        return (
          <Tooltip title={(emp.idCardPictureUrl ? 'ดู' : 'ไม่มี') + 'บัตรประชาชน'} placement="bottom">
            {emp.idCardPictureUrl ?
              <RecentActorsIcon className="cursor-pointer" onClick={(e: any) => {
                e.stopPropagation()
                if (emp.idCardPictureUrl) {
                  setShowIdCardModal(true)
                  setIdCard(emp.idCardPictureUrl)
                }
              }} color="primary" /> :
              <RecentActorsIcon color="disabled" onClick={(e: any) => {
                e.stopPropagation()
              }} />}
          </Tooltip>
        )
      }
    },
    {
      title: "เบอร์โทรศัพท์",
      dataIndex: "tel",
      key: "tel",
    },
    {
      title: "ไลน์",
      dataIndex: "lineId",
      key: "lineId",
    },
    {
      title: "บัญชีธนาคาร",
      render: (emp: any) => {
        let bankLogo = bank_list.find(element => element.bank === emp.bank)

        return (
          emp.bank && emp.bankAccount ?
            <div className="flex items-center">
              {bankLogo && bankLogo.img ? bankLogo.img : ''}
              {emp.bankAccount}
            </div>
            : ''
        )
      }
    },
    {
      title: "ปีที่ทำงาน",
      render: (emp: any) => {
        let createdAt = emp.createdAt
        var currentDate = moment();
        var createdAtDate = moment(createdAt);

        var years = currentDate.diff(createdAtDate, 'year');
        createdAtDate.add(years, 'years');

        var months = currentDate.diff(createdAtDate, 'months');
        createdAtDate.add(months, 'months');

        var days = currentDate.diff(createdAtDate, 'days');

        return (years ? years + ' ปี ' : '') + (months ? months + ' เดือน ' : '') + days + ' วัน'
      },
      sorter: (a: any, b: any) => {
        return moment(b.createdAt).startOf('day').diff(moment(a.createdAt).startOf('day'))
      },
    },
    {
      title: "รูปแบบ",
      dataIndex: "hiringType",
      key: "hiringType",
      render: (hiringType: any) => <div>{hiringType === 'HOURLY' ? <QueryBuilderIcon className="mr-1" /> : <TodayIcon />} {hiringType === 'HOURLY' ? 'ชั่วโมง' : 'รายวัน'}</div>,
      sorter: (a: any, b: any) => {
        return b.hiringType.localeCompare(a.hiringType)
      },
    },
    {
      title: "เริ่มงานวันแรก",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: any) => {
        return moment(createdAt).utcOffset(7).format('DD/MM/YYYY')
      },
      sorter: (a: any, b: any) => {
        return moment(a.createdAt).startOf('day').diff(moment(b.createdAt).startOf('day'))
      },
    },
    {
      title: "",
      render: (emp: any) => {
        return <MoreOptions emp={emp} />
      }
    },
  ];

  const datasource = employeesData && employeesData.employees
  const employee = employeeData && employeeData.employees && employeeData.employees[0]

  const onFinish = (values: any) => {
    console.log('create', values);
    // createEmployee({
    //   variables: {
    //     name: values.name,
    //     hiringType: values.type,
    //     earning: parseFloat(values.earning),
    //     university: values.university,
    //     faculty: values.faculty
    //   }
    // })
    form.resetFields();
    setShowModal(false);
  };

  const onFinishEdit = (values: any) => {
    console.log('update', values);
    // updateEmployee({
    //   variables: {
    //     id: employee && employee.id,
    //     name: values.name,
    //     hiringType: values.type,
    //     earning: parseFloat(values.earning),
    //     university: values.university ? values.university : null,
    //     faculty: values.faculty ? values.faculty : null
    //   }
    // })
    editForm.resetFields();
    setShowEditModal(false);
  };

  return (
    <Layout.Content>
      <PayrollHeader value="employee" />
      <div className="flex flex-col flex-1">
        <div className="h-16 w-full flex items-center text-base border-b border-gray-300 pl-6 pt-4">
          รายชื่อพนักงาน
        </div>
        <div className="flex items-center justify-between text-lg pt-6 pb-6">
          <div className="flex pl-4 w-1/5">
            <div className="mr-2">
              <MaterialButton color="primary"
                onClick={() => {
                  setSelectedEmployee(null)
                  setDisabled(false)
                  setShowViewEmployeeModal(true)
                }}
              ><AddIcon className="pr-1" /> เพิ่มข้อมูลพนักงาน</MaterialButton>
            </div>
            <div>
              <MaterialButton color="primary" style={{ textTransform: "none" }}><GetAppIcon className="pr-1" /> Export</MaterialButton>
            </div>
          </div>
          <div className="flex flex-wrap pr-6 w-4/5 items-center justify-end">
            <div className="w-1/4">
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

            <div className="w-1/6 ml-4">
              <FormControl variant="outlined" className="w-full">
                <InputLabel htmlFor="outlined-status-native-simple">สถานะ</InputLabel>
                <MaterialSelect
                  label="สถานะ"
                  inputProps={{
                    name: 'status',
                    id: 'outlined-status-native-simple',
                  }}
                  onChange={(e: any) => {
                    setStatusSearch(e.target.value)
                  }}
                  value={statusSearch ? statusSearch : " "}
                >
                  <MenuItem value={"ALL"}>ทั้งหมด</MenuItem>
                  <MenuItem value={"ACTIVE"}>ทำงานอยู่</MenuItem>
                  <MenuItem value={"DELETED"}>เลิกจ้าง</MenuItem>
                </MaterialSelect>
              </FormControl>
            </div>

            <div className="w-1/6 ml-4">
              <FormControl variant="outlined" className="w-full">
                <InputLabel htmlFor="outlined-hiring-type-native-simple">รูปแบบ</InputLabel>
                <MaterialSelect
                  label="รูปแบบ"
                  inputProps={{
                    name: 'hiring-type',
                    id: 'outlined-hiring-type-native-simple',
                  }}
                  onChange={(e: any) => {
                    setHiringTypeSearch(e.target.value)
                  }}
                  value={hiringTypeSearch}
                >
                  <MenuItem value={"ALL"}>ทั้งหมด</MenuItem>
                  <MenuItem value={"HOURLY"}>รายชั่วโมง</MenuItem>
                  <MenuItem value={"DAILY"}>รายวัน</MenuItem>
                </MaterialSelect>
              </FormControl>
            </div>

            <div className="w-1/6 ml-4">
              <FormControl variant="outlined" className="w-full">
                <InputLabel htmlFor="outlined-hiring-type-native-simple">อายุงาน</InputLabel>
                <MaterialSelect
                  label="รูปแบบ"
                  inputProps={{
                    name: 'hiring-type',
                    id: 'outlined-hiring-type-native-simple',
                  }}
                  value={employDateSearch}
                  onChange={(e: any) => {
                    setEmployDateSearch(e.target.value)
                    if (e.target.value !== 'ALL') {
                      let crease = e.target.value.charAt(0)
                      let digit = parseInt(e.target.value.charAt(1))
                      let unit = e.target.value.substring(2)
                      if (crease === '-') {
                        setFromCreatedDate(moment().utcOffset(7).startOf('day').subtract(digit, unit === 'months' ? 'months' : 'year').toDate())
                        setToCreatedDate(moment().utcOffset(7).startOf('day').toDate())
                      } else {
                        setFromCreatedDate(undefined)
                        setToCreatedDate(moment().utcOffset(7).startOf('day').subtract(digit, unit === 'months' ? 'months' : 'year').toDate())
                      }
                    } else {
                      setFromCreatedDate(undefined)
                      setToCreatedDate(undefined)
                    }
                  }}
                >
                  <MenuItem value={"ALL"}>ทั้งหมด</MenuItem>
                  <MenuItem value={'-3months'}>{'< 3 เดือน'}</MenuItem>
                  <MenuItem value={'-6months'}>{'< 6 เดือน'}</MenuItem>
                  <MenuItem value={'-1year'}>{'< 1 ปี'}</MenuItem>
                  <MenuItem value={'+1year'}>{'1 ปี +'}</MenuItem>
                </MaterialSelect>
              </FormControl>
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
                  getEmployee({ variables: { id: record.id } });
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
      />
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
          <Form.Item
            name="university"
            label="มหาวิทยาลัย"
          >
            <Input placeholder="มหาวิทยาลัยบูรพา" />
          </Form.Item>
          <Form.Item
            name="faculty"
            label="คณะ"
          >
            <Input placeholder="คณะการจัดการ และการท่องเที่ยว" />
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
          <Form.Item
            name="university"
            label="มหาวิทยาลัย"
          >
            <Input placeholder="มหาวิทยาลัยบูรพา" />
          </Form.Item>
          <Form.Item
            name="faculty"
            label="คณะ"
          >
            <Input placeholder="คณะการจัดการ และการท่องเที่ยว" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout.Content >
  );
};

const ViewEmployeeInfo = (props: any) => {
  const disabled = props.disabled
  const selectedEmployee = props.selectedEmployee
  const showViewEmployeeModal = props.showViewEmployeeModal
  const [updatedObject, setUpdatedObject]: any = useState({})
  return (
    <MaterialModal
      open={showViewEmployeeModal}
      onClose={() => { props.setShowViewEmployeeModal(false) }}
      aria-labelledby="employee-view"
      aria-describedby="employee-view"
    >
      <div className="w-11/12 bg-white p-8 absolute border-gray-300 overflow-y-scroll" style={{ minHeight: '95%', maxHeight: '95%', borderRadius: '0.5rem', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
        <div className="flex items-center border-b border-gray-300 pb-6">
          <p className="mr-6 text-xl">{disabled ? '' : selectedEmployee ? 'แก้ไข' : 'เพิ่ม'}ข้อมูลพนักงาน</p>
          {disabled ? <MaterialButton color="primary" startIcon={<EditIcon />} onClick={() => { props.setDisabled(false) }}>แก้ไขข้อมูล</MaterialButton> : ''}
        </div>
        <div className="p-4 flex w-full items-start">
          <div id="employee-info" className="flex flex-wrap w-1/2 pr-4">
            <div className="border-gray-300 border-b text-gray-600 text-base pb-4 mb-6 w-full">
              ข้อมูลพนักงาน
              </div>
            <div className="pr-4 mb-6 w-1/2">
              <TextField
                required
                className="w-full"
                label="ชื่อเล่น"
                placeholder="ชื่อเล่นพนักงาน"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                defaultValue={selectedEmployee && selectedEmployee.name}
                key={selectedEmployee && selectedEmployee.name}
                disabled={disabled}
                onChange={(e: any) => {
                  setUpdatedObject({
                    ...updatedObject,
                    name: e.target.value
                  })
                }}
              />
            </div>
            <div className="pr-4 mb-6 w-1/2">
              <TextField
                required
                className="w-full"
                label="ชื่อ-นามสกุล"
                placeholder="ชื่อ-นามสกุลพนักงาน"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                defaultValue={selectedEmployee && selectedEmployee.fullName}
                key={selectedEmployee && selectedEmployee.fullName}
                disabled={disabled}
                onChange={(e: any) => {
                  setUpdatedObject({
                    ...updatedObject,
                    fullName: e.target.value
                  })
                }}
              />
            </div>
            <div className="pr-4 mb-6 w-1/2">
              <TextField
                className="w-full"
                label="เบอร์โทรศัพท์"
                placeholder="เบอร์โทรศัพท์พนักงาน"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                defaultValue={selectedEmployee && selectedEmployee.tel}
                key={selectedEmployee && selectedEmployee.tel}
                disabled={disabled}
                onChange={(e: any) => {
                  setUpdatedObject({
                    ...updatedObject,
                    tel: e.target.value
                  })
                }}
              />
            </div>
            <div className="pr-4 mb-6 w-1/2">
              <TextField
                className="w-full"
                label="Line ID"
                placeholder="ไลน์ไอดีพนักงาน"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                defaultValue={selectedEmployee && selectedEmployee.lineId}
                key={selectedEmployee && selectedEmployee.lineId}
                disabled={disabled}
                onChange={(e: any) => {
                  setUpdatedObject({
                    ...updatedObject,
                    lineId: e.target.value
                  })
                }}
              />
            </div>
            <div className="pr-4 mb-6 w-full">
              <TextField
                className="w-full"
                label="ที่อยู่"
                placeholder="ที่อยู่พนักงาน"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                defaultValue={selectedEmployee && selectedEmployee.address}
                key={selectedEmployee && selectedEmployee.address}
                disabled={disabled}
                onChange={(e: any) => {
                  setUpdatedObject({
                    ...updatedObject,
                    address: e.target.value
                  })
                }}
              />
            </div>
            <div className="pr-4 mb-6 w-1/2">
              <Autocomplete
                freeSolo
                options={props.universities && props.universities.universities && props.universities.universities.map((option: any) => option.name)}
                renderInput={(params) => <TextField {...params} label="มหาวิทยาลัย" placeholder="ชื่อมหาวิทยาลัย" variant="outlined" InputLabelProps={{ shrink: true, }} />}
                defaultValue={selectedEmployee && selectedEmployee.university && selectedEmployee.university.name}
                key={selectedEmployee && selectedEmployee.university && selectedEmployee.university.name}
                disabled={disabled}
                onInputChange={(e: any) => {
                  setUpdatedObject({
                    ...updatedObject,
                    university: e && e.target && e.target.value
                  })
                }}
                onChange={(e: any, data: any) => {
                  setUpdatedObject({
                    ...updatedObject,
                    universityName: data
                  })
                }}
              />
            </div>
            <div className="pr-4 mb-6 w-1/2">
              <Autocomplete
                freeSolo
                options={props.faculties && props.faculties.faculties && props.faculties.faculties.map((option: any) => option.name)}
                renderInput={(params) => <TextField {...params} label="คณะ" placeholder="ชื่อคณะ" variant="outlined" InputLabelProps={{ shrink: true, }} />}
                defaultValue={selectedEmployee && selectedEmployee.faculty && selectedEmployee.faculty.name}
                key={selectedEmployee && selectedEmployee.faculty && selectedEmployee.faculty.name}
                disabled={disabled}
                onInputChange={(e: any) => {
                  setUpdatedObject({
                    ...updatedObject,
                    faculty: e && e.target && e.target.value
                  })
                }}
                onChange={(e: any, data: any) => {
                  setUpdatedObject({
                    ...updatedObject,
                    facultyName: data
                  })
                }}
              />
            </div>
            <div className="pr-4 mb-6 w-1/2">
              <FormControl required variant="outlined" className="w-full">
                <InputLabel htmlFor="outlined-hiring-type-native-simple">รูปแบบ</InputLabel>
                <MaterialSelect
                  label="รูปแบบ"
                  inputProps={{
                    name: 'hiring-type-view',
                  }}
                  defaultValue={selectedEmployee && selectedEmployee.hiringType === 'DAILY' ? 'DAILY' : 'HOURLY'}
                  key={selectedEmployee && selectedEmployee.hiringType === 'DAILY' ? 'DAILY' : 'HOURLY'}
                  disabled={disabled}
                  onChange={(e: any) => {
                    setUpdatedObject({
                      ...updatedObject,
                      hiringType: e.target.value
                    })
                  }}
                >
                  <MenuItem value={'HOURLY'}>รายชั่วโมง</MenuItem>
                  <MenuItem value={'DAILY'}>รายวัน</MenuItem>
                </MaterialSelect>
              </FormControl>
            </div>
            <div className="pr-4 mb-6 w-1/2">
              <TextField
                required
                className="w-full"
                label="ค่าจ้าง"
                placeholder="ค่าจ้าง (บาท)"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                defaultValue={selectedEmployee && selectedEmployee.earning}
                key={selectedEmployee && selectedEmployee.earning}
                disabled={disabled}
                onChange={(e: any) => {
                  setUpdatedObject({
                    ...updatedObject,
                    earning: parseFloat(e.target.value)
                  })
                }}
              />
            </div>
            <div className={`flex mt-12 ${disabled ? 'hidden' : ''}`}>
              <div className="mr-4">
                <MaterialButton
                  variant="contained"
                  color="primary"
                  startIcon={<DoneIcon />}
                  onClick={async () => {
                    const variables = {
                      hiringType: 'HOURLY',
                      ...selectedEmployee,
                      universityName: selectedEmployee && selectedEmployee.university && selectedEmployee.university.name,
                      facultyName: selectedEmployee && selectedEmployee.faculty && selectedEmployee.faculty.name,
                      employeeWatcherName: selectedEmployee && selectedEmployee.employeeWatcher && selectedEmployee.employeeWatcher.name,
                      employeeWatcherTel: selectedEmployee && selectedEmployee.employeeWatcher && selectedEmployee.employeeWatcher.tel,
                      ...updatedObject
                    }

                    console.log(variables.name, variables.fullName, variables.hiringType, variables.earning)
                    if (variables.name && variables.fullName && variables.hiringType && variables.earning) {
                      props.setShowViewEmployeeModal(false)
                      await props.upsertEmployee({
                        variables: variables
                      })
                    } else {
                      alert('กรุณากรอกข้อมูลให้ครบถ้วน')
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
                    props.setShowViewEmployeeModal(false)
                  }}
                >
                  ยกเลิก
                </MaterialButton>
              </div>
            </div>
          </div>
          <div id="other-info" className="flex flex-wrap w-1/2 pl-4">
            <div className="border-gray-300 border-b text-gray-600 text-base pb-4 mb-6 w-full">
              ข้อมูลธนาคาร
              </div>
            <div className="pr-4 mb-6 w-1/2">
              <FormControl variant="outlined" className="w-full">
                <InputLabel htmlFor="outlined-hiring-type-native-simple">ธนาคาร</InputLabel>
                <MaterialSelect
                  label="ธนาคาร"
                  inputProps={{
                    name: 'hiring-type-view',
                  }}
                  defaultValue={selectedEmployee && selectedEmployee.bank && selectedEmployee.bank === 'SCB' ? 'SCB' :
                    selectedEmployee && selectedEmployee.bank && selectedEmployee.bank === 'KTB' ? 'KTB' :
                      selectedEmployee && selectedEmployee.bank && selectedEmployee.bank === 'BAY' ? 'BAY' :
                        selectedEmployee && selectedEmployee.bank && selectedEmployee.bank === 'KBANK' ? 'KBANK' :
                          selectedEmployee && selectedEmployee.bank && selectedEmployee.bank === 'BBL' ? 'BBL' : ''}
                  key={selectedEmployee && selectedEmployee.bank && selectedEmployee.bank === 'SCB' ? 'SCB' :
                    selectedEmployee && selectedEmployee.bank && selectedEmployee.bank === 'KTB' ? 'KTB' :
                      selectedEmployee && selectedEmployee.bank && selectedEmployee.bank === 'BAY' ? 'BAY' :
                        selectedEmployee && selectedEmployee.bank && selectedEmployee.bank === 'KBANK' ? 'KBANK' :
                          selectedEmployee && selectedEmployee.bank && selectedEmployee.bank === 'BBL' ? 'BBL' : ''}
                  disabled={disabled}
                  onChange={(e: any) => {
                    setUpdatedObject({
                      ...updatedObject,
                      bank: e.target.value
                    })
                  }}
                >
                  {
                    props.bank_list && props.bank_list.map((value: any, idx: any) => {
                      return <MenuItem key={idx} value={value.bank}><div className="flex items-center">{value.img} {value.name}</div></MenuItem>
                    })
                  }
                </MaterialSelect>
              </FormControl>
            </div>
            <div className="pr-4 mb-6 w-1/2">
              <TextField
                className="w-full"
                label="เลขที่บัญชี"
                placeholder="เลขที่บัญชีพนักงาน"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                defaultValue={selectedEmployee && selectedEmployee.bankAccount}
                key={selectedEmployee && selectedEmployee.bankAccount}
                disabled={disabled}
                onChange={(e: any) => {
                  setUpdatedObject({
                    ...updatedObject,
                    bankAccount: e.target.value
                  })
                }}
              />
            </div>
            <div className="border-gray-300 border-b text-gray-600 text-base pb-4 mb-6 w-full">
              ข้อมูลผู้ดูแล
              </div>
            <div className="pr-4 mb-6 w-1/2">
              <Autocomplete
                freeSolo
                id="controllable-watcher-demo"
                options={props.employeeWatchers && props.employeeWatchers.employeeWatchers && props.employeeWatchers.employeeWatchers.map((option: any) => option.name)}
                renderInput={(params) => <TextField {...params} label="ชื่อผู้ดูแล" placeholder="ชื่อผู้ดูแล" variant="outlined" InputLabelProps={{ shrink: true, }} />}
                defaultValue={selectedEmployee && selectedEmployee.employeeWatcher && selectedEmployee.employeeWatcher.name}
                key={selectedEmployee && selectedEmployee.employeeWatcher && selectedEmployee.employeeWatcher.name}
                disabled={disabled}
                onInputChange={(e: any) => {
                  setUpdatedObject({
                    ...updatedObject,
                    employeeWatcherName: e && e.target && e.target.value
                  })
                }}
                onChange={(e: any, data: any) => {
                  setUpdatedObject({
                    ...updatedObject,
                    employeeWatcherName: data
                  })
                }}
              />
            </div>
            <div className="pr-4 mb-6 w-1/2">
              <TextField
                className="w-full"
                label="เบอร์โทรศัพท์ผู้ดูแล"
                placeholder="เบอร์โทรศัพท์ผู้ดูแล"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                defaultValue={selectedEmployee && selectedEmployee.employeeWatcher && selectedEmployee.employeeWatcher.tel}
                key={selectedEmployee && selectedEmployee.employeeWatcher && selectedEmployee.employeeWatcher.tel}
                disabled={disabled}
                onChange={(e: any) => {
                  setUpdatedObject({
                    ...updatedObject,
                    employeeWatcherTel: e.target.value
                  })
                }}
              />
            </div>
            <div className="border-gray-300 border-b text-gray-600 text-base pb-4 mb-6 w-full">
              ข้อมูลรูปภาพ
              </div>
            <div className="pr-4 mb-6 w-1/2">
              รูปบัตรประชาชน
                <div className="w-64 mt-5">
                <img className="object-cover" src={'https://lifestyle.campus-star.com/app/uploads/2017/03/id-cover.jpg'} />
              </div>
            </div>
            <div className="pr-4 mb-6 w-1/2">
              รูปโปรไฟล์
                <div className="w-64 mt-5">
                <img className="object-cover" src={default_profile} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MaterialModal>
  )
}

export default EmployeePage;
