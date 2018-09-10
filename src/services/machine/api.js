import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  getPointSettingList: '/machine/locale/list?pageNo={pageNo}&keyword={keyword}&code={code}',
  getPointSettingDetail: '/machine/locale/detail?id={id}',
  savePointSetting: '/machine/locale/add',
  updatePointSetting: '/machine/locale/update',
  deletePointSetting: '/machine/locale/delete',
  getMachineSettingList: '/machine/machine/list?pageNo={pageNo}&machineCode={machineCode}&localCode={localCode}',
  updateGoodsCountMachineSetting: '/machine/machine/updateGoodsCount',
  // updateLocaleMachineSetting: '/machine/machine/updateLocale',
  updateLocaleMachineSetting: '/machine/machine/updateMachine',
  deleteChannelMachineSetting: '/machine/machine/deleteChannel',
  getAisleList: '/machine/machine/channelInfo?machineId={machineId}',
  getMachineStatus: '/machine/machine/machineStatus?machineId={machineId}',
  getAppStatus: '/machine/machine/appStatus?machineId={machineId}',
  cutApp: '/machine/machine/cutApp?machineId={machineId}&appPackageName={appPackageName}',
  installApp: '/machine/machine/installApp?machineId={machineId}&appPackageName={appPackageName}&url={url}&versionCode={versionCode}',
  machineUpdateInfo: '/machine/machine/updateInfo',
  getPointSettingLists: '/machine/locale/getList?pageNo={pageNo}&keyword={keyword}',

  taskList: '/machine/task/list?pageNo={pageNo}&type={type}&status={status}',
  taskDelete: '/machine/task/delete',
  taskAdd: '/machine/task/add',
  taskUpdate: '/machine/task/update',
  taskSelectAppList: '/machine/task/selectAppList',
  taskDetail: '/machine/task/detail',
  taskSelectAreaMachines: '/machine/task/selectAreaMachines',
  // getPointSettingLists: '/machine/locale/getList?pageNo={pageNo}&keyword={keyword}',
  // updateMachineCode: '/machine/machine/updateMachineCode',
  taskUpdateStatus: '/machine/task/updateStatus',


  updateLogStatus: '',
  updateMachineCode: '/machine/machine/updateMachineCode',
  findMachineInfoById: '/machine/machine/findMachineInfoById',

});

export default api;
