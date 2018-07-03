import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  getPointLocationList: '/merchant/pointLocationManage/pointLocationLists?pageNo={pageNo}&keyword={keyword}',
  savePointLocation: '/merchant/pointLocationManage/save',
  updatePointLocation: '/merchant/pointLocationManage/updatePointLocation',
  deletePointLocation: '/merchant/pointLocationManage/deletePointLocation',
});

export default api;
