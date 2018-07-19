import { getGoodsSettingList, getGoodsSettingDetail, getMerchantsList, getShopsList, getActivityList, saveGoodsSetting, editGoodsSetting, delGoodsSetting } from '../../services/goods/goodsSetting';

export default {
  namespace: 'punchingRecord',
  state: {
    list: [],
    page: {},
    datas: {},
  },

  effects: {
    *getGoodsSettingList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getGoodsSettingList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *getGoodsSettingDetail({ payload: { restParams } }, { call }) {
      const response = yield call(getGoodsSettingDetail, { restParams });
      return response.data;
    },
    *getMerchantsList({ payload: { restParams } }, { call }) {
      const response = yield call(getMerchantsList, { restParams });
      return response.data;
    },
    *getShopsList({ payload: { restParams } }, { call }) {
      const response = yield call(getShopsList, { restParams });
      return response.data;
    },
    *getActivityList({ payload: { restParams } }, { call }) {
      const response = yield call(getActivityList, { restParams });
      return response.data;
    },
    *saveGoodsSetting({ payload: { params } }, { call }) {
      const response = yield call(saveGoodsSetting, { params });
      return response;
    },
    *editGoodsSetting({ payload: { params } }, { call }) {
      const response = yield call(editGoodsSetting, { params });
      return response;
    },
    *delGoodsSetting({ payload: { params } }, { call }) {
      const response = yield call(delGoodsSetting, { params });
      return response;
    },
  },

  reducers: {
    saveList(state, { payload: { data, page } }) {
      return {
        ...state,
        list: data,
        page: {
          total: page.totalCount,
          pageSize: page.pageSize,
          current: page.pageNo,
        },
      };
    },
  },
};
