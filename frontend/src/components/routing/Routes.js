import React, {Fragment}from 'react'
import ReactDOM from 'react-dom'
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import Home from '../pages/Home'
import SelectRole from '../pages/SelectRole'
import TaskView from '../pages/TaskView'
import Register from '../pages/Register'
import EditTask from '../pages/EditTask'

export default () => (
  <>
  <Fragment>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/SelectRole" component={SelectRole} />
      <Route exact path="/TaskView" component={TaskView} />
      <Route exact path="/Register" component={Register} />
      <Route exact path="/EditTask" component={EditTask} />
    </Switch>
  </Fragment>
  </>
)