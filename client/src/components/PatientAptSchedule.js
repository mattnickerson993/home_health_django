import React from "react";
import Button from "@mui/material/Button";

import PatientAptForm from "./PatientAptForm";

const PatientAptSchedule = ({ userDetails }) => {
  const { first_name, last_name, id } = userDetails;
  const [clinicians, setClinicians] = React.useState([]);
  const [displayForm, setDisplayForm] = React.useState(false);

  // React.useEffect(() => {
  //   console.log("loading");
  //   const loadClins = async () => {
  //     const { response, isError } = await getAvialableClinicians();
  //     if (isError) {
  //       setClinicians([]);PatientAptForm

  //   loadClins();
  // }, []);

  // React.useEffect(() => {
  //   console.log("im called");
  //   connect();
  //   const subscription = messages.subscribe((message) => {
  //     console.log("msg", message);
  //     setClinicians(message);
  //   });
  //   console.log("sub", subscription);
  //   return () => {
  //     if (subscription) {
  //       subscription.unsubscribe();
  //     }
  //   };
  //   console.log("init connection");
  // }, [setClinicians]);

  // console.log("clins", clinicians);
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
