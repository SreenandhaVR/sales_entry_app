import api from './api';

const itemService = {
  getAllItems: () => api.get('/item'),
};

export default itemService;