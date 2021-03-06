import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  getPointSettingList: '/machine/locale/list?pageNo={pageNo}&keyword={keyword}&code={code}&type={type}',
  getPointSettingDetail: '/machine/locale/detail?id={id}',
  savePointSetting: '/machine/locale/add',
  updatePointSetting: '/machine/locale/update',
  deletePointSetting: '/machine/locale/delete',
  // startTime: '',
  // endTime: '',
  // machineType: '',
  // machineStatus: '',
  getMachineSettingList: '/machine/machine/list?pageNo={pageNo}&machineCode={machineCode}&localCode={localCode}&startTime={startTime}&endTime={endTime}&machineType={machineType}&machineStatus={machineStatus}&localType={localType}',
  updateGoodsCountMachineSetting: '/machine/machine/updateGoodsCount',
  deleteChannelMachineSetting: '/machine/machine/deleteChannel',
  getAisleList: '/machine/machine/channelInfo?machineId={machineId}',
  getMachineStatus: '/machine/machine/machineStatus?machineId={machineId}',
  getAppStatus: '/machine/machine/appStatus?machineId={machineId}',
  cutApp: '/machine/machine/cutApp?machineId={machineId}&appPackageName={appPackageName}',
  installApp: '/machine/machine/installApp?machineId={machineId}&appPackageName={appPackageName}&url={url}&versionCode={versionCode}',
  machineUpdateInfo: '/machine/machine/updateInfo',
  updateMachineType: '/machine/machine/updateMachineType',

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
  returnDeskTop: '/machine/machine/cutDesktop',
  updateLocaleMachineSetting: '/machine/machine/updateLocale',
  updateMachineCode: '/machine/machine/updateMachineCode',
  findMachineInfoById: '/machine/machine/findMachineInfoById',

  machinePointLog: '/machine/machine/machinePointLog?machineCode={machineCode}&startTime={startTime}&endTime={endTime}',
  exportMachinePointLog: '/machine/machine/exportMachinePointLog',

  tagList: '/machine/locale/tagList?pageNo={pageNo}&keyword={keyword}',
  getTagList: '/machine/locale/getTagList?name={name}',

  addArea: '/admin/area/add',
  updateArea: '/admin/area/update',
  areaList: '/admin/area/pageList?pageNo={pageNo}&code={code}',
  areaDetail: '/admin/area/detail?code={code}',


  grabLog: '/machine/machine/grabLog',
  getLogs: '/machine/machine/getLogs?machineId={machineId}',
  findTemperature: '/machine/machine/findTemperature?machineId={machineId}',
  updateTemperature: '/machine/machine/updateTemperature',

  getPointFromTag: '/machine/locale/getList?tag={tag}',

  updateBatchMonitor: '/machine/locale/updateBatch',

  //app版本
  getAppVersionList: '/machine/app/appVersionList?appPackageName={appPackageName}&keyword={keyword}',
  saveVersion: '/machine/app/saveHistory',
  appList: '/machine/app/appList',
  //批次
  batchList: '/machine/batch/list',
  batchDetail: '/machine/batch/detail?id={id}',
  addBatch: '/machine/batch/save',
  updateBatch: '/machine/batch/update',
  //入场时间明细
  machineLocaleDetailList: '/machine/locale/detail/list?pageNo={pageNo}&code={code}&keyword={keyword}',
  machineLocaleDetail: '/machine/locale/detail/machineLocaleDetail?machineId={machineId}',

  searchAppVersion: '/machine/version/appVersion',
  flowMonitoring: '/machine/traffic/list?pageNo={pageNo}&machineCode={machineCode}&allTraffic={allTraffic}',
  // 机器流量监控
  flowMonitoring: '/machine/traffic/list?pageNo={pageNo}&machineCode={machineCode}&allTraffic={allTraffic}',
});

export default api;
