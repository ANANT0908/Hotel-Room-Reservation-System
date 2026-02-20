import { useState } from 'react';
import styles from './Controls.module.css';

export default function Controls({ onBook, onReset, onRandomize, actionLoading, stats, selectedRooms, onClearSelection }) {
  const [count, setCount] = useState(1);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetTimer, setResetTimer] = useState(null);

  const maxAvailable = stats?.available || 0;
  const maxRooms = Math.max(maxAvailable, 1);
  const selectedCount = selectedRooms?.size || 0;
  const isSelectionComplete = selectedCount === count;

  const handleCountChange = (e) => {
    const value = Math.max(1, Math.min(parseInt(e.target.value) || 1, maxRooms));
    setCount(value);
  };

  const handleBookClick = () => {
    if (isSelectionComplete && selectedCount > 0) {
      onBook(Array.from(selectedRooms));
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
              max={maxRooms}
              value={count}
              onChange={handleCountChange}
              className={styles.countInput}
              title={`Enter 1-${maxRooms} rooms`}
            />
            <span className={styles.maxLabel}>Max: {maxRooms}</span>
          </div>

          <div className={styles.selectionDisplay}>
            <span className={styles.selectedCount}>{selectedCount}</span>
            <span className={styles.selectedLabel}>/ {count}</span>
          </div>
        </div>

        <button
          className={styles.bookButton}
          onClick={handleBookClick}
          disabled={actionLoading === 'book' || !isSelectionComplete || count < 1}
          title={isSelectionComplete ? `Book ${count} room${count !== 1 ? 's' : ''}` : `Select ${count - selectedCount} more room${count - selectedCount !== 1 ? 's' : ''}`}
        >
          {actionLoading === 'book' ? (
            <span className={styles.spinner}>⟳</span>
          ) : isSelectionComplete ? (
            `Book ${count} Room${count !== 1 ? 's' : ''}`
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
