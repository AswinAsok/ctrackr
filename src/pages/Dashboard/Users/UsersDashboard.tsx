import styles from "./UsersDashboard.module.css";

const UsersDashboard = () => {
  return (
    <div className={styles.themeContainer}>
      <div className={styles.userDashboardContainer}>
        <div className={styles.userProfileContainer}>
          <div className={styles.userProfile}>
            <img src="https://via.placeholder.com/75" alt="user" />
            <div className={styles.userProileTexts}>
              <p className={styles.userName}>Abel Varghese Shibu</p>
              <p className={styles.userEmail}>aswinasokofficial@gmail.com</p>
              <p className={styles.userPhone}>+919074750272</p>
            </div>
          </div>
          <div className={styles.adminContainer}>
            <p className={styles.adminHeading}>Admin Information</p>
            <p className={styles.adminName}>Bincy SR</p>
            <p className={styles.adminPhone}>+91984756810</p>
          </div>
        </div>
        <div className={styles.userLocationContainer}>
          <div className={styles.userLocation}>
            <p className={styles.lastUpdated}>Last Updated: 10th August 2021</p>
            <p className={styles.locationHeading}>Update Location</p>

            <button className={styles.updateLocationButton}>
              Update Location
            </button>
          </div>
        </div>
        <div className={styles.notificationsContainer}>
          <p className={styles.notificationsHeading}>Notifications</p>
          <div className={styles.notificationsContainer}>
            <div className={styles.notification}>
              <p className={styles.notificationText}>
                Your location has been updated
              </p>
              <p className={styles.notificationTime}>10th August 2021</p>
            </div>
            <div className={styles.notification}>
              <p className={styles.notificationText}>
                Your location has been updated
              </p>
              <p className={styles.notificationTime}>10th August 2021</p>
            </div>
            <div className={styles.notification}>
              <p className={styles.notificationText}>
                Your location has been updated
              </p>
              <p className={styles.notificationTime}>10th August 2021</p>
            </div>
            <div className={styles.notification}>
              <p className={styles.notificationText}>
                Your location has been updated
              </p>
              <p className={styles.notificationTime}>10th August 2021</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersDashboard;
