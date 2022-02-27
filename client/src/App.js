import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import routes from './config/routes'
import { getUser } from './services/authService';

function App() {
  const [user, setUser] = React.useState(getUser)
  console.log('user', user)
  React.useEffect(()=>{
    console.log('yo')
  },[])
  return (
    <>  
        <Router >
          <Routes>
            {routes.map(route => (
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