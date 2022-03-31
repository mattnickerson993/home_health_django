import React from "react";
import {
  DirectionsRenderer,
  DirectionsService,
  DistanceMatrixService,
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";

const ClinMap = ({ patient_address, lat, lng, zoom }) => {
  const [response, setResponse] = React.useState(null);
  const [distResponse, setDistResponse] = React.useState(null);
  const clinician_address = { lat, lng };
  const directionsCallback = (response) => {
    if (response !== null && response.status === "OK") {
      setResponse(response);
    }
  };
  const distanceCallback = (res) => {
    console.log("res", res);
    if (res !== null && res.status === "OK") {
      setDistResponse(res);
    }
  };
  return (
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
        {/* {patient_address && (
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
        )} */}
        {patient_address && (
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
  );
};
export default ClinMap;
