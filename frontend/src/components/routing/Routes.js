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
        <Route exact path="/staffqueue" component={StaffQueue} />
        <Route exact path="/customerqueue" component={CustomerQueue} />
        <Route exact path="/cancelqueue" component={CustomerCancelQueue} />
        {/* <Route exact path="*" component={Home} /> */}
      </Switch>
    </Fragment>
  </>
)