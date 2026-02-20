import styles from './BookingHistory.module.css';

function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function BookingHistory({ bookings }) {
  return (
    <div className={styles.bookingHistory}>
      <div className={styles.header}>
        <h2 className={styles.title}>Booking Log</h2>
        <span className={styles.count}>{bookings.length}</span>
      </div>

      <div className={styles.content}>
        {bookings.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📋</div>
            <p className={styles.emptyText}>No bookings yet</p>
            <p className={styles.emptyHint}>Bookings will appear here</p>
          </div>
        ) : (
          <div className={styles.bookingsList}>
            {bookings.map((booking, index) => (
              <div
                key={booking.bookingId}
                className={styles.bookingCard}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className={styles.cardTop}>
                  <div className={styles.summary}>
                    <span className={styles.count}>
                      {booking.roomCount} room{booking.roomCount !== 1 ? 's' : ''}
                    </span>
                    <span className={styles.separator}>·</span>
                    <span className={styles.floor}>{booking.floorLabel}</span>
                  </div>
                  <div className={styles.meta}>
                    <span className={styles.travelTimeBadge}>{booking.travelTime} min</span>
                    <span className={styles.timeAgo}>{timeAgo(booking.createdAt)}</span>
                  </div>
                </div>
                <div className={styles.cardBottom}>
                  {booking.rooms.map((room) => (
                    <span key={room.roomNumber} className={styles.roomChip}>
                      {room.roomNumber}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
