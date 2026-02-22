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
      {/* Lift & Stairs column */}
      <div className={styles.liftColumn}>
        <div className={styles.liftLabel}>Lift & Stairs</div>
        <div className={styles.liftArea}>
          <div className={styles.liftShaft}>
            <div className={styles.liftTrack}>
              <div className={styles.liftElevator}>
                <div className={styles.liftLights} />
              </div>
            </div>
          </div>
        </div>
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
                className={styles.roomStrip}
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
            </div>
          );
        })}
      </div>

    </div>
  );
}
