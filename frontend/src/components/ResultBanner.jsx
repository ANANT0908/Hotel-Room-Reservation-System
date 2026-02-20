import styles from './ResultBanner.module.css';

export default function ResultBanner({ booking, error, onDismiss }) {
  if (!booking && !error) {
    return null;
  }

  if (error) {
    return (
      <div className={`${styles.banner} ${styles.error}`}>
        <div className={styles.icon}>⚠</div>
        <div className={styles.content}>
          <p className={styles.message}>{error}</p>
        </div>
        <button className={styles.dismiss} onClick={onDismiss}>
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className={`${styles.banner} ${styles.success}`}>
      <div className={styles.icon}>✓</div>
      <div className={styles.content}>
        <p className={styles.headline}>
          {booking.rooms.length} room{booking.rooms.length !== 1 ? 's' : ''} booked · {booking.floorLabel}
        </p>
        <div className={styles.roomTags}>
          {booking.rooms.map((roomNumber) => (
            <span key={roomNumber} className={styles.tag}>
              {roomNumber}
            </span>
          ))}
        </div>
      </div>
      <button className={styles.dismiss} onClick={onDismiss}>
        ✕
      </button>
    </div>
  );
}
