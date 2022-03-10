import React from "react";
import Button from "@mui/material/Button";
import { getAvialableClinicians } from "../services/AptService";

const PatientAptSchedule = ({ userDetails }) => {
  const { first_name, last_name } = userDetails;
  const [apts, setApts] = React.useState([]);

  React.useEffect(() => {
    const loadApts = async () => {
      const response = getAvialableClinicians();
      console.log(response);
    };
    loadApts();
  }, []);
  return (
    <>
      <div>{`Welcome Patient ${first_name} ${last_name}`}</div>
      <div> Need an Appointment ?</div>
      <Button variant="contained">Now</Button>
    </>
  );
};

export default PatientAptSchedule;
