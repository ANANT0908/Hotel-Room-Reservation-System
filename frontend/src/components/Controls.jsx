import { useState } from 'react';
import styles from './Controls.module.css';

export default function Controls({ onBook, onAutoBook, onReset, onRandomize, actionLoading, stats, rooms, selectedRooms, onClearSelection, count, setCount }) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetTimer, setResetTimer] = useState(null);

  const maxAvailable = stats?.available || 0;
  // Rule: Single guest can book up to 5 rooms at a time
  const maxRooms = Math.min(maxAvailable, 5);
  const selectedCount = selectedRooms?.size || 0;
  const isSelectionComplete = selectedCount === count;

  const handleCountChange = (e) => {
    const rawValue = e.target.value;
    if (rawValue === '') {
      setCount('');
      return;
    }

    let value = parseInt(rawValue);
    if (isNaN(value)) return;

    // Clamp between 1 and 5
    value = Math.max(1, Math.min(value, 5));

    if (value < selectedCount) {
      onClearSelection();
    }
    setCount(value);
  };

  // Real-time travel time estimation for manual selection
  const calculateTravelTime = () => {
    if (selectedCount < 2) return 0;

    // We need the room objects to get floor/position
    const selectedObjects = (rooms || []).filter(r => selectedRooms.has(r.roomNumber));
    if (selectedObjects.length < 2) return 0;

    let maxTime = 0;
    for (let i = 0; i < selectedObjects.length; i++) {
      for (let j = i + 1; j < selectedObjects.length; j++) {
        const rA = selectedObjects[i];
        const rB = selectedObjects[j];

        let time;
        if (rA.floor === rB.floor) {
          time = Math.abs(rA.position - rB.position);
        } else {
          time = (rA.position - 1) + Math.abs(rA.floor - rB.floor) * 2 + (rB.position - 1);
        }

        if (time > maxTime) maxTime = time;
      }
    }
    return maxTime;
  };

  const travelTimeEstimate = calculateTravelTime();

  const handleBookClick = () => {
    if (isSelectionComplete && selectedCount > 0) {
      onBook(Array.from(selectedRooms));
    }
  };

  const handleAutoBookClick = () => {
    if (count > 0 && count <= 5) {
      onAutoBook(count);
    }
  };

  const handleResetClick = () => {
    if (!showResetConfirm) {
      setShowResetConfirm(true);
      const timer = setTimeout(() => {
        setShowResetConfirm(false);
      }, 3000);
      setResetTimer(timer);
    } else {
      clearTimeout(resetTimer);
      setResetTimer(null);
      setShowResetConfirm(false);
      onReset();
    }
  };

  return (
    <div className={styles.controls}>
      {/* Left group - Booking */}
      <div className={styles.leftGroup}>
        <div className={styles.bookingSection}>
          <label className={styles.label}>Rooms to Book</label>

          <div className={styles.inputGroup}>
            <input
              type="number"
              min="1"
              max="5"
              value={count}
              onChange={handleCountChange}
              className={styles.countInput}
              title="Enter 1-5 rooms"
            />
            <span className={styles.maxLabel}>Max: 5</span>
          </div>

          <div className={styles.selectionDisplay}>
            <div className={styles.selectionProgress}>
              <span className={styles.selectedCount}>{selectedCount}</span>
              <span className={styles.selectedLabel}>/ {count}</span>
            </div>
            {travelTimeEstimate > 0 && (
              <div className={styles.travelTimeBadge} title="Estimated travel time between furthest selected rooms">
                ⚡ {travelTimeEstimate} min
              </div>
            )}
          </div>
        </div>

        <button
          className={styles.autoButton}
          onClick={handleAutoBookClick}
          disabled={actionLoading === 'book' || count < 1 || count > maxAvailable}
          title={`Automatically find and book best ${count} rooms`}
        >
          {actionLoading === 'book' && !selectedCount ? (
            <span className={styles.spinner}>⟳</span>
          ) : (
            `Auto Book ${count}`
          )}
        </button>

        <button
          className={styles.bookButton}
          onClick={handleBookClick}
          disabled={actionLoading === 'book' || !isSelectionComplete || count < 1}
          title={isSelectionComplete ? `Book ${count} selected rooms` : `Select ${count - selectedCount} more from grid`}
        >
          {actionLoading === 'book' && selectedCount ? (
            <span className={styles.spinner}>⟳</span>
          ) : isSelectionComplete ? (
            'Book Selected'
          ) : (
            `Select ${count - selectedCount} More`
          )}
        </button>

        {selectedCount > 0 && (
          <button
            className={styles.clearButton}
            onClick={onClearSelection}
            disabled={actionLoading === 'book'}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Center - Info chip */}
      <div className={styles.infoChip}>
        👆 Click on rooms to select them · {count} room{count !== 1 ? 's' : ''} needed
      </div>

      {/* Right group - Utilities */}
      <div className={styles.rightGroup}>
        <button
          className={styles.randomButton}
          onClick={onRandomize}
          disabled={actionLoading === 'random'}
          title="Simulate random room occupancy"
        >
          {actionLoading === 'random' ? (
            <span className={styles.spinner}>⟳</span>
          ) : (
            '🎲 Random'
          )}
        </button>

        <button
          className={`${styles.resetButton} ${showResetConfirm ? styles.confirm : ''}`}
          onClick={handleResetClick}
          disabled={actionLoading === 'reset'}
        >
          {actionLoading === 'reset' ? (
            <span className={styles.spinner}>⟳</span>
          ) : showResetConfirm ? (
            '⚠ Confirm Reset'
          ) : (
            '↺ Reset All'
          )}
        </button>
      </div>
    </div>
  );
}
