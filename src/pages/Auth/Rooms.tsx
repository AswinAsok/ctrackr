import { useContext, useState } from "react";
import AppContext from "../../contexts/appContext";

import styles from "./Login.module.css";

const Rooms = () => {
    const { supabase } = useContext(AppContext);
    const [roomCode, setRoomCode] = useState("");

    const createRoom = async () => {
        if (supabase) {
            const roomCode = generateRoomCode();
            const { data, error } = await supabase
                .from("rooms")
                .insert({
                    room_code: roomCode,
                    admin_user_id: JSON.parse(
                        localStorage.getItem("userObject")!
                    ).id,
                })
                .single();

            if (error) {
                console.error("Error creating room:", error);
            } else {
                console.log("Room created:", data);
                // Redirect or perform any other necessary actions
            }
        }
    };

    const addUserToRoom = async () => {
        if (!supabase) return;
        const { data: rooms, error: roomError } = await supabase
            .from("rooms")
            .select("id")
            .eq("room_code", roomCode)
            .single();

        console.log(rooms);

        if (roomError) {
            console.error("Error retrieving room:", roomError);
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
            console.error("Error adding user to room:", membershipError);
        } else {
            console.log("User added to room:", membership);
            // Redirect or perform any other necessary actions
        }
    };

    const generateRoomCode = () => {
        // Generate a random 6-digit room code
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    return (
        <div className={styles.themeContainer}>
            <div className={styles.formContainer}>
                <h2 className={styles.authHeader}>Room Manager</h2>
                <button className={styles.authButton} onClick={createRoom}>
                    Create Room
                </button>
                <div className={styles.orDivider}>
                    <hr />
                    <span>OR</span>
                    <hr />
                </div>
                <div className={styles.joinRoom}>
                    <input
                        type="text"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                        placeholder="Enter room code"
                        className={styles.authInput}
                    />
                    <button
                        className={styles.authButton}
                        onClick={addUserToRoom}
                    >
                        Join Room
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Rooms;