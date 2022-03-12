import React from "react";
import Button from "@mui/material/Button";

import PatientAptForm from "./PatientAptForm";
import { ToastContainer, toast } from "react-toastify";

const PatientAptSchedule = ({ userDetails }) => {
  const { first_name, last_name, id } = userDetails;
  const [clinicians, setClinicians] = React.useState([]);
  const [displayForm, setDisplayForm] = React.useState(false);

  return (
    <>
      <div>{`Welcome Patient ${first_name} ${last_name}`}</div>
      <div> Need an Appointment ?</div>
      <Button onClick={() => setDisplayForm(true)} variant="contained">
        Find me a Clinician
      </Button>
      {displayForm && <PatientAptForm patientId={id} />}
    </>
  );
};

export default PatientAptSchedule;
