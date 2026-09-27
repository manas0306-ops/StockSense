import api from './api';

export const alertService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.severity && params.severity !== 'ALL') query.append('severity', params.severity);
    if (params.warehouseId && params.warehouseId !== 'ALL') query.append('warehouseId', params.warehouseId);
    if (params.search) query.append('search', params.search);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return api.get(`/alerts${qs}`);
  },
  markRead: (id) => api.put(`/alerts/${id}/read`),
  resolve: (id) => api.put(`/alerts/${id}/resolve`),
  resolveAll: () => api.post('/alerts/resolve-all'),
};

export default alertService;
