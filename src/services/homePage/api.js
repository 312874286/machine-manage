import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  findMachinePortalData: '/machine/machine/findMachinePortalData',
  findExceptionMachine: '/machine/machine/findExceptionMachine?type={type}'
});

export default api;
