import { getMerchantList, getMerchantDetail,
  getChannelsList, saveMerchant, editMerchantSetting,
  getBaseDict, alterStatus, resetPwd, activityLists, activityInfo,
  addActivityInfo, deleteActivityInfo, saveIndex, deleteActivityIndex
} from '../../services/merchant/merchantSetting';

export default {
  namespace: 'merchant',
  state: {
    list: [],
    page: {},
    datas: {},
    unColumn: []
  },

  effects: {
    *getMerchantList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getMerchantList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *getMerchantDetail({ payload: { restParams } }, { call }) {
      const response = yield call(getMerchantDetail, { restParams });
      return response.data;
    },
    *getChannelsList({ payload: { restParams } }, { call }) {
      const response = yield call(getChannelsList, { restParams });
      return response.data;
    },
    *saveMerchant({ payload: { params } }, { call }) {
      const response = yield call(saveMerchant, { params });
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
    *activityLists({ payload: { restParams } }, { call }) {
      const response = yield call(activityLists, { restParams });
      return response;
    },
    *activityInfo({ payload: { restParams } }, { call }) {
      const response = yield call(activityInfo, { restParams });
      return response;
    },
    *addActivityInfo({ payload: { params } }, { call }) {
      const response = yield call(addActivityInfo, { params });
      return response;
    },
    *deleteActivityInfo({ payload: { params } }, { call }) {
      const response = yield call(deleteActivityInfo, { params });
      return response;
    },
    *saveIndex({ payload: { params } }, { call }) {
      const response = yield call(saveIndex, { params });
      return response;
    },
    *deleteActivityIndex({ payload: { params } }, { call }) {
      const response = yield call(deleteActivityIndex, { params });
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
