import { useContext } from "react";
import AppContext from "../../contexts/appContext";
import styles from "./Login.module.css";
import { signup } from "./services";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

const Signup = () => {
    const { supabase } = useContext(AppContext);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const email = (e.target as HTMLFormElement).email.value;
        const password = (e.target as HTMLFormElement).password.value;
        const fullName = (e.target as HTMLFormElement).fullName.value;
        const phoneNumber = (e.target as HTMLFormElement).phoneNumber.value;
        const admissionNumber = (e.target as HTMLFormElement).admissionNumber.value;

        if (supabase) {
            // Assuming the signup function or another service function will handle these new fields
            signup(email, password, fullName, phoneNumber, admissionNumber, supabase, navigate);
        }
    };

    return (
        <div className={styles.themeContainer}>
            <Navbar />
            <div className={styles.authContainer}>
                <div className={styles.authLeftSide}>
                    <p className={styles.leftSideFeatures}>Fast • Efficient • Reliable</p>
                    <p className={styles.authLeftText}>Hey Travellers, Welcome to CTrackr</p>
                    <p className={styles.authLeftSubText}>
                        Track your peers easily and efficiently in real-time and get the best out of
                        your journey.
                    </p>
                </div>
                <div className={styles.authRightSide}>
                    <h1 className={styles.authHeader}>Sign Up to CTrackr</h1>
                    <p className={styles.authSubHeader}>
                        Start Managing Your Peers Faster and Better
                    </p>
                    <form onSubmit={handleSubmit} className={styles.formContainer}>
                        <div className={styles.inputContainer}>
                            <p className={styles.inputLabel}>Enter Your email address*</p>
                            <input
                                type="email"
                                name="email"
                                placeholder="johndoe@gmail.com"
                                required
                                className={styles.authInput}
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <p className={styles.inputLabel}>Set Your Password*</p>
                            <input
                                type="password"
                                name="password"
                                placeholder="******"
                                required
                                className={styles.authInput}
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <p className={styles.inputLabel}>Enter Your Full Name*</p>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="John Doe"
                                required
                                className={styles.authInput}
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <p className={styles.inputLabel}>Enter Your Phone Number*</p>
                            <input
                                type="tel"
                                name="phoneNumber"
                                placeholder="9856748595"
                                required
                                className={styles.authInput}
                            />
                        </div>

                        <div className={styles.inputContainer}>
                            <p className={styles.inputLabel}>Enter Your Admission Number*</p>
                            <input
                                type="text"
                                name="admissionNumber"
                                placeholder="21/7108"
                                required
                                className={styles.authInput}
                            />
                        </div>
                        <div className={styles.buttons}>
                            <button type="submit" className={styles.authButton}>
                                Sign Up
                            </button>
                            <Link to="/">
                                <button className={styles.secondaryAuthButton}>Login</button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
