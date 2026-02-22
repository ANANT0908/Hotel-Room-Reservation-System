// Component Sync: Re-applying booking button logic
import { useState } from 'react';
import styles from './Controls.module.css';

export default function Controls({ onAutoBook, onReset, onRandomize, actionLoading, stats, count, setCount }) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetTimer, setResetTimer] = useState(null);

  const maxAvailable = stats?.available || 0;
  // Rule: Single guest can book up to 5 rooms at a time
  const maxRooms = Math.min(maxAvailable, 5);

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
    setCount(value);
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
        </div>

        <button
          className={styles.autoButton}
          onClick={handleAutoBookClick}
          disabled={actionLoading === 'book' || count < 1}
          title={`Automatically find and book best ${count} rooms`}
        >
          {actionLoading === 'book' ? (
            <span className={styles.spinner}>⟳</span>
          ) : (
            `Auto Book ${count}`
          )}
        </button>
      </div>

      {/* Center - Info chip */}
      <div className={styles.infoChip}>
        Smart algorithm finds closest {count} room{count !== 1 ? 's' : ''} for you
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
