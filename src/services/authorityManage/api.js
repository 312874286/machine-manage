import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  getTestList: '/paas/newGoodsOperation/getGoodsOperations?keyword={keyword}&pageNo={pageNo}',
});

export default api;
