import api from './api';

const salesService = {
  getHeaders: () => api.get('/header'),
  getDetails: () => api.get('/detail'),
  createSalesEntry: (data) => api.post('/header/multiple', data),
};

export default salesService;