import axiosInstance from './axiosInstance';

const BASE_URL = import.meta.env.VITE_API_BASE_ADMIN;

export const adminApi = {
  // Get admin dashboard
  getDashboard: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/dashboard`);
    return response.data;
  },

  // Get pending pharmacies
  getPendingPharmacies: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/pharmacies/pending`);
    return response.data;
  },

  // Get pending volunteers
  getPendingVolunteers: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/volunteers/pending`);
    return response.data;
  },

  // Approve/Reject pharmacy
  updatePharmacyApproval: async (pharmacyId, approvalData) => {
    const response = await axiosInstance.put(
      `${BASE_URL}/pharmacies/${pharmacyId}/approval`,
      approvalData
    );
    return response.data;
  },

  // Approve/Reject volunteer
  updateVolunteerApproval: async (volunteerId, approvalData) => {
    const response = await axiosInstance.put(
      `${BASE_URL}/volunteers/${volunteerId}/approval`,
      approvalData
    );
    return response.data;
  },

  // Get all pharmacies with filter
  getPharmacies: async (status = 'approved') => {
    const response = await axiosInstance.get(`${BASE_URL}/pharmacies?status=${status}`);
    return response.data;
  },

  // Get all volunteers
  getVolunteers: async (status = 'approved') => {
    const response = await axiosInstance.get(`${BASE_URL}/volunteers?status=${status}`);
    return response.data;
  },
};
