import { CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { PatientAptContext } from "../../context";
import PatientMap from "./PatientMap";

const PatientActApts = () => {
  const [lat, setLat] = React.useState(null);
  const [lng, setLng] = React.useState(null);
  const [locationLoaded, setLocationLoaded] = React.useState(false);

  const {
    patientschedapts: { patientschedapts, clincoords },
  } = React.useContext(PatientAptContext);
  const patient_address = patientschedapts
    ? patientschedapts[0].patient_address
    : null;

  React.useEffect(() => {
    if (clincoords) {
      setLat(clincoords.lat);
      setLng(clincoords.lon);
      setLocationLoaded(true);
    }
  }, []);

  return (
    <>
      {locationLoaded ? (
        <Box>
          <PatientMap
            patient_address={patient_address}
            lat={lat}
            lng={lng}
            zoom={13}
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
          <Typography variant="h6" component={"div"}>
            Your clinician is not on there way yet...
          </Typography>
        </Box>
      )}
    </>
  );
};

export default PatientActApts;
