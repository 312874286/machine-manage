import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  getPointSettingList: '/machine/locale/list?pageNo={pageNo}&keyword={keyword}&code={code}',
  getPointSettingDetail: '/machine/locale/detail?id={id}',
  savePointSetting: '/machine/locale/add',
  updatePointSetting: '/machine/locale/update',
  deletePointSetting: '/machine/locale/delete',
  getMachineSettingList: '/machine/list?pageNo={pageNo}&keyword={keyword}',
  saveMachineSetting: '/machine/add',
  updateMachineSetting: '/machine/update',
  deleteMachineSetting: '/machine/delete',
});

export default api;
