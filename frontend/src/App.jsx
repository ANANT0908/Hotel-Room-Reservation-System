// UI Sync: Re-applying latest optimizations
import { Toaster } from 'react-hot-toast';
import { useHotel } from './hooks/useHotel';
import Header from './components/Header';
import Controls from './components/Controls';
import HotelGrid from './components/HotelGrid';
import BookingHistory from './components/BookingHistory';
import styles from './App.module.css';

function App() {
  const {
    rooms,
    stats,
    bookings,
    loading,
    actionLoading,
    error,
    lastBooking,
    newlyBookedIds,
    count,
    setCount,
    clearError,
    autoBookRooms,
    resetAll,
    randomizeOccupancy,
  } = useHotel();

  return (
    <div className={styles.app}>
      {/* Toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          success: {
            style: {
              background: '#064e3b',
              color: '#34d399',
              border: '1px solid #059669',
              maxWidth: '500px',
              width: 'fit-content',
              padding: '12px 24px',
            },
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            style: {
              background: '#450a0a',
              color: '#f87171',
              border: '1px solid #dc2626',
              maxWidth: '500px',
              width: 'fit-content',
              padding: '12px 24px',
            },
          },
        }}
      />

      {/* Ambient background glows */}
      <div className={styles.bgGlow1} />
      <div className={styles.bgGlow2} />

      {/* Header */}
      <Header stats={stats} loading={!!actionLoading} />

      {/* Controls */}
      <Controls
        onAutoBook={autoBookRooms}
        onReset={resetAll}
        onRandomize={randomizeOccupancy}
        actionLoading={actionLoading}
        stats={stats}
        rooms={rooms}
        count={count}
        setCount={setCount}
      />

      {/* Main body */}
      <div className={styles.body}>
        <HotelGrid
          rooms={rooms}
          newlyBookedIds={newlyBookedIds}
          loading={loading}
        />
        <BookingHistory bookings={bookings} />
      </div>
    </div>
  );
}

export default App;
