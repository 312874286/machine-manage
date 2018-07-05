import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  getSystemUserList: '/system/user/list?keyword={keyword}',
  getAccountSystemUserList: '/accountsystem/user/list?keyword={keyword}',
});

export default api;
