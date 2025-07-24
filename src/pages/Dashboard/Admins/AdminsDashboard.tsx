import { useContext, useEffect, useState } from "react";
import AppContext from "../../../contexts/appContext";
import styles from "./AdminsDashboard.module.css";
import MapComponent from "./MapComponent";

import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { calculateDistance, checkAuth } from "../../utils";
import Navbar from "../../../components/Navbar/Navbar";

import ReactTimeAgo from "react-time-ago";

const AdminsDashboard = () => {
    const { supabase } = useContext(AppContext);
    const { room_code } = useParams();
    const [users, setUsers] = useState<any[]>();
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const [position, setPosition] = useState<[number, number]>([0, 0]); // Initial map center position as state variable

    useEffect(() => {
        checkAuth({ navigate, toast });
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

            setUsersLocation(userLocationData);
        } catch (error) {
            toast.error("Error fetching user location data");
        }
    };

    useEffect(() => {
        if (!supabase) return;
        const fetchData = async () => {
            try {
                const { data: roomData, error: roomError } = await supabase
                    .from("rooms")
                    .select("id")
                    .eq("room_code", room_code)
                    .single();

                if (roomError) {
                    toast.error("Error fetching room data");
                    navigate("/");
                    return;
                }

                const roomId = roomData.id;

                // Fetch initial room members
                const { data: initialMemberData, error: initialMemberError } = await supabase
                    .from("room_members")
                    .select("user_id")
                    .eq("room_id", roomId);

                if (initialMemberError) {
                    toast.error("Error fetching initial room members");
                    return;
                }

                const initialUserIds = initialMemberData.map((member) => member.user_id);
                getUserLocation(initialUserIds);

                // Fetch initial user data
                const { data: initialUserData, error: initialUserError } = await supabase
                    .from("users")
                    .select("*")
                    .in("id", initialUserIds);

                if (initialUserError) {
                    console.error("Error fetching initial user data:", initialUserError);
                } else {
                    setUsers(initialUserData);
                }

                const handleMemberChanges = async (payload: { eventType: string }) => {
                    if (
                        payload.eventType === "INSERT" ||
                        payload.eventType === "UPDATE" ||
                        payload.eventType === "DELETE"
                    ) {
                        const { data: memberData, error: memberError } = await supabase
                            .from("room_members")
                            .select("user_id")
                            .eq("room_id", roomId);

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
                            const audio = new Audio("/ting.mp3");
                            audio.play();
                        }
                    }
                };

                const memberSubscription = supabase
                    .channel(`room_members:${roomId}`)
                    .on(
                        "postgres_changes",
                        {
                            event: "*",
                            schema: "public",
                            table: "room_members",
                            filter: `room_id=eq.${roomId}`,
                        },
                        handleMemberChanges
                    )
                    .subscribe();

                return () => {
                    memberSubscription.unsubscribe();
                };
            } catch (error) {
                console.error("Error fetching room data:", error);
            }
        };

        fetchData();
    }, [room_code]);

    const handleRefresh = () => {
        const userIds = users?.map((user) => user.id);
        getUserLocation(userIds);
        toast.success("Data refreshed successfully!");
    };

    return (
        <div className={styles.adminDashboardContainer}>
            <Navbar />
            <div className={styles.dashboard}>
                <div className={styles.leftSideContainer}>
                    <div className={styles.roomInformation}>
                        <div className={styles.roomHeading}>
                            <p className={styles.roomName}>Room Name</p>
                            <p className={styles.roomCode}>{room_code}</p>
                        </div>
                        <div className={styles.roomDetails}>
                            <div className={styles.roomDetail}>
                                <p className={styles.roomDetailHeading}>Room Members</p>
                                <p className={styles.roomDetailValue}>
                                    {users && users.length} Members
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.nearbyStudentContainer}>
                        <div className={styles.nearbyHeading}>
                            <div>
                                <p className={styles.nearByStudents}>Nearby Students</p>
                                <p className={styles.nearBySubText}>list of students near you</p>
                            </div>
                            <button className={styles.refreshButton} onClick={handleRefresh}>
                                Refresh
                            </button>
                        </div>
                        <div className={styles.searchBar}>
                            <input
                                type="text"
                                placeholder="Search"
                                className={styles.searchInput}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className={styles.nearbyStudentList}>
                            {users && users.length === 0 ? (
                                <p>No users found.</p>
                            ) : (
                                users &&
                                users
                                    .filter(
                                        (user) =>
                                            user.raw_user_meta_data.email
                                                .toLowerCase()
                                                .includes(search.toLowerCase()) ||
                                            user.raw_user_meta_data.full_name
                                                .toLowerCase()
                                                .includes(search.toLowerCase())
                                    )
                                    .map((user) => (
                                        <>
                                            <div className={styles.nearbyStudent}>
                                                <div className={styles.nearbyStudentData}>
                                                    {user?.raw_user_meta_data.full_name && (
                                                        <div className={styles.userImageContainer}>
                                                            <p className={styles.userImage}>
                                                                {user.raw_user_meta_data.full_name.substring(
                                                                    0,
                                                                    1
                                                                )}
                                                            </p>
                                                        </div>
                                                    )}
                                                    <div className={styles.nearbyStudentDetails}>
                                                        <p className={styles.nearbyStudentName}>
                                                            {user.raw_user_meta_data.full_name}
                                                        </p>
                                                        {user?.raw_user_meta_data.email && (
                                                            <p
                                                                className={
                                                                    styles.nearbyStudentLocation
                                                                }
                                                            >
                                                                {user.raw_user_meta_data.email.substring(
                                                                    0,
                                                                    user.raw_user_meta_data.email.indexOf(
                                                                        "@"
                                                                    )
                                                                )}
                                                            </p>
                                                        )}
                                                        <p className={styles.nearbyStudentPhone}>
                                                            {user.raw_user_meta_data.phone_number}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className={styles.studentLocationData}>
                                                    <p className={styles.studentLocation}>
                                                        <span>Last Updated</span>
                                                        <br />{" "}
                                                        {usersLocation &&
                                                            usersLocation[0]?.updated_at && (
                                                                <ReactTimeAgo
                                                                    date={
                                                                        usersLocation[0]?.updated_at
                                                                    }
                                                                    locale="en-US"
                                                                />
                                                            )}
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
                                                                        <p
                                                                            className={
                                                                                styles.userDistance
                                                                            }
                                                                        >
                                                                            {calculateDistance(
                                                                                {
                                                                                    latitude:
                                                                                        position[0],
                                                                                    longitude:
                                                                                        position[1],
                                                                                },
                                                                                {
                                                                                    latitude:
                                                                                        location.latitude,
                                                                                    longitude:
                                                                                        location.longitude,
                                                                                }
                                                                            ) < 1000
                                                                                ? calculateDistance(
                                                                                      {
                                                                                          latitude:
                                                                                              position[0],
                                                                                          longitude:
                                                                                              position[1],
                                                                                      },
                                                                                      {
                                                                                          latitude:
                                                                                              location.latitude,
                                                                                          longitude:
                                                                                              location.longitude,
                                                                                      }
                                                                                  ).toFixed(2) +
                                                                                  " meters"
                                                                                : calculateDistance(
                                                                                      {
                                                                                          latitude:
                                                                                              position[0],
                                                                                          longitude:
                                                                                              position[1],
                                                                                      },
                                                                                      {
                                                                                          latitude:
                                                                                              location.latitude,
                                                                                          longitude:
                                                                                              location.longitude,
                                                                                      }
                                                                                  ).toFixed(2) +
                                                                                  " km"}{" "}
                                                                        </p>
                                                                    </>
                                                                ))}
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    ))
                            )}
                        </div>
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
