import { useContext } from "react";
import AppContext from "../../contexts/appContext";
import styles from "./Login.module.css";

const Signup = () => {
  const { supabase } = useContext(AppContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.target as HTMLFormElement).email.value;
    const password = (e.target as HTMLFormElement).password.value;

    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        console.error("Error signing up:", error.message);
      } else {
        console.log("User signed up successfully:", data);
      }
    }
  };

  return (
    <div className={styles.themeContainer}>
      <div className={styles.authContainer}>
        <h1 className={styles.authHeader}>Sign Up</h1>
        <form onSubmit={handleSubmit}>
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
