import api from './api';

export const reportService = {
  generate: (data) => api.post('/reports/generate', data),
};

export default reportService;
