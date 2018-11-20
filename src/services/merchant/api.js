import { map } from "../../utils/fetch/api";

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  getMerchantSettingList:
    "/project/merchant/list?pageNo={pageNo}&keyword={keyword}&code={code}",
  saveMerchantSetting: "/project/merchant/add",
  updateMerchantSetting: "/project/merchant/update",
  deleteMerchantSetting: "/project/merchant/delete",
  getMerchantSettingDetail: "/project/merchant/detail?id={id}",
  getMerchantsList: "/project/merchant/getList",
  getShopSettingList:
    "/project/shops/list?pageNo={pageNo}&keyword={keyword}&code={code}",
  saveShopSetting: "/project/shops/add",
  updateShopSetting: "/project/shops/update",
  deleteShopSetting: "/project/shops/delete",
  getShopSettingDetail: "/project/shops/detail?id={id}",


  getBaseDict: '/project/dictionary/getBaseDict',
  alterStatus: '/inno72/merchant/user/alterStatus',
  resetPwd: '/inno72/merchant/user/resetPwd',
  getChannelList: '/project/channel/getList',
  updateMerchantSetting: "/project/merchant/update",
  uploadFile: '/project/merchant/uploadImage'
});




export default api;
