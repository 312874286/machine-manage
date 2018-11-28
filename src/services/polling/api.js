import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  getCheckFaultList: '/check/fault/list',
  getCheckFaultDetail: '/check/fault/detail',
  getCheckFaultAnswer: '/check/fault/answer',
  getUserList: '/check/user/list?pageNo={pageNo}&keyword={keyword}',
  getUserMachineDetailList: '/check/user/getUserMachinDetailList?id={id}',
  getUserDetail: '/check/user/detail?id={id}',
  saveUser: '/check/user/add',
  updateUser: '/check/user/update',
  selectMachine: '/check/user/selectAreaMachines',

  getCheckFaultTypeList: '/check/faultType/list',
  getCheckFaultTypeAdd: '/check/faultType/add',
  getCheckFaultTypeDetail: '/check/faultType/detail',
  getCheckFaultTypeUpdate: '/check/faultType/update',
  getMachineUserList: '/check/fault/getMachineUserList?machineId={machineId}',
  saveCheckFault: '/check/fault/save',
  updateCheckStatus: '/check/fault/updateStatus',

  getRecordList: '/check/signIn/list?pageNo={pageNo}&keyword={keyword}&code={code}&startTime={startTime}&endTime={endTime}&status={status}',
  userExcel: '/check/signIn/userExcel',
  updateStatus: '/check/user/updateStatus',
  deleteUser: '/check/user/delete',

  // replenishList: '/supply/channel/history/list?pageNo={pageNo}',
  // replenishDetail: '/supply/channel/history/detail?batchNo={batchNo}',

  replenishList: '/supply/channel/history/dayGoodsList?pageNo={pageNo}&areaCode={areaCode}&beginTime={beginTime}&endTime={endTime}&keyword={keyword}',
  replenishDetail: '/supply/channel/history/dayGoodsDetail?machineId={machineId}&datetime={datetime}',
  updateSignInStatus: '/check/signIn/updateStatus',

});

export default api;
