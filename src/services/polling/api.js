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
  selectMachine: '/check/user/selectAreaMachines?code={code}',

  getCheckFaultTypeList: '/check/faultType/list',
  getCheckFaultTypeAdd: '/check/faultType/add',
  getCheckFaultTypeDetail: '/check/faultType/detail',
  getCheckFaultTypeUpdate: '/check/faultType/update',

  getRecordList: '/check/signIn/list?pageNo={pageNo}&keyword={keyword}&code={code}',
  userExcel: '/check/signIn/userExcel',

});

export default api;
