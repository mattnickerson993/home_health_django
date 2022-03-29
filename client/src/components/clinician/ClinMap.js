import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const ClinMap = ({ lat, lng, zoom }) => {
  return (
    <LoadScript googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY}>
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
        <Marker label="A" position={{ lat, lng }} />
      </GoogleMap>
    </LoadScript>
  );
};
export default ClinMap;
