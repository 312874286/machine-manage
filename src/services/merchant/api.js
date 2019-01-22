import { map } from "../../utils/fetch/api";

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  getMerchantSettingList:
    "/project/merchant/list?pageNo={pageNo}&keyword={keyword}&code={code}",
  saveMerchantSetting: "/project/merchant/add",
  updateMerchantSetting: "/project/merchant/update",
  deleteMerchantSetting: "/project/merchant/delete",
  getMerchantSettingDetail: "/project/merchant/detail?id={id}",
  getMerchantsList: "/project/merchant/getList?channelId={channelId}",
  getMerchantsListAll: "/inno72/merchant/user/getList",
  getShopSettingList:
    "/project/shops/list?pageNo={pageNo}&keyword={keyword}&code={code}",
  saveShopSetting: "/project/shops/add",
  updateShopSetting: "/project/shops/update",
  deleteShopSetting: "/project/shops/delete",
  getShopSettingDetail: "/project/shops/detail?id={id}",

  getMerchantList: '/inno72/merchant/user/list?pageNo={pageNo}&keyword={keyword}',
  getMerchantDetail: '/inno72/merchant/user/detail?id={id}',
  saveMerchant: '/inno72/merchant/user/save',
  getBaseDict: '/project/dictionary/getBaseDict',
  alterStatus: '/inno72/merchant/user/alterStatus',
  resetPwd: '/inno72/merchant/user/resetPwd',
  getChannelList: '/project/channel/getList',
  updateMerchantSetting: "/project/merchant/update",
  uploadFile: '/project/merchant/uploadImage',

  activityLists: '/inno72/merchant/user/activity?merchantId={merchantId}',
  activityInfo: '/inno72/activity/index/activityInfo?merchantId={merchantId}&activityId={activityId}',
  addActivityInfo: '/inno72/activity/info/add',
  deleteActivityInfo: '/inno72/activity/info/delete',
  saveIndex: '/inno72/activity/index/saveIndex',
});




export default api;
