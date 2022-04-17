import React from "react";
import Button from "@mui/material/Button";

import PatientAptForm from "./PatientAptForm";
import SEO from "../Seo";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";

const PatientAptSchedule = ({ userDetails }) => {
  const { first_name, last_name, id } = userDetails;
  const [displayForm, setDisplayForm] = React.useState(false);

  return (
    <>
      <SEO title="Schedule Appointment" />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Typography variant="h6">{`Welcome ${first_name} ${last_name}`}</Typography>
        <Typography variant="h6"> Need an Appointment?</Typography>
        <Button onClick={() => setDisplayForm(true)} variant="contained">
          Find me a Clinician Now
        </Button>
        {displayForm && (
          <PatientAptForm setForm={setDisplayForm} patientId={id} />
        )}
      </Box>
    </>
  );
};

export default PatientAptSchedule;
