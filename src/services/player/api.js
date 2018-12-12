import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  getList: '/game/user/list?pageNo={pageNo}&keyword={keyword}&sex={sex}&time={time}&code={code}',
  getAreaList: '/game/user/areaList?userId={userId}',
});

export default api;
