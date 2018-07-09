import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  getGameSettingList: '/game/game/list?pageNo={pageNo}&keyword={keyword}&code={code}',
  saveGameSetting: '/game/game/add',
  updateGameSetting: '/game/game/update',
  deleteGameSetting: '/game/game/delete',
  getGameSettingDetail: '/game/game/detail?id={id}',
  getShopsList: '/project/shops/getList',
  getMerchantsList: '/project/merchant/getList',
  getActivityList: '/project/activity/getList',
});

export default api;
