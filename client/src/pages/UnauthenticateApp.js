import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { unauthenticateRoutes } from '../config/unauthenticated_routes';


const UnauthenticatedApp = () => {
    console.log('unauth app loaded')
  return (
    <>
      <div>Unauthenticated App</div>
            {unauthenticateRoutes.map(route => (
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

export default UnauthenticatedApp