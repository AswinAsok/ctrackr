import styles from "./AdminsDashboard.module.css";
import MapComponent from "./MapComponent";

const AdminsDashboard = () => {
  return (
    <div className={styles.adminDashboardContainer}>
      <div className={styles.dashboard}>
        <div className={styles.nearbyStudentContainer}>
          <div className={styles.nearbyHeading}>
            <p className={styles.nearByStudents}>Nearby Students</p>
            <p className={styles.nearbyFilter}>Filter</p>
          </div>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search"
              className={styles.searchInput}
            />
          </div>
          <div className={styles.nearbyStudentList}>
            {[...Array(10)].map((_, index) => (
              <div key={index} className={styles.nearbyStudent}>
                <div className={styles.nearbyStudentData}>
                  <img
                    src="https://via.placeholder.com/100"
                    alt=""
                    className={styles.nearbyStudentImage}
                  />
                  <div className={styles.nearbyStudentDetails}>
                    <p className={styles.nearbyStudentName}>John Doe</p>
                    <p className={styles.nearbyStudentLocation}>
                      aswinasokofficial@gmail.com
                    </p>
                    <p className={styles.nearbyStudentPhone}>+919074750272</p>
                  </div>
                  <button className={styles.alertButton}>Alert</button>
                </div>
                <div className={styles.studentLocationData}>
                  <p className={styles.studentLocation}>
                    Last Updated: 10:57p.m.
                  </p>
                  <p className={styles.studentLocationValue}>1.25Km Away</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.mapContainer}>
          <div className={styles.map}>
            <MapComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminsDashboard;
