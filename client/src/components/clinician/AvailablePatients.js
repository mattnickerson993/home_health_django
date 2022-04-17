import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { ClinicianAptContext } from "../../context";
import SEO from "../Seo";
import AptCard from "./AptCard";
const AvailablePatients = () => {
  const { clinicianApts } = React.useContext(ClinicianAptContext);
  const { appointments } = clinicianApts;

  return (
    <div>
      <SEO title="Available Patients" />
      <Box
        sx={{
          margin: (theme) => theme.spacing(2),
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">
          Select from available Patients Below!
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {appointments && appointments.length ? (
          appointments.map((apt) => (
            <>
              <Grid item xs={8} md={12}>
                <AptCard apt={apt} />
              </Grid>
            </>
          ))
        ) : (
          <Grid item xs={8}>
            <h1>No patients are currently available</h1>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default AvailablePatients;
