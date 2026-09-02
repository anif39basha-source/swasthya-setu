import { create } from 'zustand';
import axios from '../services/api';

const useStore = create((set, get) => ({
  // Auth State
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false
    }),

  logout: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    }),

  // Online/Offline
  isOnline: navigator.onLine,
  setOnline: (status) => set({ isOnline: status }),

  // Facilities
  facilities: [],
  nearbyFacilities: [],
  facilityDetails: null,

  setFacilities: (facilities) => set({ facilities }),
  setNearbyFacilities: (facilities) => set({ nearbyFacilities: facilities }),
  setFacilityDetails: (details) => set({ facilityDetails: details }),

  // Appointments
  appointments: [],
  upcomingAppointments: [],

  setAppointments: (appointments) => set({ appointments }),

  setUpcomingAppointments: (apps) =>
    set({ upcomingAppointments: apps }),

  // Referrals
  referrals: [],
  setReferrals: (referrals) => set({ referrals }),

  // Medicines
  medicines: [],
  medicineResults: [],

  setMedicines: (meds) => set({ medicines: meds }),
  setMedicineResults: (results) => set({ medicineResults: results }),

  // AI Assistant
  chatHistory: [],

  addMessage: (message) =>
    set((state) => ({
      chatHistory: [...state.chatHistory, message]
    })),

  setChatHistory: (history) => set({ chatHistory: history }),

  // Notifications
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) => set({ notifications }),
  setUnreadCount: (count) => set({ unreadCount: count }),

  // Dashboard stats
  dashboardStats: null,
  setDashboardStats: (stats) => set({ dashboardStats: stats }),

  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

// Language
selectedLanguage: localStorage.getItem('language') || 'en',

setLanguage: (lang) => {
  localStorage.setItem('language', lang);
  set({ selectedLanguage: lang });
},

  // Actions

  login: async (phone, password) => {
    try {
      const response = await axios.post('/auth/login', {
        phone,
        password
      });

      const { user, token } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      get().setAuth(user, token);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || 'Login failed'
      };
    }
  },

  demoLogin: async (role) => {
    try {
      const response = await axios.post('/auth/demo-login', {
        role
      });

      const { user, token } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      get().setAuth(user, token);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || 'Login failed'
      };
    }
  },

  register: async (userData) => {
    try {
      const response = await axios.post(
        '/auth/register',
        userData
      );

      const { user, token } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      get().setAuth(user, token);

      return { success: true };
 } catch (error) {
  console.error('Registration API error:', error);

  const responseData = error.response?.data;

  let message = 'Registration failed';

  if (typeof responseData?.message === 'string') {
    message = responseData.message;
  } else if (typeof responseData?.detail === 'string') {
    message = responseData.detail;
  } else if (Array.isArray(responseData?.detail)) {
    message = responseData.detail
      .map((item) => item?.msg || String(item))
      .join(', ');
  } else if (typeof error.message === 'string') {
    message = error.message;
  }

  return {
    success: false,
    error: message
  };
}
  },

  fetchNearbyFacilities: async (lat, lng) => {
    try {
      const response = await axios.get(
        `/facilities/nearby?lat=${lat}&lng=${lng}`
      );

      set({
        nearbyFacilities: response.data.data
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  fetchFacilities: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();

      const response = await axios.get(
        `/facilities?${params}`
      );

      set({
        facilities: response.data.data
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  fetchFacilityDetails: async (id) => {
    try {
      const response = await axios.get(
        `/facilities/${id}`
      );

      set({
        facilityDetails: response.data.data
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  bookAppointment: async (data) => {
    try {
      const response = await axios.post(
        '/appointments',
        data
      );

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          'Failed to book appointment'
      };
    }
  },

  fetchAppointments: async () => {
    try {
      const response = await axios.get('/appointments');

      set({
        appointments: response.data.data
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  fetchUpcomingAppointments: async () => {
    try {
      const response = await axios.get(
        '/appointments/upcoming'
      );

      set({
        upcomingAppointments: response.data.data
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createReferral: async (data) => {
    try {
      const response = await axios.post(
        '/referrals',
        data
      );

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          'Failed to create referral'
      };
    }
  },

  fetchReferrals: async () => {
    try {
      const response = await axios.get('/referrals');

      set({
        referrals: response.data.data
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  searchMedicines: async (name) => {
    try {
      const response = await axios.get(
        `/medicines/search?name=${name}`
      );

      set({
        medicineResults: response.data.data
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  fetchMedicines: async () => {
    try {
      const response = await axios.get('/medicines');

      set({
        medicines: response.data.data
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  chatWithAI: async (
    message,
    conversationHistory = []
  ) => {
    try {
      const response = await axios.post('/ai/chat', {
        message,
        language: get().selectedLanguage,
        conversation_history: conversationHistory
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  fetchNotifications: async () => {
    try {
      const response = await axios.get(
        '/notifications'
      );

      const notifications = response.data.data;

      set({
        notifications,
        unreadCount: notifications.filter(
          (n) => !n.is_read
        ).length
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  markNotificationRead: async (id) => {
    try {
      await axios.put(
        `/notifications/${id}/read`
      );

      set((state) => ({
        unreadCount: Math.max(
          0,
          state.unreadCount - 1
        )
      }));
    } catch (error) {
      throw error;
    }
  },

  fetchDashboardStats: async () => {
    try {
      const response = await axios.get(
        '/users/stats'
      );

      set({
        dashboardStats: response.data.data
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  searchUsers: async (query, role) => {
    try {
      const params = new URLSearchParams({
        query,
        role
      });

      const response = await axios.get(
        `/users/${role}?${params}`
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }
}));

export default useStore;