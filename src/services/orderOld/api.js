import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  getOrderList: '/paas/order/queryOrders?pageNo={pageNo}&startDate={startDate}&endDate={endDate}&orderNum={orderNum}&orderType={orderType}&status={status}',
  getChildDiseaseOrders: '/paas/order/childDisease/queryChildDiseaseOrdersList',
  getChildDiseaseOrder: '/paas/order/childDisease/queryChildDiseaseOrder',
  cancelChildDiseaseOrder: '/paas/order/childDisease/cancleOrder',
  updateChildDiseaseOrder: '/paas/order/childDisease/updateOrder',
});

export default api;
