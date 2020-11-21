import { Layout, Menu } from "antd";
import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import AdminRoute from "../routing/AdminRoute";
import EmployeePage from "./EmployeePage";
import PaymentPage from "./PaymentPage";
import WorkLogPage from "./WorkLogPage";

const Payroll = () => {
  return (
    <Layout className="h-screen">
      <Layout.Sider collapsible collapsed={false}>
        <Menu theme="dark">
          <Menu.Item key="index">
            <Link to="/selectrole">หน้าหลัก</Link>
          </Menu.Item>
          <Menu.Item key="employee">
            <Link to="/payroll/employee">พนักงาน</Link>
          </Menu.Item>
          <Menu.Item key="worklog">
            <Link to="/payroll/worklog">บันทึกการทำงาน</Link>
          </Menu.Item>
          <Menu.Item key="payment">
            <Link to="/payroll/payment">การจ่ายเงิน</Link>
          </Menu.Item>
          <Menu.Item key="/logout">
            <div onClick={() => {
              sessionStorage.clear()
              window.location.reload()
            }}>ออกจากระบบ</div>
          </Menu.Item>
        </Menu>
      </Layout.Sider>
      <Layout>
        <Switch>
          <AdminRoute exact path="/payroll/worklog" component={WorkLogPage} />
          <AdminRoute exact path="/payroll/payment" component={PaymentPage} />
          <AdminRoute exact path="/payroll/employee" component={EmployeePage} />
          <AdminRoute exact path="/payroll" component={EmployeePage} />
        </Switch>
        <div className="w-full flex justify-center items-center h-12">
          Kopihub ©2020 Created by Till it's Done
        </div>
      </Layout>
    </Layout>
  );
};

export default Payroll;
