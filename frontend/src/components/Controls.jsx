import { useState } from 'react';
import styles from './Controls.module.css';

export default function Controls({ onBook, onRandom, onReset, actionLoading, stats }) {
  const [count, setCount] = useState(1);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetTimer, setResetTimer] = useState(null);

  const handleBookClick = () => {
    onBook(count);
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
        <label className={styles.label}>Rooms to Book</label>
        
        <div className={styles.countSelector}>
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              className={`${styles.countButton} ${count === num ? styles.active : ''}`}
              onClick={() => setCount(num)}
            >
              {num}
            </button>
          ))}
        </div>

        <button
          className={styles.bookButton}
          onClick={handleBookClick}
          disabled={actionLoading === 'book'}
        >
          {actionLoading === 'book' ? (
            <span className={styles.spinner}>⟳</span>
          ) : (
            `Book ${count} Room${count !== 1 ? 's' : ''}`
          )}
        </button>
      </div>

      {/* Center - Info chip */}
      <div className={styles.infoChip}>
        Algorithm minimises travel time between booked rooms
      </div>

      {/* Right group - Utilities */}
      <div className={styles.rightGroup}>
        <button
          className={styles.randomButton}
          onClick={onRandom}
          disabled={actionLoading === 'random'}
        >
          {actionLoading === 'random' ? (
            <span className={styles.spinner}>⟳</span>
          ) : (
            '🎲 Random Occupancy'
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
