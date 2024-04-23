import { useContext, useEffect, useState } from "react";
import styles from "./UsersDashboard.module.css";
import AppContext from "../../../contexts/appContext";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { checkAuth, getFormattedDate } from "../../utils";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

const UsersDashboard = () => {
    const { supabase } = useContext(AppContext);
    const [userData, setUserData] = useState<any>();
    const [adminData, setAdminData] = useState<any>();
    const navigate = useNavigate();
    // const [userId, setUserId] = useState("");
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);

    const [lastUpdated, setLastUpdated] = useState("");

    const { room_code } = useParams();

    const updateLocation = async () => {
        if (!supabase) return;
        const userEmail = JSON.parse(localStorage.getItem("userObject")!).email;
        const userId = JSON.parse(localStorage.getItem("userObject")!).id;
        const { error } = await supabase
            .from("user_location")
            .update({
                user_id: userId,
                latitude: latitude,
                longitude: longitude,
                email: userEmail,
                updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId);

        if (error) {
            toast.error("Error updating user location. Please try again.");
        } else {
            toast.success("Location updated successfully!");

            setLastUpdated(getFormattedDate());
        }
    };

    const getUser = async () => {
        if (!supabase) return;
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            toast.error("Error fetching user data");
        } else {
            setUserData(data.user.user_metadata);
        }

        const { data: roomData, error: roomError } = await supabase
            .from("rooms")
            .select("admin_user_id")
            .eq("room_code", room_code)
            .single();
        if (roomError) {
            console.error("Error fetching room data:", roomError);
            return;
        }
        const { data: adminData, error: adminError } = await supabase
            .from("users")
            .select("*")
            .eq("id", roomData.admin_user_id);
        if (adminError) {
            console.error("Error fetching admin data:", adminError);
            return;
        }
        setAdminData(adminData[0].raw_user_meta_data);
    };
    useEffect(() => {
        checkAuth({ navigate, toast });
        getUser();

        const getUserLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLatitude(position.coords.latitude);
                        setLongitude(position.coords.longitude);
                    },
                    (error) => {
                        console.error("Error getting user location:", error.message);
                    }
                );
            } else {
                console.error("Geolocation is not supported by this browser.");
            }
        };

        getUserLocation();
        updateLocation();
    }, [supabase]);

    return (
        <>
            <div className={styles.themeContainer}>
                <Navbar />
                <div className={styles.userDashboardContainer}>
                    <div className={styles.userProfileContainer}>
                        <div className={styles.userProfile}>
                            <img src="https://via.placeholder.com/75" alt="user" />
                            {userData && (
                                <div className={styles.userProileTexts}>
                                    <p className={styles.userName}>{userData?.full_name}</p>
                                    <p className={styles.userEmail}>{userData?.email}</p>
                                    <p className={styles.userPhone}>
                                        {userData?.phone_number || "No Phone Number Provided"}
                                    </p>
                                </div>
                            )}
                        </div>
                        {adminData && (
                            <div
                                className={styles.adminContainer}
                                style={{
                                    textAlign: "right",
                                }}
                            >
                                <p className={styles.adminName}>Administrator Info</p>
                                <p className={styles.adminHeading}>{adminData.full_name}</p>
                                <p className={styles.userEmail}>{adminData.email}</p>
                                <p className={styles.userEmail}>{adminData.phone_number}</p>
                            </div>
                        )}
                    </div>
                    <div className={styles.userLocationContainer}>
                        <div className={styles.userLocation}>
                            <p className={styles.lastUpdated}>Last Updated: {lastUpdated}</p>
                            <p className={styles.locationHeading}>Update Location</p>

                            <button
                                onClick={updateLocation}
                                className={styles.updateLocationButton}
                            >
                                Update Location
                            </button>
                        </div>
                    </div>
                    <div className={styles.notificationsContainer}>
                        <p className={styles.notificationsHeading}>Notifications</p>
                        <div className={styles.notificationsContainer}>
                            <div className={styles.notification}>
                                <p className={styles.notificationText}>
                                    Your location has been updated
                                </p>
                                <p className={styles.notificationTime}>10th August 2021</p>
                            </div>
                            <div className={styles.notification}>
                                <p className={styles.notificationText}>
                                    Your location has been updated
                                </p>
                                <p className={styles.notificationTime}>10th August 2021</p>
                            </div>
                            <div className={styles.notification}>
                                <p className={styles.notificationText}>
                                    Your location has been updated
                                </p>
                                <p className={styles.notificationTime}>10th August 2021</p>
                            </div>
                            <div className={styles.notification}>
                                <p className={styles.notificationText}>
                                    Your location has been updated
                                </p>
                                <p className={styles.notificationTime}>10th August 2021</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default UsersDashboard;
