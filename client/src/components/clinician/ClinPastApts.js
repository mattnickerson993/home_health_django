import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import PastAptsTable from "./PastAptsTable";
import { api } from "../../api";
import axios from "axios";
import { getAccessToken } from "../../services/authService";

const ClinPastApts = () => {
  const [loading, setLoading] = React.useState(true);
  const [apts, setApts] = React.useState(null);

  React.useEffect(() => {
    // setLoading(false);
    const getClinPastApts = async () => {
      const url = api.appointments.pastApts;
      const token = getAccessToken();
      const headers = { Authorization: `JWT ${token}` };
      try {
        const response = await axios.get(url, { headers });
        console.log(response);
        setApts(response.data);
        setLoading(false);
      } catch (response) {
        console.log("error");
      }
    };

    // get canceled and completed apts
    getClinPastApts();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }
  return <>{apts && <PastAptsTable apts={apts} />}</>;
};

export default ClinPastApts;
