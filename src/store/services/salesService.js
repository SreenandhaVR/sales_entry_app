import api from './api';

const salesService = {
  getHeaders: () => api.get('/header'),
  getDetails: () => api.get('/detail'),
  getItemMaster: () => api.get('/item'),   // <-- fetch items from item_master
  createSalesEntry: (data) => api.post('/header/multiple', data),
};

export default salesService;