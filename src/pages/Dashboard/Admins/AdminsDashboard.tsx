import { useContext, useEffect, useState } from "react";
import AppContext from "../../../contexts/appContext";
import styles from "./AdminsDashboard.module.css";
import MapComponent from "./MapComponent";

import { useParams } from "react-router-dom";

const AdminsDashboard = () => {
    const { supabase } = useContext(AppContext);
    const { room_code } = useParams();
    const [users, setUsers] = useState<any[]>();

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
                    console.error("Error fetching room data:", roomError);
                    return;
                }

                const { data: memberData, error: memberError } = await supabase
                    .from("room_members")
                    .select("user_id")
                    .eq("room_id", roomData.id);

                if (memberError) {
                    console.error("Error fetching member data:", memberError);
                    return;
                }

                const userIds = memberData.map((member) => member.user_id);

                const { data: userData, error: userError } = await supabase
                    .from("users")
                    .select("*")
                    .in("id", userIds);

                if (userError) {
                    console.error("Error fetching user data:", userError);
                } else {
                    console.log(userData);
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
                        <input
                            type="text"
                            placeholder="Search"
                            className={styles.searchInput}
                        />
                    </div>
                    <div className={styles.nearbyStudentList}>
                        {users &&
                            users.map((user) => (
                                <>
                                    <div className={styles.nearbyStudent}>
                                        <div
                                            className={styles.nearbyStudentData}
                                        >
                                            <img
                                                src="https://via.placeholder.com/100"
                                                alt=""
                                                className={
                                                    styles.nearbyStudentImage
                                                }
                                            />
                                            <div
                                                className={
                                                    styles.nearbyStudentDetails
                                                }
                                            >
                                                <p
                                                    className={
                                                        styles.nearbyStudentName
                                                    }
                                                >
                                                    {
                                                        user.raw_user_meta_data
                                                            .full_name
                                                    }
                                                </p>
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
                                                <p
                                                    className={
                                                        styles.nearbyStudentPhone
                                                    }
                                                >
                                                    {
                                                        user.raw_user_meta_data
                                                            .phone_number
                                                    }
                                                </p>
                                            </div>
                                            <button
                                                className={styles.alertButton}
                                            >
                                                Alert
                                            </button>
                                        </div>
                                        <div
                                            className={
                                                styles.studentLocationData
                                            }
                                        >
                                            <p
                                                className={
                                                    styles.studentLocation
                                                }
                                            >
                                                Last Updated: 10:57p.m.
                                            </p>
                                            <p
                                                className={
                                                    styles.studentLocationValue
                                                }
                                            >
                                                1.25Km Away
                                            </p>
                                        </div>
                                    </div>
                                </>
                            ))}
                    </div>
                </div>
                <div className={styles.mapContainer}>
                    <div className={styles.map}>
                        <MapComponent />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminsDashboard;
