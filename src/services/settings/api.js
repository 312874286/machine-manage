import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  getWechatPushList: '/merchants/{merchantId}/templates/configs',
  setWechatItem: '/merchants/{merchantId}/templates/configs/{configId}',
  getWechats: '/merchants/{merchantId}/wechats',
  setWechats: '/merchants/{merchantId}/wechats/{wechatId}',
  getMerchant: '/merchants/{merchantId}',
  setMerchantsBasic: '/merchants/{merchantId}',
  getAlertManageList: '/merchants/{merchantId}/alarms/configs?pageNo={pageNo}',
  updateAlertManageStatus: '/merchants/{merchantId}/alarms/configs/{configId}/{operation}',
  getAlertPersions: '/merchants/{merchantId}/alarms/{alarmId}/persons',
  addAlertPersion: '/merchants/{merchantId}/alarms/{alarmId}/persons',
  updateAlertPersion: '/merchants/{merchantId}/alarms/{alarmId}/persons/{personId}',
  updateAlertPersionStatus: '/merchants/{merchantId}/alarms/{alarmId}/persons/{personId}/{operation}',
  getDoctorWallList: '/merchants/{merchantId}/expertSubjects?pageNo={pageNo}&keyWords={keyWords}',
  getDoctorList: '/merchants/{merchantId}/doctors?keyWords={keyWords}',
  subject: '/merchants/{merchantId}/expertSubjects/{subjectId}',
  createSubject: '/merchants/{merchantId}/expertSubjects',
  getUsers: '/merchants/{merchantId}/user/users?keywords={keywords}&pageNo={pageNo}',
  createUser: '/merchants/{merchantId}/user/users',
  saveUser: '/merchants/{merchantId}/user/users/{userId}',
  // 获取医生配置列表
  getDocotorConfigs: '/merchants/{merchantId}/doctors/configs?type={businessType}&status={status}',
  addDoctorConfig: '/merchants/{merchantId}/doctors/configs',
  updateDoctorConfig: '/merchants/{merchantId}/doctors/configs/{configId}',
  updateDoctorConfigStatus: '/merchants/{merchantId}/doctors/configs/{configId}/{operation}',
  setUserStatus: '/merchants/{merchantId}/user/users/{userId}/status',
  getDepartment: '/merchants/{merchantId}/expertSubjects/{subjectId}',
  getDiseases: '/paas/disease/findDiseasePage?keyword={keyword}&pageNo={pageNo}',
  getDisease: '/paas/disease/findDisease?id={id}',
  putDisease: '/paas/disease/save',
  delDisease: '/paas/disease/del?id={id}',
  userRoles: '/merchants/{merchantId}/user/users/{userId}/roles',
  roles: '/merchants/{merchantId}/role/roles',
  role: '/merchants/{merchantId}/role/roles/{roleId}',
  roleFunctions: '/merchants/{merchantId}/role/roles/functions',
});

export default api;
