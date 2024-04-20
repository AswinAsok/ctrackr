import { useContext } from "react";
import AppContext from "../../contexts/appContext";
import styles from "./Login.module.css";
import { signup } from "./services";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const { supabase } = useContext(AppContext);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const email = (e.target as HTMLFormElement).email.value;
        const password = (e.target as HTMLFormElement).password.value;
        const fullName = (e.target as HTMLFormElement).fullName.value;
        const phoneNumber = (e.target as HTMLFormElement).phoneNumber.value;
        const admissionNumber = (e.target as HTMLFormElement).admissionNumber
            .value;

        if (supabase) {
            // Assuming the signup function or another service function will handle these new fields
            signup(
                email,
                password,
                fullName,
                phoneNumber,
                admissionNumber,
                supabase,
                navigate
            );
        }
    };

    return (
        <div className={styles.themeContainer}>
            <div className={styles.authContainer}>
                <h1 className={styles.authHeader}>Sign Up to CTrackr</h1>
                <form onSubmit={handleSubmit} className={styles.formContainer}>
                    <input
                        type="email"
                        name="email"
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
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        required
                        className={styles.authInput}
                    />
                    <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        required
                        className={styles.authInput}
                    />
                    <input
                        type="text"
                        name="admissionNumber"
                        placeholder="Admission Number"
                        required
                        className={styles.authInput}
                    />
                    <button type="submit" className={styles.authButton}>
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
