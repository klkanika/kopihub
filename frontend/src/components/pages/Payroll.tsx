import { Layout, Menu } from "antd";
import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import EmployeePage from "./EmployeePage";
import PaymentPage from "./PaymentPage";
import WorkLogPage from "./WorkLogPage";

const Payroll = () => {
  return (
    <Layout className="h-screen">
      <Layout.Sider collapsible collapsed={false}>
        <Menu theme="dark">
          <Menu.Item key="employee">
            <Link to="/payroll/employee">พนักงาน</Link>
          </Menu.Item>
          <Menu.Item key="worklog">
            <Link to="/payroll/worklog">บันทึกการทำงาน</Link>
          </Menu.Item>
          <Menu.Item key="payment">
            <Link to="/payroll/payment">การจ่ายเงิน</Link>
          </Menu.Item>
        </Menu>
      </Layout.Sider>
      <Layout>
        <Switch>
          <Route exac path="/payroll/worklog" component={WorkLogPage} />
          <Route exac path="/payroll/payment" component={PaymentPage} />
          <Route exac path="/payroll/employee" component={EmployeePage} />
          <Route exac path="/payroll" component={EmployeePage} />
        </Switch>
        <div className="w-full flex justify-center items-center h-12">
          Kopihub ©2020 Created by Till it's Done
        </div>
      </Layout>
    </Layout>
  );
};

export default Payroll;
