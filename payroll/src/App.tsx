import React from "react";
import "./styles/tailwind.css";
import "./styles/style.css";
import "antd/dist/antd.css";
import { Layout, Menu, Tooltip } from "antd";

import { Link, Route, Switch, BrowserRouter as Router } from "react-router-dom";
import EmployeePage from "./pages/EmployeePage";
import WorkLogPage from "./pages/WorkLogPage";
import PaymentPage from "./pages/PaymentPage";

const App = () => {

  return (
    <Router>
      <Layout className="h-screen">
        <Layout.Sider collapsible collapsed={false}>
          <Menu theme="dark">
            <Menu.Item key="employee">
              <Link to="/">พนักงาน</Link>
            </Menu.Item>
            <Menu.Item key="worklog">
              <Link to="/worklog">บันทึกการทำงาน</Link>
            </Menu.Item>
            <Menu.Item key="payment">
              <Link to="/payment">การจ่ายเงิน</Link>
            </Menu.Item>
          </Menu>
        </Layout.Sider>
        <Layout>
          <Layout.Header style={{ background: "#fff" }}>
            <div className="flex items-center justify-end text-base">
              ยินดีต้อนรับ, admin
              <Tooltip placement="bottom" title={<button onClick={()=>{}}>Logout</button>}>
                <img
                  src="https://http.cat/404"
                  className="w-5 h-5 ml-2"
                  alt=""
                />
              </Tooltip>
            </div>
          </Layout.Header>
          <Switch>
            <Route exac path="/worklog" component={WorkLogPage} />
            <Route exac path="/payment" component={PaymentPage} />
            <Route path="/" component={EmployeePage} />
          </Switch>
          <div className="w-full flex justify-center items-center h-12">
            Kopihub ©2018 Created by Seeuchula Developer Team
          </div>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
