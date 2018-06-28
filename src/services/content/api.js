import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  getOutpatientList: '/paas/order/outpatient/queryOutpatientOrders?pageNo={pageNo}&status={status}&startDate={startDate}&endDate={endDate}&keyword={keyword}&appointmentTime={appointmentTime}&updateTime={updateTime}',
  getOutpatientDetail: '/paas/order/outpatient/queryOutpatientOrder?orderId={orderId}',
  cancelOrder: '/paas/order/outpatient/cancel',
  getSuggestList: '/paas/audit/queryOrdersAuditList?pageNo={pageNo}&status={status}&keyword={keyword}',
  getSuggestDetail: '/paas/audit/queryOrdersAudit?orderId={orderId}',
  getQuestionList: '/paas/order/trace/findQuestionTraceForPage?status={status}&startTime={startTime}&endTime={endTime}&keyword={keyword}&pageNo={pageNo}',
  getQuestionDetail: '/paas/order/trace/findQuestionTrace?id={id}',
  audit: '/paas/audit/audit',
  putTransferReason: '/paas/order/outpatient/callTransferReason',
  getInspectionReports: '/paas/order/contractsCheck/findChildOrders',
  getInspectionReport: '/paas/order/contractsCheck/findServiceOperationReport',
  postInspectionReports: '/paas/order/contractsCheck/modifiServiceReport',
  getDianInspectionReport: '/paas/order/contractsCheck/getThirdReport',
  ApproveDianInspectionReports: '/paas/order/contractsCheck/auditThirdReport',
  postInspectionReportRemark: '/paas/order/contractsCheck',
});

export default api;
