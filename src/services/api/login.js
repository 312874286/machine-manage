import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  login: '/authent/login',
  logout: '/authent/logout',
  resetPassword: '/authent/applyRest',
  doResetPassword: '/authent/reset',
});

export default api;
