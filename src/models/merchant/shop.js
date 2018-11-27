import { getShopSettingList, getShopSettingDetail, getMerchantsList, saveShopSetting, editShopSetting, getBaseDict, getChannelList, alterStatus } from '../../services/merchant/shopSetting';

export default {
  namespace: 'shop',
  state: {
    list: [],
    page: {},
    datas: {},
    unColumn: []
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
      return response;
    },
    *getChannelList({ payload: { restParams } }, { call }) {
      const response = yield call(getChannelList, { restParams });
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
    *getBaseDict({ payload: { params } }, { call }) {
      const response = yield call(getBaseDict, { params });
      return response;
    },
    *alterStatus({ payload: { params } }, { call }) {
      const response = yield call(alterStatus, { params });
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
        unColumn,
      };
    },
  },
};
