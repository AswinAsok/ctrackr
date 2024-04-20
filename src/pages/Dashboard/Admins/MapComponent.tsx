import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Custom marker icon
const customIcon = L.icon({
    iconUrl: "/chair.png",
    iconSize: [32, 32],
});

const MapComponent: React.FC = () => {
    const [position, setPosition] = useState<[number, number]>([0, 0]); // Initial map center position as state variable

    useEffect(() => {
        // Check if geolocation is supported
        if ("geolocation" in navigator) {
            // Request user's location
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setPosition([latitude, longitude]);
                    console.log("Latitude:", latitude, "Longitude:", longitude);
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported");
        }
    }, []);

    return (
        position.length > 0 &&
        position[0] !== 0 && (
            <MapContainer
                center={position}
                zoom={13}
                
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
        )
    );
};

export default MapComponent;
