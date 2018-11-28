import { map } from "../../utils/fetch/api";
import { editScheduleSetting } from "./scheduleSetting";

// API Doc: http://wiki.nblow.cn/pages/viewpage.action?pageId=11797216
const api = map({
  getChannelSettingList:
    "/project/channel/list?pageNo={pageNo}&keyword={keyword}",
  saveChannelSetting: "/project/channel/add",
  updateChannelSetting: "/project/channel/update",
  deleteChannelSetting: "/project/channel/delete",
  getChannelSettingDetail: "/project/channel/detail?id={id}",
  getChannelsList: "/project/channel/getList",
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
  getActivitySettingList:
    "/project/activity/list?pageNo={pageNo}&keyword={keyword}&type={type}",
  saveActivitySetting: "/project/activity/add",
  updateActivitySetting: "/project/activity/update",
  deleteActivitySetting: "/project/activity/delete",
  getActivitySettingDetail: "/project/activity/detail?id={id}",
  getShopsList: "/project/shops/getList?sellerId={sellerId}",
  getMerchantShops: "/project/shops/selectMerchantShops?sellerId={sellerId}",
  getActivityShops:
    "/project/shops/selectActivityShops?activityId={activityId}",

  getScheduleSettingList:
    "/project/activityPlan/list?code={code}&startTime={startTime}&endTime={endTime}&status={status}&type={type}&keyword={keyword}",
  saveScheduleSetting: "/project/activityPlan/add",
  updateScheduleSetting: "/project/activityPlan/update",
  deleteScheduleSetting: "/project/activityPlan/delete?status=1",
  getScheduleSettingDetail: "/project/activityPlan/detail?id={id}",
  selectAreaMachines: "/project/activityPlan/selectAreaMachines",
  getActivityList: "/project/activity/getList",
  getActivityCount: "/activity/data/count/list",
  getGameList: "/project/game/getList",
  getPlanMachineDetailList:
    "/project/activityPlan/planMachineDetailList?id={id}",
  getGoodsList: "/project/goods/getList?shopId={shopId}",
  getDefaultActivity: "/project/activity/getDefaultActivity",

  getGameSettingList:
    "/project/game/list?pageNo={pageNo}&keyword={keyword}&code={code}",
  saveGameSetting: "/project/game/add",
  updateGameSetting: "/project/game/update",
  deleteGameSetting: "/project/game/delete",
  getGameSettingDetail: "/project/game/detail?id={id}",
  // getShopsList: '/project/shops/getList',
  // getMerchantsList: '/project/merchant/getList',
  // getActivityList: '/project/activity/getList',

  getGoodsSettingList:
    "/project/goods/list?pageNo={pageNo}&keyword={keyword}&code={code}",
  saveGoodsSetting: "/project/goods/add",
  updateGoodsSetting: "/project/goods/update",
  deleteGoodsSetting: "/project/goods/delete",
  getGoodsSettingDetail: "/project/goods/detail?id={id}",
  // getShopsList: '/project/shops/getList',
  // getMerchantsList: '/project/merchant/getList',
  // getActivityList: '/project/activity/getList',
  getMachinePLanSetting: '/machine/machine/planList?machineCode={machineCode}&startTime={startTime}&localCode={localCode}&endTime={endTime}&status={status}',

  paiActivity: "/pai/data/count/list",

  // 互派活动
  interactLists:
    "/project/interact/list?status={status}&keyword={keyword}&pageNo={pageNo}&orderBy={orderBy}",
  interactAdd: "/project/interact/add",
  interactDetail: "/project/interact/detail",
  interactUpdate: "/project/interact/update",
  // 第二步 商户商品信息
  merchantAdd: "/project/interact/merchant/add",
  shopsAdd: "/project/interact/shops/add",
  goodsAdd: "/project/interact/goods/add",
  interactNext: "/project/interact/next",
  updateGoods: "/project/interact/goods/update",
  updateMerchant: "/project/interact/merchant/update",
  updateShops: "/project/interact/shops/update",
  deleteGoods: "/project/interact/goods/delete",
  deleteMerchant: "/project/interact/merchant/delete",
  deleteShops: "/project/interact/shops/delete",
  getInteractGoodsList: "/project/interact/goods/getList",
  getInteractMerchantList: "/project/interact/merchant/getList",
  getInteractShopsList: "/project/interact/shops/getList",
  getMerchantDetail: "/project/interact/merchant/detail",
  getGoodsDetail: "/project/interact/goods/detail",
  getShopsDetail: "/project/interact/shops/detail",
  merchantTree: "/project/interact/merchantTree?interactId={interactId}",
  couponGetList: "/project/interact/goods/couponGetList?interactId={interactId}&shopsId={shopsId}",
  // 获取客户
  checkMerchantUser: '/project/interact/merchant/checkMerchantUser',
  // 获取待添加商户
  checkMerchant: '/project/interact/merchant/checkMerchant',
  // 获取待添加的店铺
  checkShops: '/project/interact/shops/checkShops',
  // 基础数据查询
  getBaseDict: '/share/getBaseDict',
  // 第三步 选择机器
  getInteractHavingMachineList: "/project/interact/machine/getHavingMachines",
  getInteractMachineGoods: "/project/interact/machine/goods/list",
  getInteractMachinePlanList: "/project/interact/machine/planList",
  getInteractMachineList: "/project/interact/machine/getList",
  addInteractMachine: "/project/interact/machine/add",
  addInteractMachineGoods: "/project/interact/machine/goods/add",
  updateInteractMachineGoods: "/project/interact/machine/update",
  getInteractMachineDetail: "/project/interact/machine/detail",
  deleteInteractMachineGoods: "/project/interact/machine/goods/delete",
  deleteInteractMachine: "/project/interact/machine/delete",
  getInteractAllGoodsList: "/project/interact/goods/getAllList",
  getInteractMachineGoodsList: "/project/interact/machine/goodsList",
  getMachineTree: "/project/interact/machineTree",
  // 第四步 规则设置
  ruleInteract: "/project/interact/rule",

  // 活动到处店铺
  activityExcel: '/project/interact/merchant/exportMachineSellerId',
  // 商户修改是否关注
});




export default api;
