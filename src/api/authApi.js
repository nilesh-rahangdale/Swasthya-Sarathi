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
    // Check if userData is FormData
    const isFormData = userData instanceof FormData;
    
    // Log signup data
    console.log('📤 Signup Data Being Sent to Backend:');
    console.log('Is FormData:', isFormData);
    
    if (isFormData) {
      console.log('FormData contents:');
      for (let [key, value] of userData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}:`, `[File: ${value.name}, Size: ${value.size} bytes, Type: ${value.type}]`);
        } else {
          console.log(`  ${key}:`, value);
        }
      }
    } else {
      console.log('JSON Data:', userData);
    }
    
    const response = await axiosInstance.post(`${BASE_URL}/signup`, userData, {
      headers: isFormData ? {
        'Content-Type': 'multipart/form-data',
      } : undefined,
    });
    
    console.log('✅ Signup Response:', response.data);
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
