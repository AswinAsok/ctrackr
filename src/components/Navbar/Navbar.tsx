import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userObject, setUserObject] = useState<any>();
  useEffect(() => {
    setUserObject(JSON.parse(localStorage.getItem("userObject")!));
    if (userObject != "") {
      setIsAuthenticated(true);
      console.log(userObject);
    }
  }, []);

  return (
    <>
      <nav className={styles.navbarContainer}>
        <p className={styles.navbarHeaderText}>CTrackr</p>
        {isAuthenticated && userObject != "" && userObject?.email ? (
          <>
            <div className={styles.row}>
              <p className={styles.welcomeText}>
                Hi,{" "}
                {userObject?.email.substring(0, userObject?.email.indexOf("@"))}
              </p>
              <Link to="/">
                <button className={styles.signUpButton}>Logout</button>
              </Link>
            </div>
          </>
        ) : (
          <Link to="/signup">
            <button className={styles.signUpButton}>SignUp Now</button>
          </Link>
        )}
      </nav>
    </>
  );
};

export default Navbar;
