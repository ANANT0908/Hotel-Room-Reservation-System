import styles from './Header.module.css';

export default function Header({ stats, loading }) {
  return (
    <header className={styles.header}>
      {/* Left section: Logo and title */}
      <div className={styles.left}>
        <div className={styles.logo}>⬡</div>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>
            Hotel<span className={styles.highlight}>Reserve</span>
          </h1>
          <p className={styles.subtitle}>Room Management System</p>
        </div>
      </div>

      {/* Center section: Stats*/}
      <div className={styles.statsContainer}>
        <div className={styles.statPill}>
          <div className={styles.stat}>
            <span className={styles.label}>Available</span>
            <span className={`${styles.value} ${styles.green}`}>{stats.available}</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.stat}>
            <span className={styles.label}>Occupied</span>
            <span className={`${styles.value} ${styles.red}`}>{stats.occupied}</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.stat}>
            <span className={styles.label}>Booked</span>
            <span className={`${styles.value} ${styles.blue}`}>{stats.booked}</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.stat}>
            <span className={styles.label}>Total</span>
            <span className={styles.value}>{stats.total}</span>
          </div>
        </div>
      </div>

      {/* Right section: Live indicator */}
      <div className={styles.right}>
        {loading && (
          <div className={styles.liveIndicator}>
            <div className={styles.dot} />
            <span>Live</span>
          </div>
        )}
      </div>
    </header>
  );
}
