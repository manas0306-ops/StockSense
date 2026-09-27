import api from './api';

export const aiService = {
  query: (prompt, context = {}) => api.post('/ai/query', { prompt, context }),
};

export default aiService;
