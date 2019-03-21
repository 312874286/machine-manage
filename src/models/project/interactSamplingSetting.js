import {
  interactLists,
  interactAdd,
  merchantAdd,
  shopsAdd,
  goodsAdd,
  interactNext,
  updateGoods,
  updateMerchant,
  updateShops,
  deleteGoods,
  deleteMerchant,
  deleteShops,
  getInteractGoodsList,
  getInteractMerchantList,
  getInteractShopsList,
  getInteractMachinePlanList,
  addInteractMachine,
  addInteractMachineGoods,
  deleteInteractMachine,
  getInteractAllGoodsList,
  getInteractMachineGoodsList,
  ruleInteract,
  getGameList,
  getChannelsList,
  getMerchantDetail,
  getGoodsDetail,
  getShopsDetail,
  interactDetail,
  interactUpdate,
  getMerchantTree,
  getMachineTree,
  getInteractHavingMachineList,
  getInteractMachineGoods,
  getInteractMachineList,
  deleteInteractMachineGoods,
  getInteractMachineDetail,
  updateInteractMachineGoods,
  getOrderStatistics,
  getGoodsStatistics,
  couponGetList,
  activityExcel,

  checkMerchantUser,
  checkMerchant,
  checkShops,
  getBaseDict,
  getGameRuleList,


  addCoupon,
  updateCoupon,
  getToAddList,

  enterLists,
  updateEnter,
  updateBatchEnter,
} from "../../services/project/interactSamplingSetting";

export default {
  namespace: "interactSamplingSetting",
  state: {
    list: [],
    page: {},
    datas: {},
    unColumn: []
  },

  effects: {
    *interactLists(
      {
        payload: { restParams }
      },
      { call, put }
    ) {
      const response = yield call(interactLists, { restParams });
      yield put({
        type: "saveList",
        payload: response
      });
    },
    *interactDataLists(
      {
        payload: { restParams }
      },
      { call, put }
    ) {
      const response = yield call(interactLists, { restParams });
      return response;
    },
    *getGameList(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(getGameList, { params });
      return response;
    },
    *getChannelsList(
      {
        payload: { restParams }
      },
      { call }
    ) {
      const response = yield call(getChannelsList, { restParams });
      return response.data;
    },
    *interactAdd(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(interactAdd, { params });
      return response;
    },
    *merchantAdd(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(merchantAdd, { params });
      return response;
    },
    *shopsAdd(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(shopsAdd, { params });
      return response;
    },
    *goodsAdd(
      {
        payload: { params }
      },
      { call, put }
    ) {
      const response = yield call(goodsAdd, { params });
      return response;
    },
    *addCoupon(
      {
        payload: { params }
      },
      { call, put }
    ) {
      const response = yield call(addCoupon, { params });
      return response;
    },
    *updateCoupon(
      {
        payload: { params }
      },
      { call, put }
    ) {
      const response = yield call(updateCoupon, { params });
      return response;
    },
    *getToAddList(
      {
        payload: { params }
      },
      { call, put }
    ) {
      const response = yield call(getToAddList, { params });
      return response;
    },
    *interactNext(
      {
        payload: { restParams }
      },
      { call }
    ) {
      const response = yield call(interactNext, { restParams });
      return response;
    },
    *interactUpdate(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(interactUpdate, { params });
      return response;
    },
    *updateGoods(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(updateGoods, { params });
      return response;
    },
    *updateMerchant(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(updateMerchant, { params });
      return response;
    },
    *updateShops(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(updateShops, { params });
      return response;
    },
    *deleteGoods(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(deleteGoods, { params });
      return response;
    },
    *deleteMerchant(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(deleteMerchant, { params });
      return response;
    },
    *deleteShops(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(deleteShops, { params });
      return response;
    },
    *getInteractGoodsList(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(getInteractGoodsList, { params });
      return response;
    },
    *getInteractMerchantList(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(getInteractMerchantList, { params });
      return response;
    },
    *getInteractShopsList(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(getInteractShopsList, { params });
      return response;
    },
    *interactDetail(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(interactDetail, { params });
      return response.data;
    },
    *getMerchantDetail(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(getMerchantDetail, { params });
      return response.data;
    },
    *getShopsDetail(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(getShopsDetail, { params });
      return response.data;
    },
    *getGoodsDetail(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(getGoodsDetail, { params });
      return response.data;
    },
    *getInteractMachinePlanList(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(getInteractMachinePlanList, { params });
      return response;
    },
    *addInteractMachine(
      {
        payload: { params }
      },
      { call, put }
    ) {
      const response = yield call(addInteractMachine, { params });
      return response;
    },
    *addInteractMachineGoods(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(addInteractMachineGoods, { params });
      return response;
    },
    *deleteInteractMachine(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(deleteInteractMachine, { params });
      return response;
    },
    *deleteInteractMachineGoods(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(deleteInteractMachineGoods, { params });
      return response;
    },
    *getInteractAllGoodsList(
      {
        payload: { restParams }
      },
      { call }
    ) {
      const response = yield call(getInteractAllGoodsList, { restParams });
      return response;
    },
    *getInteractMachineGoodsList(
      {
        payload: { restParams }
      },
      { call, put }
    ) {
      const response = yield call(getInteractMachineGoodsList, { params });
      return response;
    },
    *getMerchantTree(
      {
        payload: { restParams }
      },
      { call }
    ) {
      const response = yield call(getMerchantTree, { restParams });
      return response;
    },
    *getMachineTree(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(getMachineTree, { params });
      return response;
    },
    *ruleInteract(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(ruleInteract, { params });
      return response;
    },
    *getInteractHavingMachineList(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(getInteractHavingMachineList, { params });
      return response;
    },
    *getInteractMachineGoods(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(getInteractMachineGoods, { params });
      return response;
    },
    *getInteractMachineList(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(getInteractMachineList, { params });
      return response;
    },
    *getInteractMachineDetail(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(getInteractMachineDetail, { params });
      return response;
    },
    *updateInteractMachineGoods(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(updateInteractMachineGoods, { params });
      return response;
    },
    *getOrderStatistics({ payload: { params }},{ call, put }) {
      const response = yield call(getOrderStatistics, { params });
      return response;
    },
    *getGoodsStatistics({ payload: { params }},{ call, put }) {
      const response = yield call(getGoodsStatistics, { params });
      return response;
    },
    *couponGetList({ payload: { restParams }},{ call }) {
      const response = yield call(couponGetList, { restParams });
      return response;
    },
    *activityExcel({ payload: { restParams } }, { call, put }) {
      const response = yield call(activityExcel, { restParams });
      return response;
    },
    *checkMerchantUser(
      {
        payload: { restParams }
      },
      { call }
    ) {
      const response = yield call(checkMerchantUser, { restParams });
      return response.data;
    },
    *checkMerchant(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(checkMerchant, { params });
      return response;
    },
    *checkShop(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(checkShops, { params });
      return response;
    },
    *getBaseDict(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(getBaseDict, { params });
      return response;
    },
    *getGameRuleList(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(getGameRuleList, { params });
      return response;
    },
    *enterLists(
      {
        payload: { restParams }
      },
      { call }
    ) {
      const response = yield call(enterLists, { restParams });
      return response;
    },
    *updateEnter(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(updateEnter, { params });
      return response;
    },
    *updateBatchEnter(
      {
        payload: { params }
      },
      { call }
    ) {
      const response = yield call(updateBatchEnter, { params });
      return response;
    }
  },
  reducers: {
    saveList(
      state,
      {
        payload: { data, page, unColumn }
      }
    ) {
      return {
        ...state,
        list: data,
        page: {
          total: page.totalCount,
          pageSize: page.pageSize,
          current: page.pageNo
        },
        unColumn: unColumn
      };
    }
  }
};
