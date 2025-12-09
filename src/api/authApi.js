import axiosInstance from './axiosInstance';

const BASE_URL = import.meta.env.VITE_API_BASE_AUTH;

export const authApi = {
  // Send OTP
  sendOTP: async (email) => {
    const response = await axiosInstance.post(`${BASE_URL}/sendotp`, { email });
    return response.data;
  },

  // Signup
  signup: async (userData) => {
    const response = await axiosInstance.post(`${BASE_URL}/signup`, userData);
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await axiosInstance.post(`${BASE_URL}/login`, credentials);
    return response.data;
  },

  // Change Password
  changePassword: async (passwordData) => {
    const response = await axiosInstance.post(`${BASE_URL}/changepassword`, passwordData);
    return response.data;
  },
};
