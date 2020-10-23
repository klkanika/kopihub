import React from 'react'
import { Route, Redirect } from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        console.log("Render")
        return sessionStorage.getItem("loggedUserId") ? (
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
