import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797230
const api = map({
  getDocotors: '/merchant/doctor/findDoctors.json',
  getDocotor: '/merchant/doctor/findDoctor.json?doctorId={doctorId}',
  updateDocotorStatus: '/merchant/doctor/saveStatus.json?doctorId={doctorId}&status={status}',
  postDoctor: '/merchant/doctor/saveDoctor.json',
  updateDoctorOnlineStatus: '/merchant/doctor/online.json?doctorId={doctorId}&status={status}',
  uploadFile: '/system/merchant/merchants/upload',
  getPriceManageList: '/merchant/doctor/price/{merchantId}/queryDoctorPriceList?keyword={keyword}&pageNo={pageNo}',
  getDoctors: '/merchant/doctor/price/{merchantId}/queryDoctors?keyword={keyword}',
  getOutpatientTimes: '/merchant/doctor/price/{merchantId}/queryOutpatientTimes',
  postDoctorPrice: '/merchant/doctor/price/{merchantId}/addOrUpdateDoctorPrice',
  getDoctorPrice: '/merchant/doctor/price/{merchantId}/queryDoctorPrice?doctorId={doctorId}',
  getDoctorConfig: '/merchant/open/findPaasDoctorConfig',
  getCommissionList: '/merchant/doctor/proportion/findDoctorProportions?keyword={keyword}',
  getCommissionDetail: '/merchant/doctor/proportion/findDoctorProportion?doctorId={doctorId}',
  getCommissionDoctor: '/merchant/doctor/proportion/findDoctors?keyword={keyword}',
  saveCommissionDoctor: '/merchant/doctor/proportion/saveDoctorProportion',
  abolish: '/merchant/doctor/proportion/abolish',
  getSchedules: '/merchant/doctor/schedule/{merchantId}/queryDoctorSchedules?startTime={startTime}&endTime={endTime}&doctorId={doctorId}',
  getScheduleTimespans: '/merchant/doctor/schedule/{merchantId}/queryOutpatientTimes',
  getScheduleDoctors: '/merchant/doctor/schedule/{merchantId}/queryDoctors?keyword={keyword}',
  getSchedulesByDate: '/merchant/doctor/schedule/{merchantId}/queryDoctorSchedulesByDate?doctorId={doctorId}&date={date}',
  postSchedule: '/merchant/doctor/schedule/{merchantId}/saveDoctorSchedules',
  getSkillList: '/paas/merchant/skill/findMerchantSkills?keyword={keyword}',
  getSkill: '/paas/merchant/skill/findMerchantSkill?id={id}',
  delSkill: '/paas/merchant/skill/del',
  addSkill: '/paas/merchant/skill/add',
  moveSkill: '/paas/merchant/skill/sequence',
  editSkill: '/paas/merchant/skill/edit',
  getOnlineDoctorList: '/merchant/doctor/online/getOutpatientDoctor?keyword={keyword}&pageNo={pageNo}',
  setDoctorOffline: '/merchant/doctor/online/offline',
  setDoctorUnlock: '/merchant/doctor/online/unlock',
});

export default api;
