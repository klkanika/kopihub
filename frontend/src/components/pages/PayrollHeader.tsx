import React from "react";
import { FormControl, InputLabel, Paper, Select, Tab, Tabs, MenuItem } from "@material-ui/core";
import PeopleIcon from '@material-ui/icons/People';
import UpdateIcon from '@material-ui/icons/Update';
import MoneyIcon from '@material-ui/icons/AttachMoney';

const PayrollHeader = (props: any) => {
    return (
        <Paper>
            <Tabs
                value={props.value}
                indicatorColor="primary"
                textColor="primary"
            >
                <Tab value='employee' icon={<PeopleIcon />} label="พนักงาน" href="/payroll/employee" />
                <Tab value='worklog' icon={<UpdateIcon />} label="บันทึกการทำงาน" href="/payroll/worklog" />
                <Tab value='payment' icon={<MoneyIcon />} label="การจ่ายเงิน" href="/payroll/payment" />
                <Tab label="ออกจากระบบ" onClick={() => {
                    sessionStorage.clear()
                    window.location.reload()
                }} />
            </Tabs>
        </Paper>
    )
}

export default PayrollHeader;