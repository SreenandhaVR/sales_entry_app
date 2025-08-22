import axios from 'axios';

// Base API configuration
const BASE_URL = 'http://5.189.180.8:8010';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints
export const salesAPI = {
  // Get all headers
  getHeaders: async () => {
    try {
      const response = await api.get('/header');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch headers:', error);
      throw error;
    }
  },

  // Get all details
  getDetails: async () => {
    try {
      const response = await api.get('/detail');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch details:', error);
      throw error;
    }
  },

  // Get item master data
  getItems: async () => {
    try {
      const response = await api.get('/item');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch items:', error);
      throw error;
    }
  },

  // Submit sales entry (both header and detail)
  submitSalesEntry: async (data) => {
    try {
      const response = await api.post('/header/multiple', data);
      return response.data;
    } catch (error) {
      console.error('Failed to submit sales entry:', error);
      throw error;
    }
  }
};

export default api;