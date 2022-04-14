import { Button, CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { PatientAptContext } from "../../context";
import { cancelApt } from "../../services/AptService";
import PatientMap from "./PatientMap";

const PatientActApts = () => {
  const [lat, setLat] = React.useState(null);
  const [lng, setLng] = React.useState(null);
  const [locationLoaded, setLocationLoaded] = React.useState(false);
  const [updateDirections, setUpdateDirections] = React.useState(false);
  const [updateDistance, setUpdateDistance] = React.useState(false);

  const {
    patientactiveapts: {
      patientschedapts,
      patient_inroute_apts,
      patient_arrived_apts,
      clincoords,
    },
  } = React.useContext(PatientAptContext);

  // determine type of active apt
  const schedAptsPresent = patientschedapts && patientschedapts.length > 0;
  const inRouteAptsPresent =
    patient_inroute_apts && patient_inroute_apts.length > 0;
  const arrivedAptsPresent =
    patient_arrived_apts && patient_arrived_apts.length > 0;

  const aptsPresent =
    schedAptsPresent || inRouteAptsPresent || arrivedAptsPresent;
  // only for in route apts

  const patient_address = inRouteAptsPresent
    ? patient_inroute_apts[0].patient_address
    : null;

  const apt_id = schedAptsPresent ? patientschedapts[0].id : null;

  const handleCancel = async (id) => {
    await cancelApt(id);
  };
  React.useEffect(() => {
    if (clincoords) {
      setLat(clincoords.lat);
      setLng(clincoords.lon);
      setLocationLoaded(true);
      setUpdateDirections(true);
      setUpdateDistance(true);
    }
  }, [clincoords]);

  if (schedAptsPresent) {
    return (
      <>
        <Box>
          Your Clinician is not in route yet. You'll be notified once they are
          on there way!
        </Box>
        <Button onClick={() => handleCancel(apt_id)}>Cancel Appointment</Button>
      </>
    );
  } else if (arrivedAptsPresent) {
    return (
      <>
        <Box>
          Your Clinician has arrived and your appointment is now in progress
        </Box>
      </>
    );
  } else if (!aptsPresent) {
    return (
      <>
        <Box>
          Looks like you dont have any active appointments now. Check back when
          you do!
        </Box>
      </>
    );
  }
  return (
    <>
      {locationLoaded ? (
        <Box>
          <PatientMap
            updateDirections={updateDirections}
            setUpdateDirections={setUpdateDirections}
            updateDistance={updateDistance}
            setUpdateDistance={setUpdateDistance}
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
            Loading...
          </Typography>
        </Box>
      )}
    </>
  );
};

export default PatientActApts;
