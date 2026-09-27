import api from './api';

export const warehouseService = {
  getAll: () => api.get('/warehouses'),
  getById: (id) => api.get(`/warehouses/${id}`),
  create: (data) => api.post('/warehouses', data),
  update: (id, data) => api.put(`/warehouses/${id}`, data),
  createLocation: (data) => api.post('/locations', data),
  getLocations: (warehouseId) => {
    const qs = warehouseId ? `?warehouseId=${warehouseId}` : '';
    return api.get(`/locations${qs}`);
  },
};

export default warehouseService;
