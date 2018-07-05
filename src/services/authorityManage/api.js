import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  getTestList: '/account/getTestList?keyword={keyword}&pageNo={pageNo}',
});

export default api;
