import React from "react";
import {
  DirectionsRenderer,
  DirectionsService,
  DistanceMatrixService,
  GoogleMap,
  LoadScript,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import DistanceCard from "./DistanceCard";

const ClinMap = ({
  updateDistance,
  setUpdateDistance,
  updateDirections,
  setUpdateDirections,
  patient_address,
  lat,
  lng,
  zoom,
}) => {
  const [miles, setMiles] = React.useState(null);
  const [duration, setDuration] = React.useState(null);
  const [response, setResponse] = React.useState(null);
  console.log("rendered");
  const clinician_address = { lat, lng };
  const directionsCallback = (response) => {
    if (response !== null && response.status === "OK" && updateDirections) {
      setResponse(response);
      setUpdateDirections(false);
    }
  };
  const distanceCallback = (res) => {
    if (res !== null) {
      setUpdateDirections(false);
      let miles = res.rows[0].elements[0].distance.value;
      let duration = res.rows[0].elements[0].duration.text;
      setDuration(duration);
      setMiles(Math.round(miles / 1609));
    }
  };
  return (
    <>
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          center={{
            lat,
            lng,
          }}
          mapContainerStyle={{
            width: "100%",
            height: "300px",
            marginBottom: "10px",
          }}
          zoom={zoom}
        >
          {patient_address && updateDirections && (
            <DirectionsService
              options={{
                origin: clinician_address,
                destination: patient_address,
                travelMode: "DRIVING",
              }}
              callback={(res) => directionsCallback(res)}
            />
          )}
          {patient_address && response !== null && (
            <DirectionsRenderer
              options={{
                directions: response,
              }}
            />
          )}
          {updateDirections && (
            <DistanceMatrixService
              options={{
                origins: [clinician_address],
                destinations: [patient_address],
                travelMode: "DRIVING",
              }}
              callback={(res) => distanceCallback(res)}
            />
          )}
          {!patient_address && <Marker label="A" position={{ lat, lng }} />}
        </GoogleMap>
      </LoadScript>
      {miles && duration && <DistanceCard miles={miles} duration={duration} />}
    </>
  );
};
export default ClinMap;
