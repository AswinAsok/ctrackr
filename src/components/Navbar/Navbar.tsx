import styles from "./Navbar.module.css";

const Navbar = () => {
    return (
        <>
            <nav className={styles.navbarContainer}>
                <p className={styles.navbarHeaderText}>CTrackr</p>
                <button className={styles.signUpButton}>SignUp Now</button>
            </nav>
        </>
    );
};

export default Navbar;
