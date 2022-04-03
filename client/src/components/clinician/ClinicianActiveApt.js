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
  const {
    clinschedapts: { clinschedapts },
  } = React.useContext(ClinicianAptContext);
  const patient_address = clinschedapts
    ? clinschedapts[0].patient_address
    : null;
  const apt_id = clinschedapts ? clinschedapts[0].id : null;

  React.useEffect(() => {
    console.log("use effect called");
    let interval;
    if (window.navigator.geolocation) {
      interval = setInterval(() => loadCoords(), 6000);
    }
    if (!locationLoaded) {
      loadCoords();
    }
    return () => {
      console.log("interval cleared");
      clearInterval(interval);
    };
  }, []);
  // let count = 0;

  async function loadCoords() {
    console.log("loading coords called");
    window.navigator.geolocation.getCurrentPosition((position) => {
      console.log("setting");
      setLat(position.coords.latitude);
      setLng(position.coords.longitude);
      setLocationLoaded(true);
      setUpdateDirections(true);
      setUpdateDistance(true);
      updateCoords(
        {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        },
        apt_id
      );
    });
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
