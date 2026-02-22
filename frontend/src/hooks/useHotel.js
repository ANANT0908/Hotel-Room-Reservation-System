// Logic Sync: Re-applying availability check optimizations
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { roomsApi } from '../services/api';

export const useHotel = () => {
  // State
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState({ available: 0, occupied: 0, booked: 0, total: 97 });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // 'book' | 'reset'
  const [error, setError] = useState(null);
  const [lastBooking, setLastBooking] = useState(null);
  const [newlyBookedIds, setNewlyBookedIds] = useState(new Set());
  const [count, setCount] = useState(1);

  // Actions
  const fetchRooms = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await roomsApi.getAll();
      setRooms(data.rooms || []);
      setStats(data.stats || {});
    } catch (err) {
      setError(err.message);
      toast.error(`Fetch failed: ${err.message}`);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const data = await roomsApi.getBookings();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };


  const autoBookRooms = async (count) => {
    // Availability check
    if (count > stats.available) {
      toast.error(`room not available, only ${stats.available} rooms available`, {
        duration: 5000,
        position: 'top-center',
        icon: '🚫',
      });
      return;
    }

    try {
      setActionLoading('book');
      setError(null);
      const data = await roomsApi.book(count, 'optimal');
      setLastBooking(data.booking);
      setNewlyBookedIds(new Set(data.booking.rooms));

      toast.success(
        `Booked ${data.booking.rooms.length} room${data.booking.rooms.length !== 1 ? 's' : ''} on ${data.booking.floorLabel}`,
        { icon: '🏨' }
      );

      // Refresh rooms and bookings
      await fetchRooms(true);
      await fetchBookings();

      // Clear newly booked indicator after 3 seconds
      setTimeout(() => setNewlyBookedIds(new Set()), 3000);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Booking failed');
    } finally {
      setActionLoading(null);
    }
  };


  const resetAll = async () => {
    try {
      setActionLoading('reset');
      setError(null);
      await roomsApi.reset();

      setLastBooking(null);
      setNewlyBookedIds(new Set());

      toast.success('All rooms reset to available', { icon: '🧹' });

      // Refresh rooms and bookings
      await fetchRooms(true);
      await fetchBookings();
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Reset failed');
    } finally {
      setActionLoading(null);
    }
  };

  const randomizeOccupancy = async () => {
    try {
      setActionLoading('random');
      setError(null);
      await roomsApi.random();

      setLastBooking(null);
      setNewlyBookedIds(new Set());

      toast.success('Random occupancy generated', { icon: '🎲' });

      // Refresh rooms and bookings
      await fetchRooms(true);
      await fetchBookings();
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Randomization failed');
    } finally {
      setActionLoading(null);
    }
  };

  const clearError = () => {
    setError(null);
    setLastBooking(null);
  };

  // On mount: fetch rooms and bookings
  useEffect(() => {
    fetchRooms();
    fetchBookings();
  }, []);

  // Background poll: fetch rooms every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRooms(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
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
  };
};
