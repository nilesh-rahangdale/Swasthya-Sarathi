import axiosInstance from './axiosInstance';

const BASE_URL = import.meta.env.VITE_API_BASE_VOLUNTEER;

export const volunteerApi = {
  // Get volunteer profile
  getProfile: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/profile`);
    return response.data;
  },

  // Get available orders for delivery
  getAvailableOrders: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/available-orders`);
    return response.data;
  },

  // Get my deliveries
  getMyDeliveries: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/my-deliveries`);
    return response.data;
  },

  // Update location
  updateLocation: async (locationData) => {
    const response = await axiosInstance.put(`${BASE_URL}/location`, locationData);
    return response.data;
  },

  // Toggle availability
  toggleAvailability: async (availabilityData) => {
    const response = await axiosInstance.put(`${BASE_URL}/availability`, availabilityData);
    return response.data;
  },

  // Accept delivery order
  acceptOrder: async (orderId) => {
    const response = await axiosInstance.put(`${BASE_URL}/accept-order/${orderId}`);
    return response.data;
  },

  // Mark pickup complete (picked up from pharmacy)
  markPickupComplete: async (orderId) => {
    const response = await axiosInstance.put(`${BASE_URL}/pickup-complete/${orderId}`);
    return response.data;
  },

  // Mark out for delivery (on the way to customer)
  markOutForDelivery: async (orderId) => {
    const response = await axiosInstance.put(`${BASE_URL}/out-for-delivery/${orderId}`);
    return response.data;
  },

  // Mark delivery complete (delivered to customer)
  markDeliveryComplete: async (orderId) => {
    const response = await axiosInstance.put(`${BASE_URL}/delivery-complete/${orderId}`);
    return response.data;
  },
};
