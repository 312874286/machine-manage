import { getShopSettingList, getShopSettingDetail, getMerchantsList, saveShopSetting, editShopSetting, delShopSetting } from '../../services/project/shopSetting';

export default {
  namespace: 'shopSetting',
  state: {
    list: [],
    page: {},
    datas: {},
  },

  effects: {
    *getShopSettingList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getShopSettingList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *getShopSettingDetail({ payload: { restParams } }, { call }) {
      const response = yield call(getShopSettingDetail, { restParams });
      return response.data;
    },
    *getMerchantsList({ payload: { restParams } }, { call }) {
      const response = yield call(getMerchantsList, { restParams });
      return response.data;
    },
    *saveShopSetting({ payload: { params } }, { call }) {
      const response = yield call(saveShopSetting, { params });
      return response;
    },
    *editShopSetting({ payload: { params } }, { call }) {
      const response = yield call(editShopSetting, { params });
      return response;
    },
    *delShopSetting({ payload: { params } }, { call }) {
      const response = yield call(delShopSetting, { params });
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
