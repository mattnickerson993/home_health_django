import { appendOwnerState } from "@mui/base";
import { Grid } from "@mui/material";
import React from "react";
import { ClinicianAptContext } from "../../context";
import AptCard from "./AptCard";
const AvailablePatients = () => {
  const { clinicianApts } = React.useContext(ClinicianAptContext);
  const { appointments } = clinicianApts;

  return (
    <div>
      <Grid container spacing={4}>
        {appointments &&
          appointments.map((apt) => (
            <>
              <Grid item xs={8}>
                <AptCard apt={apt} />
              </Grid>
            </>
          ))}
      </Grid>
    </div>
  );
};

export default AvailablePatients;
