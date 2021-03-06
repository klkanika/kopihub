import { useQuery } from "@apollo/react-hooks";
import React from "react";
import { FormControl, InputLabel, Paper, Select, Tab, Tabs, MenuItem, Button, Popover } from "@material-ui/core";
import PeopleIcon from '@material-ui/icons/People';
import UpdateIcon from '@material-ui/icons/Update';
import MoneyIcon from '@material-ui/icons/AttachMoney';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { GET_EMPLOYEES } from "../../utils/graphql";


const PayrollHeader = (props: any) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const { data: employeesData, loading: employeesLoading } = useQuery(GET_EMPLOYEES, {
        fetchPolicy: 'no-cache',
        variables: {
            statusSearch: 'ACTIVE'
        },
        pollInterval: 1000,
        onError: (err: any) => {
            window.alert(err)
        }
    });

    let withdrawableEmployeeCount = employeesData && employeesData.employees && employeesData.employees.filter((data: any) => {
        return (data.withdrawableMoney - data.withdrawnMoney) > 0
    }).length

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    return (
        <Paper>
            <div className="flex">
                <div className="w-1/6">
                    <Button
                        variant="contained"
                        color="primary"
                        endIcon={<KeyboardArrowDownIcon />}
                        className="h-full w-2/3"
                        onClick={handleClick}>
                        PAYROLL
                    </Button>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    >
                        <div className="w-40 text-white" style={{ backgroundColor: '#3f51b5' }}>
                            <a href="/"><MenuItem>HOME</MenuItem></a>
                            <a href="/taskview?userRole=CHEF"><MenuItem>KITCHEN</MenuItem></a>
                            <a href="/taskview?userRole=CASHIER"><MenuItem>COUNTER</MenuItem></a>
                            <a href="/staffqueue"><MenuItem>QUEUE</MenuItem></a>
                            <a href="/admin"><MenuItem>ADMIN</MenuItem></a>
                        </div>
                    </Popover>
                </div>
                <div className="w-5/6 flex justify-between">
                    <div>
                        <Tabs
                            value={props.value}
                            indicatorColor="primary"
                            textColor="primary"
                        >
                            <Tab label={<div><PeopleIcon style={{ verticalAlign: 'middle' }} /> พนักงาน </div>} value='employee' href="/payroll/employee" className="h-16" />
                            <Tab label={<div><UpdateIcon style={{ verticalAlign: 'middle' }} /> บันทึกการทำงาน </div>} value='worklog' href="/payroll/worklog" className="h-16" />
                            <Tab label={<div className="flex"><MoneyIcon style={{ verticalAlign: 'middle' }} />การจ่ายเงิน <div style={{ backgroundColor: '#DA394C' }} className="text-white rounded-full w-10 ml-2">{withdrawableEmployeeCount}</div> </div>} value='payment' href="/payroll/payment" className="h-16" />
                        </Tabs>
                    </div>
                    <div className="flex items-center">
                        <Tab label="ออกจากระบบ" onClick={() => {
                            sessionStorage.clear()
                            window.location.reload()
                        }} />
                    </div>
                </div>
            </div>
        </Paper>
    )
}

export default PayrollHeader;