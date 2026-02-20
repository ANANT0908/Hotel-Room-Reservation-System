import { useState, useEffect } from 'react';
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
  const [selectedRooms, setSelectedRooms] = useState(new Set());

  // Actions
  const fetchRooms = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await roomsApi.getAll();
      setRooms(data.rooms || []);
      setStats(data.stats || {});
    } catch (err) {
      setError(err.message);
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

  const bookRooms = async (selectedRoomNumbers) => {
    try {
      setActionLoading('book');
      setError(null);
      const data = await roomsApi.bookSelected(selectedRoomNumbers);
      setLastBooking(data.booking);
      setNewlyBookedIds(new Set(data.booking.rooms));
      setSelectedRooms(new Set()); // Clear selection after booking

      // Refresh rooms and bookings
      await fetchRooms(true);
      await fetchBookings();

      // Clear newly booked indicator after 3 seconds
      setTimeout(() => setNewlyBookedIds(new Set()), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const toggleRoomSelection = (roomNumber) => {
    const newSelected = new Set(selectedRooms);
    if (newSelected.has(roomNumber)) {
      newSelected.delete(roomNumber);
    } else {
      newSelected.add(roomNumber);
    }
    setSelectedRooms(newSelected);
  };

  const clearSelection = () => setSelectedRooms(new Set());

  const resetAll = async () => {
    try {
      setActionLoading('reset');
      setError(null);
      await roomsApi.reset();

      setLastBooking(null);
      setNewlyBookedIds(new Set());

      // Refresh rooms and bookings
      await fetchRooms(true);
      await fetchBookings();
    } catch (err) {
      setError(err.message);
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
      setSelectedRooms(new Set());

      // Refresh rooms and bookings
      await fetchRooms(true);
      await fetchBookings();
    } catch (err) {
      setError(err.message);
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
    selectedRooms,
    clearError,
    bookRooms,
    toggleRoomSelection,
    clearSelection,
    resetAll,
    randomizeOccupancy,
  };
};
