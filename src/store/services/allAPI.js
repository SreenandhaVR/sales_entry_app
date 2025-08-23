const API_BASE_URL = 'http://5.189.180.8:8010';

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
  getAllItems: () => api.get('/item'),
};

export const salesService = {
  getHeaders: () => api.get('/header'),
  getDetails: () => api.get('/detail'),
  getItemMaster: () => api.get('/item'),
  createSalesEntry: (data) => api.post('/header/multiple', data),
  createHeader: (data) => api.post('/header', data),
  createDetail: (data) => api.post('/detail', data),
};