import { useContext } from "react";
import AppContext from "../../contexts/appContext";
import styles from "./Login.module.css";
import { signup } from "./services";

const Signup = () => {
    const { supabase } = useContext(AppContext);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const email = (e.target as HTMLFormElement).email.value;
        const password = (e.target as HTMLFormElement).password.value;

        if (supabase) {
            signup(email, password, supabase);
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
                    <button type="submit" className={styles.authButton}>
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
