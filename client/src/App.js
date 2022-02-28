import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import routes from './config/routes'
import PrivateRoute from './components/PrivateRoute'

function App() {
  
  return (
    <>  
        <Router >
          <Routes>
            {routes.map(route => (
              route.private? 
              (
                <>
                 <Route key={Math.random().toString(5)} element={<PrivateRoute/>}>
                  <Route
                    key={route.path}
                    path={route.path}
                    element={route.component}
                    exact={route.exact}
                    />
                </Route>
                </>
              ):
              (
                <Route
                key={route.path}
                path={route.path}
                element={route.component}
                exact={route.exact}
                  />
              )
            ))}  
          </Routes>
        </Router>
    </>
  );
}

export default App;