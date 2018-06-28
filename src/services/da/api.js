import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797230
const api = map({
  getOrderServiceList: '/merchant/export/findExportList',
  exportOrderServiceList: '/merchant/export/export',
});

export default api;
