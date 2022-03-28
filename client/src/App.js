import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import routes from "./config/routes";
import {
  ClinicianAptProvider,
  ChatMessageProvider,
  PatientAptProvider,
} from "./context";
import Layout from "./pages/Layout";
import LogIn from "./pages/Login";
import Register from "./pages/Register";
import Main from "./components/Main";

function App() {
  return (
    <>
      <ClinicianAptProvider>
        <PatientAptProvider>
          <ChatMessageProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<LogIn />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Layout />}>
                  <Route index element={<Main />} />
                  {routes &&
                    routes.map((route) => (
                      <Route
                        key={route.path}
                        path={route.path}
                        element={route.component}
                        exact={route.exact}
                      />
                    ))}
                </Route>
              </Routes>
            </Router>
          </ChatMessageProvider>
        </PatientAptProvider>
      </ClinicianAptProvider>
    </>
  );
}

export default App;
