import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  getMachineList: '/merchant/MachineManage/MachineLists?pageNo={pageNo}&keyword={keyword}',
  saveMachine: '/merchant/MachineManage/save',
  updateMachine: '/merchant/MachineManage/updateMachine',
  deleteMachine: '/merchant/MachineManage/deleteMachine',
});

export default api;
