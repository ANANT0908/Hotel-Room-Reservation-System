import styles from './HotelGrid.module.css';

export default function Legend() {
  return (
    <div className={styles.legend}>
      <div className={styles.legendSection}>
        <h3 className={styles.legendTitle}>Status</h3>
        <div className={styles.legendItems}>
          <div className={styles.legendItem}>
            <div className={`${styles.dot} ${styles.available}`} />
            <span>Available</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.dot} ${styles.occupied}`} />
            <span>Occupied</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.dot} ${styles.booked}`} />
            <span>Booked</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.dot} ${styles.justBooked}`} />
            <span>Just Booked</span>
          </div>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.legendSection}>
        <h3 className={styles.legendTitle}>Travel Time</h3>
        <div className={styles.formulaRows}>
          <div className={styles.formulaRow}>
            <span className={styles.label}>Horizontal:</span>
            <span className={styles.value}>1 min/room</span>
          </div>
          <div className={styles.formulaRow}>
            <span className={styles.label}>Vertical:</span>
            <span className={styles.value}>2 min/floor</span>
          </div>
        </div>
      </div>
    </div>
  );
}
