import RoomCell from './RoomCell';
import styles from './HotelGrid.module.css';

export default function HotelGrid({ rooms, newlyBookedIds, loading }) {
  // Group rooms by floor
  const roomsByFloor = {};
  rooms.forEach((room) => {
    if (!roomsByFloor[room.floor]) {
      roomsByFloor[room.floor] = [];
    }
    roomsByFloor[room.floor].push(room);
  });

  // Sort rooms within each floor by position
  Object.keys(roomsByFloor).forEach((floor) => {
    roomsByFloor[floor].sort((a, b) => a.position - b.position);
  });

  // Floors in descending order (10 to 1)
  const floors = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

  return (
    <div className={styles.hotelGrid}>
      {/* Lift column */}
      <div className={styles.liftColumn}>
        <div className={styles.liftLabel}>Lift & Stairs</div>
        <div className={styles.liftShaft}>
          <div className={styles.liftElevator}>🛗</div>
        </div>
        <div className={styles.liftBase} />
      </div>

      {/* Floors column */}
      <div className={styles.floorsColumn}>
        {floors.map((floor) => {
          const floorRooms = roomsByFloor[floor] || [];
          const availableCount = floorRooms.filter((r) => r.status === 'available').length;
          const totalCount = floorRooms.length;

          // For floor 10, add placeholders
          const displayRooms = [...floorRooms];
          if (floor === 10) {
            while (displayRooms.length < 10) {
              displayRooms.push(null);
            }
          }

          return (
            <div key={floor} className={styles.floorRow}>
              {/* Floor label */}
              <div className={styles.floorLabel}>
                <span>F{floor}</span>
                {floor === 10 && <span className={styles.topBadge}>TOP</span>}
              </div>

              {/* Room strip */}
              <div
                className={`${styles.roomStrip} ${
                  displayRooms.some((r) => r && newlyBookedIds.has(r.roomNumber))
                    ? styles.newBooking
                    : displayRooms.some((r) => r && r.status === 'booked')
                    ? styles.booked
                    : ''
                }`}
              >
                {displayRooms.map((room, idx) =>
                  room ? (
                    <RoomCell
                      key={room.roomNumber}
                      room={room}
                      isNew={newlyBookedIds.has(room.roomNumber)}
                    />
                  ) : (
                    <div key={`placeholder-${idx}`} className={styles.placeholder} />
                  )
                )}
              </div>

              {/* Availability bar */}
              <div className={styles.availabilityBar}>
                <div
                  className={styles.availabilityFill}
                  style={{
                    width: `${(availableCount / Math.max(totalCount, 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend sidebar */}
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
    </div>
  );
}
