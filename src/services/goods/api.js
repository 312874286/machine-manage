import { map } from '../../utils/fetch/api';

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  getGoodsSettingList: '/goods/goods/list?pageNo={pageNo}&keyword={keyword}&code={code}',
  saveGoodsSetting: '/goods/goods/add',
  updateGoodsSetting: '/goods/goods//update',
  deleteGoodsSetting: '/goods/goods/delete',
  getGoodsSettingDetail: '/goods/goods/detail?id={id}',
  getShopsList: '/project/shops/getList',
  getMerchantsList: '/project/merchant/getList',
  getActivityList: '/project/activity/getList',
});

export default api;
