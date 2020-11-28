import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import { Route, Switch, BrowserRouter as Router, Redirect } from 'react-router-dom'
import Home from '../pages/Home'
import SelectRole from '../pages/SelectRole'
import TaskView from '../pages/TaskView'
import Register from '../pages/Register'
import EditTask from '../pages/EditTask'
import PrivateRoute from '../routing/PrivateRoute'
import StaffQueue from '../pages/StaffQueue'
import CustomerQueue from '../pages/CustomerQueue'
import CustomerCancelQueue from '../pages/CustomerCancelQueue'
import SetTaskNew from '../pages/SetTaskNew'
import InsertTask from '../pages/InsertTask'
import SetTime from '../pages/SetTime'
import SortTask from '../pages/SortTask'
import EmployeePage from '../pages/EmployeePage'
import PaymentPage from '../pages/PaymentPage'
import WorkLogPage from '../pages/WorkLogPage'
import Payroll from '../pages/Payroll'
import NotifyLog from '../pages/NotifyLog'
import Admin from '../pages/Admin'
import InsertAdmin from '../pages/InsertAdmin'
import EditAdmin from '../pages/EditAdmin'
import AdminRoute from '../routing/AdminRoute'


let params = new URLSearchParams(decodeURIComponent(window.location.search));
let liffPath = params.get("liff.state");

export default () => (
  <>
    <Fragment>
      <Switch>
        {/* <Route exact path="/" component={Home} /> */}
        <Route
          exact
          path="/"
          render={(props) => {
            if (liffPath) {
              if (liffPath.toLowerCase() === '/staffqueue') {
                if (sessionStorage.getItem("loggedUserId")) {
                  return <StaffQueue />
                } else {
                  return <Home />
                }
              } else {
                return <Redirect preserveQueryString to={liffPath} />
              }
            } else {
              return <Home />
            }
          }
          }
        />
        <PrivateRoute exact path="/SelectRole" component={SelectRole} />
        <PrivateRoute exact path="/TaskView" component={TaskView} />
        <PrivateRoute exact path="/Register" component={Register} />
        <PrivateRoute exact path="/EditTask" component={EditTask} />
        <PrivateRoute exact path="/SortTask" component={SortTask} />
        <PrivateRoute exact path="/InsertTask" component={InsertTask} />
        <PrivateRoute exact path="/SetTaskNew/:id/:taskName/:total/:type" component={SetTaskNew} />
        <PrivateRoute exact path="/SetTime/:id/:status/:finishDate" component={SetTime} />
        <AdminRoute exact path="/NotifyLog" component={NotifyLog} />
        <AdminRoute exact path="/Admin" component={Admin} />
        <AdminRoute exact path="/InsertAdmin" component={InsertAdmin} />
        <AdminRoute exact path="/EditAdmin/:id" component={EditAdmin} />
        <Route exact path="/staffqueue" component={StaffQueue} />
        <Route exact path="/customerqueue" component={CustomerQueue} />
        <Route exact path="/cancelqueue" component={CustomerCancelQueue} />
        <AdminRoute exact path="/payroll/worklog" component={WorkLogPage} />
        <AdminRoute exact path="/payroll/payment" component={PaymentPage} />
        <AdminRoute exact path="/payroll/employee" component={EmployeePage} />
        <AdminRoute exact path="/payroll" component={EmployeePage} />
        {/* <Route exact path="*" component={Home} /> */}
      </Switch>
    </Fragment>
  </>
)