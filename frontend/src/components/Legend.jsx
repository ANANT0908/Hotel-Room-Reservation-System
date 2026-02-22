import styles from './HotelGrid.module.css';

export default function Legend({ rooms = [] }) {
  // Calculate counts
  const availableCount = rooms.filter(r => r.status === 'available').length;
  const occupiedCount = rooms.filter(r => r.status === 'occupied').length;
  const bookedCount = rooms.filter(r => r.status === 'booked').length;

  // Note: 'Just Booked' is a transient UI state, we can count the ones that would be highlighted
  // but usually it refers to rooms with status 'booked' that were recently updated.
  // For the legend, we'll keep it simple or just show the main counts.

  return (
    <div className={styles.legend}>
      <div className={styles.legendSection}>
        <h3 className={styles.legendTitle}>Status</h3>
        <div className={styles.legendItems}>
          <div className={styles.legendItem}>
            <div className={`${styles.dot} ${styles.available}`} />
            <span>Available ({availableCount})</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.dot} ${styles.occupied}`} />
            <span>Occupied ({occupiedCount})</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.dot} ${styles.booked}`} />
            <span>Booked ({bookedCount})</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.dot} ${styles.justBooked}`} />
            <span>New Booking</span>
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
