import React from 'react';
import styles from './RoomCell.module.css';

const RoomCell = React.memo(({ room, isNew }) => {
  const statusClass = {
    available: styles.available,
    occupied: styles.occupied,
    booked: styles.booked,
  }[room.status];

  const isNewClass = isNew ? styles.new : '';

  const title = `Room ${room.roomNumber} · ${room.status.charAt(0).toUpperCase() + room.status.slice(1)}`;

  return (
    <div className={`${styles.roomCell} ${statusClass} ${isNewClass}`} title={title}>
      <span className={styles.number}>{room.roomNumber}</span>
      <div className={styles.dot} />
    </div>
  );
});

RoomCell.displayName = 'RoomCell';

export default RoomCell;
