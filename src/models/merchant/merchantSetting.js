import { getMerchantSettingList, getMerchantSettingDetail,
  getChannelsList, saveMerchantSetting, editMerchantSetting,
  getBaseDict, alterStatus, resetPwd } from '../../services/merchant/merchantSetting';

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
    *getBaseDict({ payload: { params } }, { call }) {
      const response = yield call(getBaseDict, { params });
      return response;
    },
    *alterStatus({ payload: { params } }, { call }) {
      const response = yield call(alterStatus, { params });
      return response;
    },
    *resetPwd({ payload: { params } }, { call }) {
      const response = yield call(resetPwd, { params });
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
