import React from "react";
import ClinMap from "./ClinMap";

const ClinicianActiveApts = () => {
  console.log("im rendered");
  const [lat, setLat] = React.useState(38.897957);
  const [lng, setLng] = React.useState(-77.03656);
  return <ClinMap lat={lat} lng={lng} zoom={13} />;
};

export default ClinicianActiveApts;
