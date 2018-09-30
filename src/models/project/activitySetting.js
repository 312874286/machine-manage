import { getActivitySettingList, getActivityCount, getActivitySettingDetail, getMerchantsList, getShopsList,  saveActivitySetting, editActivitySetting, delActivitySetting, getGameList, getDefaultActivity, getMerchantShops, paiActivity,getOrderStatistics,getGoodsStatistics } from '../../services/project/activitySetting';

export default {
  namespace: 'activitySetting',
  state: {
    list: [],
    page: {},
    datas: {},
    activityCountList: [],
    activityPaiCountList: [],
    count: {},
    PaiCount: {},
    unColumn: []
  },

  effects: {
    *getActivitySettingList({ payload: { restParams } }, { call, put }) {
      const response = yield call(getActivitySettingList, { restParams });
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
    *getActivityCount({ payload: { restParams } }, { call, put }) {
      const response = yield call(getActivityCount, { restParams });
      yield put({
        type: 'saveCountList',
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
    *getMerchantShops({ payload: { restParams } }, { call }) {
      const response = yield call(getMerchantShops, { restParams });
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
    *gameList({ payload: { params } }, { call }) {
      const response = yield call(getGameList, { params });
      return response.data;
    },
    // getDefaultActivity
    *getDefaultActivity({ payload: { restParams } }, { call }) {
      const response = yield call(getDefaultActivity, { restParams });
      return response.data;
    },
    *paiActivity({ payload: { params } }, { call, put }) {
      const response = yield call(paiActivity, { params });
      yield put({
        type: 'savePaiCountList',
        payload: response,
      });
    },
    *getOrderStatistics({ payload: { params }},{ call, put }) {
      const response = yield call(getOrderStatistics, { params });
      return response;
    },
    *getGoodsStatistics({ payload: { params }},{ call, put }) {
      const response = yield call(getGoodsStatistics, { params });
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
    saveCountList(state, { payload: { data } }) {
      return {
        ...state,
        activityCountList: data.list,
        count: {
          totalGoodsCount: data.totalGoodsCount,
          totalUserCount: data.totalUserCount,
          totalPayCount: data.totalPayCount,
          totalCouponCount: data.totalCouponCount,
          totalOrderCount: data.totalOrderCount,
        }
      };
    },
    savePaiCountList(state, { payload: { data } }) {
      return {
        ...state,
        activityPaiCountList: data.list,
        PaiCount: {
          totalGoodsCount: data.totalGoodsCount,
          totalUserCount: data.totalUserCount,
          totalPayCount: data.totalPayCount,
          totalOrderCount: data.totalOrderCount,
        }
      };
    },
  },
};
