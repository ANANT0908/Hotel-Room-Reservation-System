import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
});

// Response interceptor: normalize all errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export const roomsApi = {
  getAll: () => api.get('/rooms'),
  book: (count) => api.post('/rooms/book', { count }),
  random: () => api.post('/rooms/random'),
  reset: () => api.post('/rooms/reset'),
  getBookings: () => api.get('/bookings'),
};

export default api;
