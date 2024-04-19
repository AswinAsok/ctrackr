import { useContext, useState } from "react";
import AppContext from "../../contexts/appContext";
import styles from "./Login.module.css";
import { login } from "./services";

import { useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";

const Login = () => {
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { supabase } = useContext(AppContext);
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const username = (e.target as HTMLFormElement).username.value;
        const password = (e.target as HTMLFormElement).password.value;
        if (supabase) {
            login(username, password, supabase, navigate, setLoading);
        }
    };

    return (
        <div className={styles.themeContainer}>
            <div className={styles.authContainer}>
                <p className={styles.authHeader}>Login to CTrackr</p>
                <form onSubmit={handleSubmit} className={styles.formContainer}>
                    <input
                        type="email"
                        name="username"
                        placeholder="Email"
                        required
                        className={styles.authInput}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        className={styles.authInput}
                    />
                    <button type="submit" className={styles.authButton}>
                        Log In
                        <PulseLoader loading={loading} color="#ffffff" size={10}/>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
