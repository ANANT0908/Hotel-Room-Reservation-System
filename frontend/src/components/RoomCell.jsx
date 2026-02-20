import React from 'react';
import styles from './RoomCell.module.css';

const RoomCell = React.memo(({ room, isNew, isSelected, onToggleSelect }) => {
  const statusClass = {
    available: styles.available,
    occupied: styles.occupied,
    booked: styles.booked,
  }[room.status];

  const isNewClass = isNew ? styles.new : '';
  const isSelectedClass = isSelected ? styles.selected : '';
  const isClickable = room.status === 'available' ? styles.clickable : '';

  const title = `Room ${room.roomNumber} · ${room.status.charAt(0).toUpperCase() + room.status.slice(1)}`;

  const handleClick = () => {
    if (room.status === 'available') {
      onToggleSelect?.(room.roomNumber);
    }
  };

  return (
    <div 
      className={`${styles.roomCell} ${statusClass} ${isNewClass} ${isSelectedClass} ${isClickable}`} 
      title={title}
      onClick={handleClick}
      role="button"
      tabIndex={room.status === 'available' ? 0 : -1}
    >
      <span className={styles.number}>{room.roomNumber}</span>
      <div className={styles.dot} />
      {isSelected && <div className={styles.checkmark}>✓</div>}
    </div>
  );
});

RoomCell.displayName = 'RoomCell';

export default RoomCell;
