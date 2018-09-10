import { getMerchantSettingList, getMerchantSettingDetail, getChannelsList, saveMerchantSetting, editMerchantSetting, delMerchantSetting } from '../../services/project/merchantSetting';

export default {
  namespace: 'merchantSetting',
  state: {
    list: [],
    page: {},
    datas: {},
    unColumn: []
  },

  effects: {
    *getMerchantSettingList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getMerchantSettingList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *getMerchantSettingDetail({ payload: { restParams } }, { call }) {
      const response = yield call(getMerchantSettingDetail, { restParams });
      return response.data;
    },
    *getChannelsList({ payload: { restParams } }, { call }) {
      const response = yield call(getChannelsList, { restParams });
      return response.data;
    },
    *saveMerchantSetting({ payload: { params } }, { call }) {
      const response = yield call(saveMerchantSetting, { params });
      return response;
    },
    *editMerchantSetting({ payload: { params } }, { call }) {
      const response = yield call(editMerchantSetting, { params });
      return response;
    },
    *delMerchantSetting({ payload: { params } }, { call }) {
      const response = yield call(delMerchantSetting, { params });
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
