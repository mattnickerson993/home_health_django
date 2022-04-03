import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { ClinicianAptContext } from "../../context";
import { updateCoords } from "../../services/AptService";
import ClinMap from "./ClinMap";

const ClinicianActiveApts = () => {
  const [lat, setLat] = React.useState(null);
  const [lng, setLng] = React.useState(null);
  const [locationLoaded, setLocationLoaded] = React.useState(false);

  const {
    clinschedapts: { clinschedapts },
  } = React.useContext(ClinicianAptContext);
  const patient_address = clinschedapts
    ? clinschedapts[0].patient_address
    : null;
  const apt_id = clinschedapts ? clinschedapts[0].id : null;

  React.useEffect(() => {
    if (window.navigator.geolocation) {
      loadCoords();
    }
  }, []);

  async function loadCoords() {
    window.navigator.geolocation.getCurrentPosition((position) => {
      setLat(position.coords.latitude);
      setLng(position.coords.longitude);
      setLocationLoaded(true);

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
          patient_address={patient_address}
          lat={lat}
          lng={lng}
          zoom={13}
        />
      ) : (
        <Box>
          <CircularProgress />
        </Box>
      )}
    </>
  );
};

export default ClinicianActiveApts;
