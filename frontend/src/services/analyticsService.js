import api from './api';

export const analyticsService = {
  getAnalytics: (params = {}) => {
    const query = new URLSearchParams();
    if (params.period) query.append('period', params.period);
    if (params.warehouseId && params.warehouseId !== 'ALL') query.append('warehouseId', params.warehouseId);
    if (params.categoryId && params.categoryId !== 'ALL') query.append('categoryId', params.categoryId);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return api.get(`/analytics${qs}`);
  },
};

export default analyticsService;
