import React from "react";
import {
  DirectionsService,
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";

const ClinMap = ({ patient_address, lat, lng, zoom }) => {
  const clinician_address = { lat, lng };
  console.log(patient_address);
  console.log(clinician_address);
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
        {patient_address ? (
          <DirectionsService
            options={{
              origin: "Charlottesville, VA",
              destination: patient_address,
              travelMode: "DRIVING",
            }}
          />
        ) : (
          <Marker label="A" position={{ lat, lng }} />
        )}
      </GoogleMap>
    </LoadScript>
  );
};
export default ClinMap;
