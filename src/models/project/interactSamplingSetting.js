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
  ruleInteract
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
    *getInteractGoodsList({ payload: { restParams } }, { call }) {
      const response = yield call(getInteractGoodsList, { restParams });
      return response;
    },
    *getInteractMerchantList({ payload: { restParams } }, { call }) {
      const response = yield call(getInteractMerchantList, { restParams });
      return response;
    },
    *getInteractShopsList({ payload: { restParams } }, { call }) {
      const response = yield call(getInteractShopsList, { restParams });
      return response;
    },
    *getInteractMachinePlanList({ payload: { restParams } }, { call }) {
      const response = yield call(getInteractMachinePlanList, { restParams });
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
