import styles from "./Footer.module.css";

const Footer = () => {
    return (
        <div className={styles.footerContainer}>
            <div className={styles.footerTexts}>
               
                <p className={styles.footerSubText}>© 2024 CTrackr. All rights reserved.</p>
            </div>
        </div>
    );
};

export default Footer;
