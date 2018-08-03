import { map } from '../../utils/fetch/api';
import {editScheduleSetting} from "./scheduleSetting";

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

  getScheduleSettingList: '/project/activityPlan/list?code={code}&startTime={startTime}&endTime={endTime}&status={status}',
  saveScheduleSetting: '/project/activityPlan/add',
  updateScheduleSetting: '/project/activityPlan/update',
  deleteScheduleSetting: '/project/activityPlan/delete',
  getScheduleSettingDetail: '/project/activityPlan/detail?id={id}',
  selectAreaMachines: '/project/activityPlan/selectAreaMachines?code={code}&level={level}&startTime={startTime}&endTime={endTime}',
  getActivityList: '/project/activity/getList',
  getGameList: '/project/game/getList',
  getPlanMachineDetailList: '/project/activityPlan/planMachineDetailList?id={id}',
  getGoodsList: '/project/goods/getList?shopId={shopId}',
  getDefaultActivity: '/project/activity/getDefaultActivity',

  getGameSettingList: '/project/game/list?pageNo={pageNo}&keyword={keyword}&code={code}',
  saveGameSetting: '/project/game/add',
  updateGameSetting: '/project/game/update',
  deleteGameSetting: '/project/game/delete',
  getGameSettingDetail: '/project/game/detail?id={id}',
  // getShopsList: '/project/shops/getList',
  // getMerchantsList: '/project/merchant/getList',
  // getActivityList: '/project/activity/getList',

  getGoodsSettingList: '/project/goods/list?pageNo={pageNo}&keyword={keyword}&code={code}',
  saveGoodsSetting: '/project/goods/add',
  updateGoodsSetting: '/project/goods//update',
  deleteGoodsSetting: '/project/goods/delete',
  getGoodsSettingDetail: '/project/goods/detail?id={id}',
  // getShopsList: '/project/shops/getList',
  // getMerchantsList: '/project/merchant/getList',
  // getActivityList: '/project/activity/getList',
});

export default api;
