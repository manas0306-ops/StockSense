import { apiRequest } from './api';

export const advancedService = {
  getOperationalSummary: () => apiRequest('/dashboard/operational-summary'),
  getLedgerReplay: (eventIndex = 0) => apiRequest(`/ledger/replay?eventIndex=${eventIndex}`),
  getExplorerEvents: (range = '30D', type = 'ALL') => apiRequest(`/explorer/events?range=${range}&type=${type}`),
  getDigitalTwin: () => apiRequest('/warehouses/digital-twin'),
  getAdvancedAnalytics: () => apiRequest('/analytics/advanced'),
  runSimulation: (params) => apiRequest('/simulator/run', {
    method: 'POST',
    body: JSON.stringify(params)
  }),
  getQualityAudit: () => apiRequest('/quality/audit'),
};

export default advancedService;
