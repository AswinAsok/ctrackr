import { useContext } from "react";
import AppContext from "../../contexts/appContext";
import styles from "./Login.module.css";

const Login = () => {
  const { supabase } = useContext(AppContext);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = (e.target as HTMLFormElement).username.value;
    const password = (e.target as HTMLFormElement).password.value;
    if (supabase) {
      supabase.auth.signInWithPassword({ email: username, password: password });
    }
  };

  return (
    <div className={styles.themeContainer}>
      <div className={styles.authContainer}>
        <h1 className={styles.authHeader}>Login</h1>
        <form onSubmit={handleSubmit}>
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
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
