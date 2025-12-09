import axiosInstance from './axiosInstance';

const BASE_URL = import.meta.env.VITE_API_BASE_AI;

export const aiApi = {
  // Get medicine information
  getMedicineInfo: async (medicineName) => {
    const response = await axiosInstance.post(`${BASE_URL}/medicine-info`, {
      medicineName,
    });
    return response.data;
  },

  // Get medicine suggestions based on symptoms
  getSymptomSuggestion: async (symptoms) => {
    const response = await axiosInstance.post(`${BASE_URL}/symptom-suggestion`, {
      symptoms,
    });
    return response.data;
  },
};
