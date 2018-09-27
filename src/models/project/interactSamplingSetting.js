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
} from '../../services/project/interactSamplingSetting';


export default {
  namespace: 'interactSamplingSetting',
  state: {
    list: [],
    page: {},
    datas: {},
    unColumn: []
  },

  effects: {
    *interactLists({ payload: { restParams } }, { call, put }) {
      const response = yield call(interactLists, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *getGameList({ payload: { params } }, { call }) {
      const response = yield call(getGameList, { params });
      return response;
    },
    *getChannelsList({ payload: { restParams } }, { call }) {
      const response = yield call(getChannelsList, { restParams });
      return response.data;
    },
    *interactAdd({ payload: { params } }, { call }) {
      const response = yield call(interactAdd, { params });
      return response;
    },
    *merchantAdd({ payload: { params } }, { call }) {
      const response = yield call(merchantAdd, { params });
      return response;
    },
    *shopsAdd({ payload: { params } }, { call }) {
      const response = yield call(shopsAdd, { params });
      return response;
    },
    *goodsAdd({ payload: { params } }, { call, put }) {
      const response = yield call(goodsAdd, { params });
      return response;
    },
    *interactNext({ payload: { restParams } }, { call }) {
      const response = yield call(interactNext, { restParams });
      return response;
    },
    *updateGoods({ payload: { params } }, { call }) {
      const response = yield call(updateGoods, { params });
      return response;
    },
    *updateMerchant({ payload: { params } }, { call }) {
      const response = yield call(updateMerchant, { params });
      return response;
    },
    *updateShops({ payload: { params } }, { call }) {
      const response = yield call(updateShops, { params });
      return response;
    },
    *deleteGoods({ payload: { params } }, { call }) {
      const response = yield call(deleteGoods, { params });
      return response;
    },
    *deleteMerchant({ payload: { params } }, { call }) {
      const response = yield call(deleteMerchant, { params });
      return response;
    },
    *deleteShops({ payload: { params } }, { call }) {
      const response = yield call(deleteShops, { params });
      return response;
    },
    *getInteractGoodsList({ payload: { params } }, { call }) {
      const response = yield call(getInteractGoodsList, { params });
      return response;
    },
    *getInteractMerchantList({ payload: { params } }, { call }) {
      const response = yield call(getInteractMerchantList, { params });
      return response;
    },
    *getInteractShopsList({ payload: { params } }, { call }) {
      const response = yield call(getInteractShopsList, { params });
      return response;
    },
    *getMerchantDetail({ payload: { params } }, { call }) {
      const response = yield call(getMerchantDetail, { params });
      return response.data;
    },
    *getShopsDetail({ payload: { params } }, { call }) {
      const response = yield call(getShopsDetail, { params });
      return response.data;
    },
    *getGoodsDetail({ payload: { params } }, { call }) {
      const response = yield call(getGoodsDetail, { params });
      return response.data;
    },
    *getInteractMachinePlanList({ payload: { params } }, { call }) {
      const response = yield call(getInteractMachinePlanList, { params });
      return response;
    },
    *addInteractMachine({ payload: { params } }, { call, put }) {
      const response = yield call(addInteractMachine, { params });
      return response;
    },
    *addInteractMachineGoods({ payload: { params } }, { call }) {
      const response = yield call(addInteractMachineGoods, { params });
      return response;
    },
    *deleteInteractMachine({ payload: { params } }, { call }) {
      const response = yield call(deleteInteractMachine, { params });
      return response;
    },
    *getInteractAllGoodsList({ payload: { restParams } }, { call }) {
      const response = yield call(getInteractAllGoodsList, { restParams });
      return response;
    },
    *getInteractMachineGoodsList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getInteractMachineGoodsList, { restParams });
      return response;
    },
    *ruleInteract({ payload: { params } }, { call }) {
      const response = yield call(ruleInteract, { params });
      return response;
    },
  },
  reducers: {
    saveList(state, { payload: { data, page, unColumn } }) {
      return {
        ...state,
        list: data,
        page: {
          total: page.totalCount,
          pageSize: page.pageSize,
          current: page.pageNo,
        },
        unColumn: unColumn
      };
    },
  },
};
