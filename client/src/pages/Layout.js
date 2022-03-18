import React from "react";
import useAuthState from "../hooks/useAuthState";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClinicianLayout from "./ClinicianLayout";
import PatientLayout from "./PatientLayout";

function Layout() {
  const { isAuthenticated, userDetails } = useAuthState();
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
