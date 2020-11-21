import React from 'react'
import { Route, Redirect } from 'react-router-dom'

const AdminRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        return sessionStorage.getItem("loggedUserId") && sessionStorage.getItem("loggedIsAdmin") && sessionStorage.getItem("loggedIsAdmin") == "Y" ? (
          <Component {...props} />
        ) : (
            <Redirect to="/?from=AdminRoute" />
        )
      }
        
      }
    />
  )
}

export default AdminRoute
