import { Button, CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { ClinicianAptContext } from "../../context";
import {
  updateCoords,
  clinBeginNav,
  clinComplete,
} from "../../services/AptService";
import ClinMap from "./ClinMap";

const ClinicianActiveApts = () => {
  const [lat, setLat] = React.useState(null);
  const [lng, setLng] = React.useState(null);
  const [locationLoaded, setLocationLoaded] = React.useState(false);
  const [updateDistance, setUpdateDistance] = React.useState(true);
  const [updateDirections, setUpdateDirections] = React.useState(true);
  // apt context
  const { clinactiveapts } = React.useContext(ClinicianAptContext);
  const { clinschedapts, clin_inroute_apts, clin_arrived_apts } =
    clinactiveapts;
  // check which type is present if any
  const schedAptsPresent = clinschedapts && clinschedapts.length;
  const inRouteAptsPresent = clin_inroute_apts && clin_inroute_apts.length;
  const arrivedAptsPresent = clin_arrived_apts && clin_arrived_apts.length;

  // display map under following condition
  const displayMap = inRouteAptsPresent;
  // get address and apt_id if they exist
  const patient_address = schedAptsPresent
    ? clinschedapts[0].patient_address
    : inRouteAptsPresent
    ? clin_inroute_apts[0].patient_address
    : arrivedAptsPresent
    ? clin_arrived_apts[0].patient_address
    : null;

  const apt_id = schedAptsPresent
    ? clinschedapts[0].id
    : inRouteAptsPresent
    ? clin_inroute_apts[0].id
    : arrivedAptsPresent
    ? clin_arrived_apts[0].id
    : null;

  //  fetch and update current position every minute
  React.useEffect(() => {
    let interval;
    if (window.navigator.geolocation && displayMap) {
      interval = setInterval(() => loadCoords(), 60000);
    }
    if (displayMap && !locationLoaded) {
      loadCoords();
    }
    return () => {
      console.log("interval cleared");
      clearInterval(interval);
    };
  }, [displayMap]);

  async function loadCoords() {
    console.log("loading coords called");
    window.navigator.geolocation.getCurrentPosition((position) => {
      setLat(position.coords.latitude);
      setLng(position.coords.longitude);
      // update coords for corresponding clin/patient
      updateCoords(
        {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        },
        apt_id
      );
      setLocationLoaded(true);
      setUpdateDirections(true);
      setUpdateDistance(true);
    });
  }

  function startNavigation() {
    clinBeginNav(apt_id);
  }

  function handleComplete() {
    clinComplete(apt_id);
  }
  if (!schedAptsPresent && !arrivedAptsPresent && !displayMap) {
    return (
      <>
        <Box>
          Looks like you don't have any active appointments. Check back when you
          do!
        </Box>
      </>
    );
  } else if (schedAptsPresent && !displayMap) {
    return (
      <>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button onClick={startNavigation}>Begin navigation</Button>
        </Box>
      </>
    );
  } else if (arrivedAptsPresent && !displayMap) {
    return (
      <>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Appointment is in progress
          <Button onClick={handleComplete}>Complete Appointment</Button>
        </Box>
      </>
    );
  }
  return (
    <>
      {locationLoaded ? (
        <ClinMap
          apt_id={apt_id}
          updateDistance={updateDistance}
          setUpdateDistance={setUpdateDistance}
          updateDirections={updateDirections}
          setUpdateDirections={setUpdateDirections}
          patient_address={patient_address}
          lat={lat}
          lng={lng}
          zoom={13}
        />
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
        </Box>
      )}
    </>
  );
};

export default ClinicianActiveApts;
