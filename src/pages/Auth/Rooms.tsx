import { useContext, useEffect, useState } from "react";
import AppContext from "../../contexts/appContext";

import styles from "./Login.module.css";
import { PulseLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { checkAuth } from "../utils";

const Rooms = () => {
    const { supabase } = useContext(AppContext);
    const [roomCode, setRoomCode] = useState("");
    const [myRooms, setMyRooms] = useState<any>([]); // [room_code, room_code, ...
    const navigate = useNavigate();

    const [coordinates, setCoordinates] = useState({
        latitude: 0,
        longitude: 0,
    });

    const [loading, setLoading] = useState({
        createRoom: false,
        addUserToRoom: false,
    });

    useEffect(() => {
        checkAuth({ navigate, toast });

        let localCoordinates = {
            latitude: 0,
            longitude: 0,
        };
        navigator.geolocation.getCurrentPosition(
            (position) => {
                localCoordinates = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                setCoordinates(localCoordinates);
            },
            (error) => {
                console.error("Error getting location:", error);
                toast.error("Error getting location. Please try again.");
            }
        );

        getMyRooms();
    }, []);

    const getMyRooms = async () => {
        if (!supabase) return;
        const { data: rooms, error } = await supabase
            .from("rooms")
            .select("room_code")
            .eq("admin_user_id", JSON.parse(localStorage.getItem("userObject")!).id);

        if (error) {
            console.error("Error fetching rooms:", error);
        } else {
            setMyRooms(rooms);
            console.log("Rooms:", rooms);
        }
    };

    const createRoom = async () => {
        if (supabase) {
            setLoading({
                createRoom: true,
                addUserToRoom: false,
            });
            const roomCode = generateRoomCode();
            const { error } = await supabase
                .from("rooms")
                .insert({
                    room_code: roomCode,
                    admin_user_id: JSON.parse(localStorage.getItem("userObject")!).id,
                })
                .single();

            if (error) {
                console.error("Error creating room:", error);
                toast.error("Error creating room. Please try again.");
            } else {
                toast.success("Room created successfully!");
                navigate("/admin/dashboard/" + roomCode);
            }

            setLoading({
                createRoom: false,
                addUserToRoom: false,
            });
        }
    };

    const updateLocation = async () => {
        if (!supabase) return;

        const userId = JSON.parse(localStorage.getItem("userObject")!).id;
        const latitude = coordinates.latitude;
        const longitude = coordinates.longitude;
        const userData = JSON.parse(localStorage.getItem("userObject")!);

        const { error } = await supabase
            .from("user_location")
            .update({
                user_id: userId,
                latitude: latitude,
                longitude: longitude,
                email: userData.email,
                updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId);

        if (error) {
            toast.error("Error updating user location. Please try again.");
        }
    };

    const addUserToRoom = async () => {
        if (!roomCode || roomCode.length == 0) {
            toast.error("Please enter a room code.");
            return;
        }

        if (!supabase) return;
        setLoading({
            createRoom: false,
            addUserToRoom: true,
        });
        const { data: rooms, error: roomError } = await supabase
            .from("rooms")
            .select("id")
            .eq("room_code", roomCode)
            .single();

        if (roomError) {
            toast.error("Error retrieving room. Please try again.");
            setLoading({
                createRoom: false,
                addUserToRoom: false,
            });
            return;
        }

        const roomId = rooms.id;

        const { data: membership, error: membershipError } = await supabase
            .from("room_members")
            .insert({
                room_id: roomId,
                user_id: JSON.parse(localStorage.getItem("userObject")!).id,
            });

        if (membershipError) {
            if (membershipError.code === "23505") {
                toast.error("User already added to room.");
                updateLocation();
                navigate("/user/dashboard/" + roomCode);
            } else {
                console.error("Error adding user to room:", membershipError);
                toast.error("Error adding user to room. Please try again.");
            }
        } else {
            console.log("User added to room:", membership);
            toast.success("User added to room successfully!");

            const { error } = await supabase.from("user_location").insert({
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
                user_id: JSON.parse(localStorage.getItem("userObject")!).id,
                updated_at: new Date().toISOString(),
                email: JSON.parse(localStorage.getItem("userObject")!).email,
            });

            if (error) {
                console.error("Error updating user location:", error);
                toast.error("Error updating user location. Please try again.");
            }

            navigate("/user/dashboard/" + roomCode);
        }

        setLoading({
            createRoom: false,
            addUserToRoom: false,
        });
    };

    const generateRoomCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    return (
        <div className={styles.themeContainer}>
            <Navbar />
            <div className={styles.authContainer}>
                <div className={styles.authLeftSide}>
                    <p className={styles.leftSideFeatures}>Create • Share • Track</p>
                    <p className={styles.authLeftText}>Create a room or join an existing room.</p>
                    <p className={styles.authLeftSubText}>
                        Create a room to track your peers or join an existing room to be tracked by
                        your peers.
                    </p>
                </div>

                <div className={styles.formContainer}>
                    <h2 className={styles.authHeader}>Room Manager</h2>
                    <p className={styles.authSubHeader}>
                        Click below to create a room or enter a room code to join an existing room.
                    </p>
                    <button className={styles.authButton} onClick={createRoom}>
                        Create Room{" "}
                        <PulseLoader loading={loading.createRoom} color="#ffffff" size={10} />
                    </button>
                    <div className={styles.orDivider}>
                        <hr />
                        <span>OR</span>
                        <hr />
                    </div>
                    <form className={styles.joinRoom}>
                        <div className={styles.inputContainer}>
                            <p className={styles.inputLabel}>Enter Room Code*</p>
                            <input
                                type="text"
                                value={roomCode}
                                onChange={(e) => setRoomCode(e.target.value)}
                                placeholder="Enter room code"
                                className={styles.authInput}
                            />
                        </div>
                        <button
                            className={styles.authButton}
                            onClick={(e) => {
                                e.preventDefault();
                                addUserToRoom();
                            }}
                        >
                            Join Room
                            <PulseLoader
                                loading={loading.addUserToRoom}
                                color="#ffffff"
                                size={10}
                            />
                        </button>
                    </form>
                </div>
            </div>
            {myRooms && myRooms.length > 0 && (
                <div className={styles.myRoomsContainer}>
                    <h2 className={styles.authHeader}>My Rooms</h2>
                    <div className={styles.myRooms}>
                        {myRooms.map((room: any, index: number) => (
                            <div key={index} className={styles.myRoom}>
                                <p>{room.room_code}</p>
                                <button
                                    onClick={() => {
                                        navigate("/admin/dashboard/" + room.room_code);
                                    }}
                                >
                                    Manage
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Rooms;
