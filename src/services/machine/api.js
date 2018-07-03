import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  getPointSettingList: '/merchant/pointLocationManage/pointLocationLists?pageNo={pageNo}&keyword={keyword}',
  savePointSetting: '/merchant/pointLocationManage/save',
  updatePointSetting: '/merchant/pointLocationManage/updatePointLocation',
  deletePointSetting: '/merchant/pointLocationManage/deletePointLocation',
  getMachineSettingList: '/merchant/pointLocationManage/pointLocationLists?pageNo={pageNo}&keyword={keyword}',
  saveMachineSetting: '/merchant/pointLocationManage/save',
  updateMachineSetting: '/merchant/pointLocationManage/updatePointLocation',
  deleteMachineSetting: '/merchant/pointLocationManage/deletePointLocation',
});

export default api;
