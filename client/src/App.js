import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import routes from "./config/routes";
import PrivateRoute from "./components/PrivateRoute";
import { ClinicianAptProvider } from "./context";
import useAuthState from "./hooks/useAuthState";
import { ToastContainer } from "react-toastify";
import ClinicianLayout from "./pages/ClinicianLayout";
import PatientLayout from "./pages/PatientLayout";
import Layout from "./pages/Layout";
import AvailablePatients from "./components/clinician/AvailablePatients";
import LogIn from "./pages/Login";
import Register from "./pages/Register";
import PatientAptSchedule from "./components/PatientAptSchedule";
import { Navigate } from "react-router-dom";

function App() {
  const { isAuthenticated, userDetails } = useAuthState();

  const { group } = userDetails;

  return (
    <>
      <ClinicianAptProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LogIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Layout />}>
              <Route
                index
                element={
                  group === "clinician" ? (
                    <AvailablePatients />
                  ) : (
                    <PatientAptSchedule userDetails={userDetails} />
                  )
                }
              />
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
      </ClinicianAptProvider>
    </>
  );
}

export default App;
