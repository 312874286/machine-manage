import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  getPointSettingList: '/locale/list?pageNo={pageNo}&keyword={keyword}&code={code}',
  getPointSettingDetail: '/locale/detail?id={id}',
  savePointSetting: '/locale/add',
  updatePointSetting: '/locale/update',
  deletePointSetting: '/locale/delete',
  getMachineSettingList: '/machine/list?pageNo={pageNo}&keyword={keyword}',
  saveMachineSetting: '/machine/add',
  updateMachineSetting: '/machine/update',
  deleteMachineSetting: '/machine/delete',
});

export default api;
