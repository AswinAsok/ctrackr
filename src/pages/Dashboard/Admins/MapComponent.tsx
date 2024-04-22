import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Custom marker icon
const customIcon = L.icon({
    iconUrl: "/chair.png",
    iconSize: [32, 32],
});

const userIcon = L.icon({
    iconUrl: "/pin.png",
    iconSize: [32, 32],
});

const MapComponent = ({
    usersLocation,
    position,
}: {
    usersLocation: any[] | undefined;
    position: [number, number];
}) => {
    return (
        position.length > 0 &&
        position[0] !== 0 && (
            <MapContainer
                center={position}
                zoom={13}
                style={{ height: "83vh", borderRadius: "10px" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position} icon={customIcon}>
                    <Popup>
                        <b>Your Location</b>
                    </Popup>
                </Marker>

                {usersLocation &&
                    usersLocation.map((userLocation) => (
                        <Marker
                            key={userLocation.id}
                            position={[userLocation.latitude, userLocation.longitude]}
                            icon={userIcon}
                        >
                            <Popup>{userLocation.email}</Popup>
                        </Marker>
                    ))}
            </MapContainer>
        )
    );
};

export default MapComponent;
