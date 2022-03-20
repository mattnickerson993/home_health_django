import React from "react";
import useAuthState from "../hooks/useAuthState";
import AvailablePatients from "./clinician/AvailablePatients";
import PatientAptSchedule from "./patient/PatientAptSchedule";

const Main = () => {
  const { isAuthenticated, userDetails } = useAuthState();

  const { group } = userDetails;
  return (
    <>
      {group === "clinician" ? (
        <AvailablePatients />
      ) : (
        <PatientAptSchedule userDetails={userDetails} />
      )}
    </>
  );
};

export default Main;
