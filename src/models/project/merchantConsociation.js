import { getMerchantSettingList, getMerchantSettingDetail, saveMerchantSetting, editMerchantSetting, getMerchantsList, uploadFile } from '../../services/merchant/merchantConsociation';


export default {
  namespace: 'merchantConsociation',
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
    *saveMerchantSetting({ payload: { params } }, { call }) {
      const response = yield call(saveMerchantSetting, { params });
      return response;
    },
    *editMerchantSetting({ payload: { params } }, { call }) {
      const response = yield call(editMerchantSetting, { params });
      return response;
    },
    *getMerchantsList({ payload: { restParams } }, { call }) {
      const response = yield call(getMerchantsList, { restParams });
      return response.data;
    },
    *upload({ payload: { params, restParams } }, { call }) {
      const response = yield call(uploadFile, { params, restParams });
      return response;
    }
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
