import React from 'react'
import { Route, Redirect } from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        //console.log("Render")
        //console.log("props", props.location.pathname)
        return sessionStorage.getItem("loggedUserId") || props.location.pathname === "/Register" ? (
          <Component {...props} />
        ) : (
            <Redirect to="/?from=PrivateRoute" />
        )
      }
        
      }
    />
  )
}

export default PrivateRoute
