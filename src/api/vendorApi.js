import axiosInstance from './axiosInstance';

const BASE_URL = import.meta.env.VITE_API_BASE_VENDOR;
const PHARMACY_URL = import.meta.env.VITE_API_BASE_PHARMACY;
const ORDER_URL = import.meta.env.VITE_API_BASE_ORDER;

export const vendorApi = {
  // Register pharmacy
  registerPharmacy: async (pharmacyData) => {
    const response = await axiosInstance.post(`${PHARMACY_URL}/register`, pharmacyData);
    return response.data;
  },

  // Get vendor's pharmacies
  getVendorPharmacies: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/pharmacies`);
    return response.data;
  },

  // Get pharmacy dashboard
  getPharmacyDashboard: async (pharmacyId) => {
    const response = await axiosInstance.get(`${BASE_URL}/pharmacy/${pharmacyId}/dashboard`);
    return response.data;
  },

  // Get pharmacy sales
  getPharmacySales: async (pharmacyId) => {
    const response = await axiosInstance.get(`${BASE_URL}/pharmacy/${pharmacyId}/sales`);
    return response.data;
  },

  // Get top medicines
  getTopMedicines: async (pharmacyId) => {
    const response = await axiosInstance.get(`${BASE_URL}/pharmacy/${pharmacyId}/top-medicines`);
    return response.data;
  },

  // Add inventory
  addInventory: async (pharmacyId, inventoryData) => {
    const response = await axiosInstance.post(
      `${PHARMACY_URL}/inventory/${pharmacyId}`,
      inventoryData
    );
    return response.data;
  },

  // Get pharmacy inventory
  getPharmacyInventory: async (pharmacyId) => {
    const response = await axiosInstance.get(`${PHARMACY_URL}/${pharmacyId}/inventory`);
    return response.data;
  },

  // Mark order ready for pickup (FOR delivery ORDER )
  markOrderReady: async (orderId) => {
    const response = await axiosInstance.put(`${PHARMACY_URL}/order/${orderId}/ready-for-pickup`);
    return response.data;
  },

  // Confirm Customer in store pickup (FOR pickup ORDER)
  confirmPickup: async (orderId, pickupCode) => {
    const response = await axiosInstance.put(`${PHARMACY_URL}/order/${orderId}/confirm-pickup`, {
      pickupCode
    });
    return response.data;
  },

  // Get all vendor orders (from all pharmacies)
  getAllVendorOrders: async (status = null) => {
    const url = status 
      ? `${ORDER_URL}/vendor/orders/${status}`
      : `${ORDER_URL}/vendor/orders`;
    const response = await axiosInstance.get(url);
    return response.data;
  },

  // Get pharmacy orders (specific pharmacy)
  getPharmacyOrders: async (pharmacyId, status = null) => {
    const url = status 
      ? `${ORDER_URL}/vendor/pharmacy/${pharmacyId}/orders/${status}`
      : `${ORDER_URL}/vendor/pharmacy/${pharmacyId}/orders`;
    const response = await axiosInstance.get(url);
    return response.data;
  },

  // Update inventory (use same POST endpoint with stock adjustment)
  updateInventory: async (pharmacyId, inventoryData) => {
    const response = await axiosInstance.post(
      `${PHARMACY_URL}/inventory/${pharmacyId}`,
      inventoryData
    );
    return response.data;
  },

  // Update order status by vendor
  updateOrderStatus: async (orderId, orderStatus) => {
    const response = await axiosInstance.put(
      `${ORDER_URL}/vendor/status/${orderId}`,
      { orderStatus }
    );
    return response.data;
  },

  // Verify prescription
  verifyPrescription: async (orderId, action, reason) => {
    const response = await axiosInstance.put(
      `${ORDER_URL}/verify-prescription/${orderId}`,
      { action, reason }
    );
    return response.data;
  },
};
