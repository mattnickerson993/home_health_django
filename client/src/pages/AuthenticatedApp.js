import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { authenticatedRoutes } from '../config/authenticated_routes';


const AuthenticateApp = () => {
  console.log('auth app loaded')
  return (
    <>
      <div>Authenticated App</div>
        {authenticatedRoutes.map(route => (
          (
            <Route
            key={route.path}
            path={route.path}
            element={route.component}
            exact={route.exact}
              />
          )
        ))}  
    </>
  )
}

export default AuthenticateApp