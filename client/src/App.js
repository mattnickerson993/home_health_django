import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import routes from "./config/routes";
import PrivateRoute from "./components/PrivateRoute";
import { ClinicianAptProvider } from "./context";

function App() {
  return (
    <>
      <ClinicianAptProvider>
        <Router>
          <Routes>
            {routes.map((route) =>
              route.private ? (
                <>
                  <Route
                    key={Math.random().toString(5)}
                    element={<PrivateRoute />}
                  >
                    <Route
                      key={route.path}
                      path={route.path}
                      element={route.component}
                      exact={route.exact}
                    />
                  </Route>
                </>
              ) : (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.component}
                  exact={route.exact}
                />
              )
            )}
          </Routes>
        </Router>
      </ClinicianAptProvider>
    </>
  );
}

export default App;
