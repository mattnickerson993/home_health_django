import { CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { ClinicianAptContext } from "../../context";
import { updateCoords } from "../../services/AptService";
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
  const aptsPresent = clinschedapts && clinschedapts.len;

  console.log("clin sched apts", clinschedapts);
  const patient_address =
    clinschedapts && clinschedapts.len
      ? clinschedapts[0].patient_address
      : null;
  const apt_id =
    clinschedapts && clinschedapts.len ? clinschedapts[0].id : null;

  React.useEffect(() => {
    let interval;
    if (window.navigator.geolocation && aptsPresent) {
      interval = setInterval(() => loadCoords(), 60000);
    }
    if (aptsPresent && !locationLoaded) {
      loadCoords();
    }
    return () => {
      console.log("interval cleared");
      clearInterval(interval);
    };
  }, []);

  async function loadCoords() {
    console.log("loading coords called");
    window.navigator.geolocation.getCurrentPosition((position) => {
      setLat(position.coords.latitude);
      setLng(position.coords.longitude);
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
  if (!aptsPresent) {
    return (
      <>
        <Box>
          Looks like you don't have any active appointments. Check back when you
          do!
        </Box>
      </>
    );
  }
  return (
    <>
      {locationLoaded ? (
        <ClinMap
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
