import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import PatientPastAptsTable from "./PatientPastAptsTable";
import { api } from "../../api";
import axios from "axios";
import { getAccessToken } from "../../services/authService";

const PatientPstApts = () => {
  const [loading, setLoading] = React.useState(true);
  const [apts, setApts] = React.useState(null);

  React.useEffect(() => {
    const getPatientPastApts = async () => {
      const url = api.appointments.pastApts;
      const token = getAccessToken();
      const headers = { Authorization: `JWT ${token}` };
      try {
        const response = await axios.get(url, { headers });
        setApts(response.data);
        setLoading(false);
      } catch (response) {
        console.log("error");
      }
    };

    // get canceled and completed apts
    getPatientPastApts();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }
  return <>{apts && <PatientPastAptsTable apts={apts} />}</>;
};

export default PatientPstApts;
