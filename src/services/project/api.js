import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  getChannelSettingList: '/project/channel/list?pageNo={pageNo}&keyword={keyword}',
  saveChannelSetting: '/project/channel/add',
  updateChannelSetting: '/project/channel/update',
  deleteChannelSetting: '/project/channel/delete',
  getChannelSettingDetail: '/project/channel/detail?id={id}',
  getChannelsList: '/project/channel/getList',
  getMerchantSettingList: '/project/merchant/list?pageNo={pageNo}&keyword={keyword}&code={code}',
  saveMerchantSetting: '/project/merchant/add',
  updateMerchantSetting: '/project/merchant/update',
  deleteMerchantSetting: '/project/merchant/delete',
  getMerchantSettingDetail: '/project/merchant/detail?id={id}',
  getMerchantsList: '/project/merchant/getList',
  getShopSettingList: '/project/shops/list?pageNo={pageNo}&keyword={keyword}&code={code}',
  saveShopSetting: '/project/shops/add',
  updateShopSetting: '/project/shops/update',
  deleteShopSetting: '/project/shops/delete',
  getShopSettingDetail: '/project/shops/detail?id={id}',
  getActivitySettingList: '/project/activity/list?pageNo={pageNo}&keyword={keyword}&code={code}',
  saveActivitySetting: '/project/activity/add',
  updateActivitySetting: '/project/activity/update',
  deleteActivitySetting: '/project/activity/delete',
  getActivitySettingDetail: '/project/activity/detail?id={id}',
  getShopsList: '/project/shops/getList?sellerId={sellerId}',
  getScheduleSettingList: '/project/activityPlan/list?code={code}&startTime={startTime}&endTime={endTime}',
  saveScheduleSetting: '/project/schedule/add',
  updateScheduleSetting: '/project/schedule/update',
  deleteScheduleSetting: '/project/schedule/delete',
  getScheduleSettingDetail: '/project/schedule/detail?id={id}',
  getActivityList: '/project/activity/getList',
  getGameList: '/game/game/getList',
});

export default api;
