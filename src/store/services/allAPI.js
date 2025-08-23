// === API Service Definitions ===

const API_BASE_URL = 'http://5.189.180.8:8010';

// Mock axios-like implementation since we can't import axios in artifacts
const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { data };
  },
  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      console.log('API Error Response:', errorData);
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.response = {
        status: response.status,
        data: errorData
      };
      throw error;
    }
    const responseData = await response.json();
    return { data: responseData };
  }
};

export const itemService = {
  // Fetches all items from the /item endpoint
  getAllItems: () => api.get('/item'),
};

export const salesService = {
  // Fetches all sales headers
  getHeaders: () => api.get('/header'),
  // Fetches sales details (might need a parameter like vr_no in a real app)
  getDetails: () => api.get('/detail'),
  // Fetches item master data
  getItemMaster: () => api.get('/item'),
  // Creates a new sales entry, sending both header and detail data
  createSalesEntry: (data) => api.post('/header/multiple', data),
  // Create header only
  createHeader: (data) => api.post('/header', data),
  // Create detail only
  createDetail: (data) => api.post('/detail', data),
};
