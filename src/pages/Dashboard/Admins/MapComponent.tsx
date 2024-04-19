import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Custom marker icon
const customIcon = L.icon({
  iconUrl: "path/to/your/custom-icon.png",
  iconSize: [32, 32],
});

const MapComponent: React.FC = () => {
  const position: [number, number] = [51.505, -0.09]; // Initial map center position

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{
        height: "100vh",
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} icon={customIcon}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
