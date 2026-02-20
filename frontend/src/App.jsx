import { useHotel } from './hooks/useHotel';
import Header from './components/Header';
import Controls from './components/Controls';
import ResultBanner from './components/ResultBanner';
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
    selectedRooms,
    count,
    setCount,
    clearError,
    bookRooms,
    autoBookRooms,
    toggleRoomSelection,
    clearSelection,
    resetAll,
    randomizeOccupancy,
  } = useHotel();

  return (
    <div className={styles.app}>
      {/* Ambient background glows */}
      <div className={styles.bgGlow1} />
      <div className={styles.bgGlow2} />

      {/* Header */}
      <Header stats={stats} loading={!!actionLoading} />

      {/* Controls */}
      <Controls
        onBook={bookRooms}
        onAutoBook={autoBookRooms}
        onReset={resetAll}
        onRandomize={randomizeOccupancy}
        actionLoading={actionLoading}
        stats={stats}
        rooms={rooms}
        selectedRooms={selectedRooms}
        onClearSelection={clearSelection}
        count={count}
        setCount={setCount}
      />

      {/* Result banner */}
      <ResultBanner booking={lastBooking} error={error} onDismiss={clearError} />

      {/* Main body */}
      <div className={styles.body}>
        <HotelGrid
          rooms={rooms}
          newlyBookedIds={newlyBookedIds}
          loading={loading}
          selectedRooms={selectedRooms}
          onToggleSelect={toggleRoomSelection}
        />
        <BookingHistory bookings={bookings} />
      </div>
    </div>
  );
}

export default App;
