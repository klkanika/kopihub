import React, {Fragment}from 'react'
import ReactDOM from 'react-dom'
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import Home from '../pages/Home'
import SelectRole from '../pages/SelectRole'
import TaskView from '../pages/TaskView'
import Register from '../pages/Register'
import EditTask from '../pages/EditTask'
import PrivateRoute from '../routing/PrivateRoute'

export default () => (
  <>
  <Fragment>
    <Switch>
      <Route exact path="/" component={Home} />
      <PrivateRoute exact path="/SelectRole" component={SelectRole} />
      <PrivateRoute exact path="/TaskView" component={TaskView} />
      <PrivateRoute exact path="/Register" component={Register} />
      <PrivateRoute exact path="/EditTask" component={EditTask} />
      <Route exact path="*" component={Home} />
    </Switch>
  </Fragment>
  </>
)