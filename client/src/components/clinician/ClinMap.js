import React from "react";
import {
  DirectionsRenderer,
  DirectionsService,
  DistanceMatrixService,
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import DistanceCard from "./DistanceCard";

const ClinMap = ({ patient_address, lat, lng, zoom }) => {
  const [miles, setMiles] = React.useState(null);
  const [duration, setDuration] = React.useState(null);
  const [response, setResponse] = React.useState(null);
  const [distanceReceived, setDistanceReceived] = React.useState(false);
  const [directionsReceived, setDirectionsReceived] = React.useState(false);
  const clinician_address = { lat, lng };
  const directionsCallback = (response) => {
    if (response !== null && response.status === "OK") {
      setResponse(response);
      // setDirectionsReceived(true);
    }
  };
  const distanceCallback = (res) => {
    if (res !== null) {
      setDistanceReceived(true);
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
          {patient_address && (
            <DirectionsService
              options={{
                origin: { lat, lng },
                destination: patient_address,
                travelMode: "DRIVING",
              }}
              callback={directionsCallback}
            />
          )}
          {patient_address && response !== null && (
            <DirectionsRenderer
              options={{
                directions: response,
              }}
            />
          )}
          {!distanceReceived && (
            <DistanceMatrixService
              options={{
                origins: [{ lat, lng }],
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
