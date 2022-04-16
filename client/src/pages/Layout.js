import React from "react";
import useAuthState from "../hooks/useAuthState";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClinicianLayout from "./ClinicianLayout";
import PatientLayout from "./PatientLayout";
import { Navigate } from "react-router-dom";

function Layout() {
  const { isAuthenticated, userDetails } = useAuthState();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const { group } = userDetails;
  return (
    <>
      {group === "clinician" ? (
        <>
          <ClinicianLayout
            isAuthenticated={isAuthenticated}
            userDetails={userDetails}
          />
        </>
      ) : (
        <>
          <PatientLayout
            isAuthenticated={isAuthenticated}
            userDetails={userDetails}
          />
        </>
      )}
      <ToastContainer />
    </>
  );
}

export default Layout;
