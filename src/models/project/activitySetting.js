import { getActivitySettingList, getActivitySettingDetail, getMerchantsList, getShopsList,  saveActivitySetting, editActivitySetting, delActivitySetting } from '../../services/project/activitySetting';

export default {
  namespace: 'activitySetting',
  state: {
    list: [],
    page: {},
    datas: {},
  },

  effects: {
    *getActivitySettingList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getActivitySettingList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *getActivitySettingDetail({ payload: { restParams } }, { call }) {
      const response = yield call(getActivitySettingDetail, { restParams });
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
    *saveActivitySetting({ payload: { params } }, { call }) {
      const response = yield call(saveActivitySetting, { params });
      return response;
    },
    *editActivitySetting({ payload: { params } }, { call }) {
      const response = yield call(editActivitySetting, { params });
      return response;
    },
    *delActivitySetting({ payload: { params } }, { call }) {
      const response = yield call(delActivitySetting, { params });
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
