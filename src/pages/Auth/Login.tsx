import { useContext, useEffect, useState } from "react";
import AppContext from "../../contexts/appContext";
import styles from "./Login.module.css";
import { login } from "./services";

import { Link, useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import Navbar from "../../components/Navbar/Navbar";

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

    useEffect(() => {
        localStorage.removeItem("userObject");
    }, []);

    return (
        <div className={styles.themeContainer}>
            <Navbar />
            <div className={styles.authContainer}>
                <div className={styles.authLeftSide}>
                    <p className={styles.leftSideFeatures}>Fast • Efficient • Reliable</p>
                    <p className={styles.authLeftText}>Tracking made easy with ease with CTrackr</p>
                    <p className={styles.authLeftSubText}>
                        Track your peers easily and efficiently in real-time and get the best out of
                        your journey.
                    </p>
                </div>
                <div className={styles.authRightSide}>
                    <p className={styles.authHeader}>Login to CTrackr Now</p>
                    <p className={styles.authSubHeader}>
                        Start Managing Your Peers Faster and Better
                    </p>
                    <form onSubmit={handleSubmit} className={styles.formContainer}>
                        <div className={styles.inputContainer}>
                            <p className={styles.inputLabel}>Enter Your email address*</p>
                            <input
                                type="email"
                                name="username"
                                placeholder="johndoe@gmail.com"
                                required
                                className={styles.authInput}
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <p className={styles.inputLabel}>Enter Password*</p>
                            <input
                                type="password"
                                name="password"
                                placeholder="******"
                                required
                                className={styles.authInput}
                            />
                        </div>
                        <div className={styles.buttons}>
                            <button type="submit" className={styles.authButton}>
                                Log In
                                <PulseLoader loading={loading} color="#ffffff" size={10} />
                            </button>
                            <Link to="/signup">
                                <button className={styles.secondaryAuthButton}>Sign Up</button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
