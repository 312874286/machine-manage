import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11798209
const api = map({
  getContracts: '/paas/order/fastDrawOut/findContractsOrders',
  getContract: '/paas/order/fastDrawOut/findContractsOrder',
  getContractPrintInfo: '/paas/order/contractsCheck/findPatient',
});

export default api;
