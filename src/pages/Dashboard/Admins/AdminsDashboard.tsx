import { useContext, useEffect, useState } from "react";
import AppContext from "../../../contexts/appContext";
import styles from "./AdminsDashboard.module.css";
import MapComponent from "./MapComponent";

import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { calculateDistance, convertTimestamp } from "../../utils";

const AdminsDashboard = () => {
    const { supabase } = useContext(AppContext);
    const { room_code } = useParams();
    const [users, setUsers] = useState<any[]>();

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

    const [usersLocation, setUsersLocation] = useState<any[]>();

    const getUserLocation = async (userIds: any) => {
        if (!supabase) return;

        try {
            const { data: userLocationData, error: userLocationError } = await supabase
                .from("user_location")
                .select("*")
                .in("user_id", userIds);

            if (userLocationError) {
                console.error("Error fetching user location data:", userLocationError);
                return;
            }

            console.log(userLocationData);
            setUsersLocation(userLocationData);
        } catch (error) {
            toast.error("Error fetching user location data");
        }
    };

    useEffect(() => {
        async function fetchRoomData() {
            if (!supabase) return;

            try {
                const { data: roomData, error: roomError } = await supabase
                    .from("rooms")
                    .select("id")
                    .eq("room_code", room_code)
                    .single();

                if (roomError) {
                    toast.error("Error fetching room data");
                    return;
                }

                const { data: memberData, error: memberError } = await supabase
                    .from("room_members")
                    .select("user_id")
                    .eq("room_id", roomData.id);

                if (memberError) {
                    toast.error("Error fetching room members");
                    return;
                }

                const userIds = memberData.map((member) => member.user_id);
                getUserLocation(userIds);
                const { data: userData, error: userError } = await supabase
                    .from("users")
                    .select("*")
                    .in("id", userIds);

                if (userError) {
                    console.error("Error fetching user data:", userError);
                } else {
                    setUsers(userData);
                }
            } catch (error) {
                console.error("Error fetching room data:", error);
            }
        }

        fetchRoomData();
    }, [room_code, supabase]);

    return (
        <div className={styles.adminDashboardContainer}>
            <div className={styles.dashboard}>
                <div className={styles.nearbyStudentContainer}>
                    <div className={styles.nearbyHeading}>
                        <p className={styles.nearByStudents}>Nearby Students</p>
                        <p className={styles.nearbyFilter}>Filter</p>
                    </div>
                    <div className={styles.searchBar}>
                        <input type="text" placeholder="Search" className={styles.searchInput} />
                    </div>
                    <div className={styles.nearbyStudentList}>
                        {users &&
                            users.map((user) => (
                                <>
                                    <div className={styles.nearbyStudent}>
                                        <div className={styles.nearbyStudentData}>
                                            <img
                                                src="https://via.placeholder.com/100"
                                                alt=""
                                                className={styles.nearbyStudentImage}
                                            />
                                            <div className={styles.nearbyStudentDetails}>
                                                <p className={styles.nearbyStudentName}>
                                                    {user.raw_user_meta_data.full_name}
                                                </p>
                                                <p className={styles.nearbyStudentLocation}>
                                                    {user.raw_user_meta_data.email.substring(
                                                        0,
                                                        user.raw_user_meta_data.email.indexOf("@")
                                                    )}
                                                </p>
                                                <p className={styles.nearbyStudentPhone}>
                                                    {user.raw_user_meta_data.phone_number}
                                                </p>
                                            </div>
                                            <button className={styles.alertButton}>Alert</button>
                                        </div>
                                        <div className={styles.studentLocationData}>
                                            <p className={styles.studentLocation}>
                                                <span>Updated At</span>
                                                <br /> {convertTimestamp(user.updated_at)}
                                            </p>
                                            <p className={styles.studentLocationValue}>
                                                {usersLocation &&
                                                    usersLocation
                                                        .filter(
                                                            (location) =>
                                                                location.user_id === user.id
                                                        )
                                                        .map((location) => (
                                                            <>
                                                                {calculateDistance(
                                                                    {
                                                                        latitude: position[0],
                                                                        longitude: position[1],
                                                                    },
                                                                    {
                                                                        latitude: location.latitude,
                                                                        longitude:
                                                                            location.longitude,
                                                                    }
                                                                ).toFixed(2)}{" "}
                                                                km away
                                                            </>
                                                        ))}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            ))}
                    </div>
                </div>
                <div className={styles.mapContainer}>
                    <div className={styles.map}>
                        <MapComponent usersLocation={usersLocation} position={position} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminsDashboard;
