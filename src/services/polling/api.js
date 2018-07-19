import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  getCheckFaultList: '/check/fault/list?pageNo={pageNo}&keyword={keyword}',
  getCheckFaultDetail: '/check/fault/detail',
  CheckFaultAnswer: '/check/fault/answer',

  getUserList: '/check/user/list?pageNo={pageNo}&keyword={keyword}',
  getUserMachineDetailList: '/check/user/getUserMachinDetailList?id={id}',
  getUserDetail: '/check/user/detail?id={id}',
  saveUser: '/check/user/update/add',
  updateUser: '/check/user/update',
  selectMachine: '/project/activityPlan/selectAreaMachines?code={code}&level={level}',


});

export default api;
