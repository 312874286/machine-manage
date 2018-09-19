import { interactLists,
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
  ruleInteract } from '../../services/project/interactSamplingSetting';


export default {
  namespace: 'interactSamplingSetting',
  state: {
    list: [],
    page: {},
    datas: {},
    unColumn: []
  },

  effects: {
    *areaList({ payload: { restParams } }, { call, put }) {
      const response = yield call(areaList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *addArea({ payload: { params } }, { call }) {
      const response = yield call(addArea, { params });
      return response;
    },
    *updateArea({ payload: { params } }, { call }) {
      const response = yield call(updateArea, { params });
      return response;
    },
    *areaDetail({ payload: { restParams } }, { call }) {
      const response = yield call(areaDetail, { restParams });
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
