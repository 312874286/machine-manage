import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  getPointSettingList: '/machine/locale/list?pageNo={pageNo}&keyword={keyword}&code={code}',
  getPointSettingDetail: '/machine/locale/detail?id={id}',
  savePointSetting: '/machine/locale/add',
  updatePointSetting: '/machine/locale/update',
  deletePointSetting: '/machine/locale/delete',
  getMachineSettingList: '/machine/machine/list?pageNo={pageNo}&keyword={keyword}',
  updateGoodsCountMachineSetting: '/machine/machine/updateGoodsCount',
  updateLocaleMachineSetting: '/machine/machine/updateLocale',
  deleteChannelMachineSetting: '/machine/machine/deleteChannel',
  getAisleList: '/machine/machine/channelInfo?machineId={machineId}',
  getMachineStatus: '/machine/machine/machineStatus?machineId={machineId}',
  getAppStatus: '/machine/machine/appStatus?machineId={machineId}',
  cutApp: '/machine/machine/cutApp?machineId={machineId}&appPackageName={appPackageName}',
  installApp: '/machine/machine/installApp?machineId={machineId}&appPackageName={appPackageName}&url={url}&versionCode={versionCode}',
  machineUpdateInfo: '/machine/machine/updateInfo',
});

export default api;
