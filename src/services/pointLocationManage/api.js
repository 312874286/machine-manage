import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  getPatientList: '/merchant/patientOpenidRel/findPatientOpenidRels?pageNo={pageNo}&keyword={keyword}',
  savePatient: '/merchant/patientOpenidRel/save',
  getRecordList: '/merchant/patient/findPatients?pageNo={pageNo}&keyword={keyword}',
  saveRecord: '/merchant/patient/save',
});

export default api;
