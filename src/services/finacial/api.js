import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797230
const api = map({
  getWithdrawalList: '/merchant/finance/doctorWallet/{merchantId}/queryDepositList?startDate={startDate}&endDate={endDate}&keyword={keyword}&status={status}&pageNo={pageNo}',
  updateWithdrawalStatus: '/merchant/finance/doctorWallet/{merchantId}/updateDepositStatus',
  getWithdrawalAuditStatistics: '/merchant/finance/doctorWallet/{merchantId}/auditStatistics',
  getDoctorIncomeInfo: '/merchant/finance/doctorWallet/{merchantId}/queryDoctorIncomeInfo?doctorId={doctorId}',
  getDoctorIncomeList: '/merchant/finance/doctorWallet/{merchantId}/queryDoctorIncomeList?doctorId={doctorId}&type={type}&pageNo={pageNo}',
  getDoctorDepositList: '/merchant/finance/doctorWallet/{merchantId}/queryDoctorDepositList?doctorId={doctorId}&pageNo={pageNo}',
});

export default api;
